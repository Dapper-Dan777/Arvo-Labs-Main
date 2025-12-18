// api/create-subscription.js
// Vercel Serverless Function für Stripe Subscription Erstellung nach Setup Intent
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    const { userId, priceId, paymentMethodId, accountType = 'individual' } = body;

    if (!userId || !priceId || !paymentMethodId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'priceId', 'paymentMethodId']
      });
    }

    // User-Profil holen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const stripeCustomerId = profile.stripe_customer_id;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Stripe customer not found' });
    }

    // Zahlungsmethode an Customer anhängen
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Setze als Standard-Zahlungsmethode
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Erstelle Subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
        metadata: {
          user_id: userId,
          supabase_user_id: userId,
          account_type: accountType,
        },
    });

    console.log(`✅ Created subscription ${subscription.id} for user ${userId}`);

    return res.status(200).json({ 
      subscriptionId: subscription.id,
      status: subscription.status,
    });
  } catch (err) {
    console.error('Create subscription error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
}


