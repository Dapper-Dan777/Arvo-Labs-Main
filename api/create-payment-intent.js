// api/create-payment-intent.js
// Vercel Serverless Function für Stripe Payment Intent Erstellung (für Subscriptions)
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body;
    try {
      const rawBody = await getRawBody(req);
      body = JSON.parse(rawBody.toString());
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { userId, priceId } = body;

    if (!userId || !priceId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'priceId']
      });
    }

    // User-Profil holen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return res.status(500).json({ error: 'Profile lookup failed' });
    }

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // User-Email aus auth.users holen
    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError) {
      console.error('Auth user lookup error:', authError);
    }

    let stripeCustomerId = profile.stripe_customer_id;

    // Falls noch kein Stripe Customer existiert → erstellen
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: authUser?.email || undefined,
          metadata: { 
            user_id: userId,
            supabase_user_id: userId,
          },
        });

        stripeCustomerId = customer.id;

        // In profiles speichern
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile with customer ID:', updateError);
        }

        console.log(`✅ Created Stripe customer ${stripeCustomerId} for user ${userId}`);
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError);
        return res.status(500).json({ 
          error: 'Failed to create Stripe customer',
          details: stripeError.message 
        });
      }
    }

    // Für Subscriptions: Erstelle Setup Intent statt Payment Intent
    // Das Setup Intent wird verwendet, um die Zahlungsmethode zu speichern
    // Danach erstellen wir die Subscription mit der gespeicherten Zahlungsmethode
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        metadata: {
          user_id: userId,
          price_id: priceId,
        },
      });

      console.log(`✅ Created setup intent ${setupIntent.id} for user ${userId}`);

      return res.status(200).json({ 
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      });
    } catch (stripeError) {
      console.error('Error creating setup intent:', stripeError);
      return res.status(500).json({ 
        error: 'Failed to create setup intent',
        details: stripeError.message 
      });
    }
  } catch (err) {
    console.error('Create payment intent error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
}


