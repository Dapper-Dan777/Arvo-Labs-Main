/**
 * Stripe Price IDs Konfiguration
 * 
 * Füge hier deine Stripe Price IDs ein, die du in deinem Stripe Dashboard erstellt hast.
 * Diese IDs findest du unter: Stripe Dashboard → Products → Prices
 */

export const STRIPE_PRICE_IDS = {
  // Individual Plans
  starter: import.meta.env.VITE_STRIPE_PRICE_STARTER || 'price_1SfRXkPgo9Kimm8xHNLvrWVR',
  pro: import.meta.env.VITE_STRIPE_PRICE_PRO || 'price_1SfRY5Pgo9Kimm8x04VoyShG',
  enterprise: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_1SfRYXPgo9Kimm8xe9LWxFwj',
  individual: import.meta.env.VITE_STRIPE_PRICE_INDIVIDUAL || 'price_1SfRW1Pgo9Kimm8xGy8fUex1',
  
  // Team Plans (optional - können später hinzugefügt werden)
  team_starter: import.meta.env.VITE_STRIPE_PRICE_TEAM_STARTER || 'price_xxxxx',
  team_pro: import.meta.env.VITE_STRIPE_PRICE_TEAM_PRO || 'price_xxxxx',
  team_enterprise: import.meta.env.VITE_STRIPE_PRICE_TEAM_ENTERPRISE || 'price_xxxxx',
} as const;

/**
 * Gibt die Stripe Price ID für einen Plan zurück
 */
export function getStripePriceId(plan: string, accountType: 'individual' | 'team' = 'individual'): string | null {
  if (accountType === 'team') {
    const teamKey = `team_${plan}` as keyof typeof STRIPE_PRICE_IDS;
    return STRIPE_PRICE_IDS[teamKey] || null;
  }
  
  const priceId = STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS];
  return priceId || null;
}

/**
 * Prüft ob eine Price ID gültig ist (nicht placeholder)
 */
export function isValidPriceId(priceId: string | null): boolean {
  return priceId !== null && priceId !== 'price_xxxxx' && priceId.startsWith('price_');
}

