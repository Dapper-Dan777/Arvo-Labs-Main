// api/stripe-webhook.js
// Vercel Serverless Function für Stripe Webhooks
// Vercel erkennt automatisch Functions im api/ Verzeichnis

// Für Vercel: Verwende require für CommonJS-Kompatibilität oder ES Modules
// Diese Version verwendet ES Modules (unterstützt von Vercel)
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service Role Key für Backend-Operationen
);

// Hilfsfunktion für raw body (Vercel)
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}

// Plan-Mapping: Stripe Price ID → Plan Type
const PRICE_TO_PLAN = {
  'price_1SfRXkPgo9Kimm8xHNLvrWVR': 'starter',
  'price_1SfRY5Pgo9Kimm8x04VoyShG': 'pro',
  'price_1SfRYXPgo9Kimm8xe9LWxFwj': 'enterprise',
  'price_1SfRW1Pgo9Kimm8xGy8fUex1': 'individual',
};

// Fallback: Versuche Plan aus Price ID oder Metadata zu extrahieren
function getPlanFromSubscription(subscription) {
  const priceId = subscription.items?.data[0]?.price?.id;
  
  // Prüfe Mapping
  if (PRICE_TO_PLAN[priceId]) {
    return PRICE_TO_PLAN[priceId];
  }
  
  // Prüfe Metadata
  const metadata = subscription.metadata || subscription.items?.data[0]?.price?.metadata || {};
  if (metadata.plan) {
    return metadata.plan.toLowerCase();
  }
  
  // Fallback basierend auf Price ID Name
  const priceName = subscription.items?.data[0]?.price?.nickname?.toLowerCase() || '';
  if (priceName.includes('pro')) return 'pro';
  if (priceName.includes('enterprise')) return 'enterprise';
  if (priceName.includes('individual')) return 'individual';
  
  // Standard
  return 'starter';
}

export default async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  let rawBody;

  try {
    // Raw body lesen (wichtig für Stripe Signatur-Verifizierung)
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('Error reading raw body:', err);
    return res.status(400).json({ error: 'Error reading request body' });
  }

  try {
    // Stripe Event verifizieren
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        const stripeCustomerId = subscription.customer;
        const stripeSubscriptionId = subscription.id;
        const status = subscription.status;

        // User über profiles finden (über stripe_customer_id)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', stripeCustomerId)
          .maybeSingle();

        if (profileError) {
          console.error('Error finding profile:', profileError);
          break;
        }

        if (!profile) {
          console.error('Profile not found for customer:', stripeCustomerId);
          // Versuche über customer email zu finden
          const customer = await stripe.customers.retrieve(stripeCustomerId);
          if (customer.email) {
            const { data: user } = await supabase.auth.admin.listUsers();
            const matchingUser = user.users.find(u => u.email === customer.email);
            if (matchingUser) {
              // Erstelle Profil mit stripe_customer_id
              await supabase
                .from('profiles')
                .upsert({
                  id: matchingUser.id,
                  stripe_customer_id: stripeCustomerId,
                  plan: getPlanFromSubscription(subscription),
                });
            }
          }
          break;
        }

        const userId = profile.id;
        const plan = getPlanFromSubscription(subscription);

        // Update profiles mit Plan
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: stripeCustomerId,
          })
          .eq('id', userId);

        if (profileUpdateError) {
          console.error('Error updating profile:', profileUpdateError);
        }

        // Upsert subscription in subscriptions Tabelle
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              plan_id: subscription.items.data[0]?.price?.id || 'unknown',
              status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            { onConflict: 'user_id' }
          );

        if (upsertError) {
          console.error('Upsert subscription error:', upsertError);
        }

        console.log(`✅ Subscription ${status} for user ${userId}, plan: ${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;

        // Update subscription status
        const { error: subError } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_customer_id', stripeCustomerId);

        if (subError) {
          console.error('Cancel subscription error:', subError);
        }

        // Setze Plan zurück auf 'starter'
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', stripeCustomerId)
          .maybeSingle();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ plan: 'starter' })
            .eq('id', profile.id);
        }

        console.log(`✅ Subscription canceled for customer ${stripeCustomerId}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        const stripeCustomerId = session.customer;
        const userId = session.metadata?.user_id || session.metadata?.supabase_user_id;
        const accountType = session.metadata?.account_type || 'individual';

        // Hole Subscription, um Plan zu bestimmen
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const plan = getPlanFromSubscription(subscription);

          if (userId) {
            // Update profiles mit Plan und Account Type
            await supabase
              .from('profiles')
              .upsert({
                id: userId,
                stripe_customer_id: stripeCustomerId,
                plan,
                account_type: accountType,
              }, { onConflict: 'id' });
          } else if (stripeCustomerId) {
            // Fallback: Finde User über Email
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            if (customer.email) {
              const { data: { users } } = await supabase.auth.admin.listUsers();
              const matchingUser = users?.find(u => u.email === customer.email);
              if (matchingUser) {
                await supabase
                  .from('profiles')
                  .upsert({
                    id: matchingUser.id,
                    stripe_customer_id: stripeCustomerId,
                    plan,
                    account_type: accountType,
                  }, { onConflict: 'id' });
              }
            }
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const stripeCustomerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const plan = getPlanFromSubscription(subscription);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', stripeCustomerId)
            .maybeSingle();

          if (profile) {
            await supabase
              .from('profiles')
              .update({ plan })
              .eq('id', profile.id);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const stripeCustomerId = invoice.customer;
        
        // Optional: Setze Plan zurück oder markiere als past_due
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', stripeCustomerId)
          .maybeSingle();

        if (profile) {
          // Optional: Benachrichtigung an User senden
          console.log(`⚠️ Payment failed for user ${profile.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
}

