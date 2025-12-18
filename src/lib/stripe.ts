import { loadStripe, Stripe } from '@stripe/stripe-js';

// Lade Stripe mit dem Publishable Key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Nur Stripe laden wenn Key vorhanden ist
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripeKey) {
    console.warn('⚠️ VITE_STRIPE_PUBLISHABLE_KEY ist nicht gesetzt. Stripe-Funktionen werden nicht verfügbar sein.');
    return Promise.resolve(null);
  }
  return stripePromise;
};

