// api/create-checkout-session.js
// Vercel Serverless Function für Stripe Checkout Session Erstellung
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

export default async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Body parsen
    let body;
    try {
      const rawBody = await getRawBody(req);
      body = JSON.parse(rawBody.toString());
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { userId, priceId, accountType = 'individual' } = body;

    if (!userId || !priceId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'priceId']
      });
    }

    // User-Profil holen (aus profiles Tabelle)
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
          // Weiter machen, auch wenn Update fehlschlägt
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

    // Checkout Session erstellen (Custom UI Mode für eingebettetes Payment Element)
    const appUrl = process.env.APP_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:5173';

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription', // Standard Checkout Mode (nicht custom)
        customer: stripeCustomerId,
        line_items: [
          {
            price: priceId, // z.B. 'price_12345' von Stripe Dashboard
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
        // Metadata für spätere Zuordnung
        metadata: { 
          user_id: userId,
          supabase_user_id: userId,
          account_type: accountType,
        },
        // Subscription-Metadata (wird an Subscription weitergegeben)
        subscription_data: {
          metadata: {
            user_id: userId,
            supabase_user_id: userId,
            account_type: accountType,
          },
        },
        // Erlaube Promotion Codes
        allow_promotion_codes: true,
        // Automatisches Billing
        billing_address_collection: 'required',
      });

      console.log(`✅ Created checkout session ${session.id} for user ${userId}`);

      return res.status(200).json({ 
        sessionId: session.id,
        url: session.url, // Redirect URL für Standard Checkout
      });
    } catch (stripeError) {
      console.error('Error creating checkout session:', stripeError);
      return res.status(500).json({ 
        error: 'Failed to create checkout session',
        details: stripeError.message 
      });
    }
  } catch (err) {
    console.error('Create checkout session error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
}

