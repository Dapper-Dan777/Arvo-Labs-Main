// api/create-stripe-customer.js
// Vercel Serverless Function für automatische Stripe Customer-Erstellung bei Registrierung
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

    const { userId, email, fullName } = body;

    if (!userId || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'email']
      });
    }

    // Prüfe ob bereits ein Stripe Customer existiert
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return res.status(500).json({ error: 'Profile lookup failed' });
    }

    // Wenn bereits ein Customer existiert, gib ihn zurück
    if (profile?.stripe_customer_id) {
      return res.status(200).json({ 
        customerId: profile.stripe_customer_id,
        alreadyExists: true,
      });
    }

    // Erstelle neuen Stripe Customer
    try {
      const customer = await stripe.customers.create({
        email: email,
        name: fullName || undefined,
        metadata: { 
          user_id: userId,
          supabase_user_id: userId,
        },
      });

      // Speichere Customer ID in profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile with customer ID:', updateError);
        // Weiter machen, auch wenn Update fehlschlägt
      }

      console.log(`✅ Created Stripe customer ${customer.id} for user ${userId}`);

      return res.status(200).json({ 
        customerId: customer.id,
        alreadyExists: false,
      });
    } catch (stripeError) {
      console.error('Error creating Stripe customer:', stripeError);
      return res.status(500).json({ 
        error: 'Failed to create Stripe customer',
        details: stripeError.message 
      });
    }
  } catch (err) {
    console.error('Create Stripe customer error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
}


