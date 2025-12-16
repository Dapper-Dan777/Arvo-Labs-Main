/**
 * Helper-Funktionen für Pricing-Berechnungen
 */

/**
 * Konvertiert einen Preis-String (z.B. "29,00 €") zu einer Zahl
 */
export function parsePrice(priceString: string): number {
  if (priceString === "Auf Anfrage" || priceString === "On request" || priceString === "0,00 €") {
    return 0;
  }
  // Entferne "€" und Leerzeichen, ersetze Komma durch Punkt
  const cleaned = priceString.replace(/[€\s]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/**
 * Formatiert eine Zahl als Preis-String (z.B. 29.5 -> "29,50 €")
 */
export function formatPrice(price: number): string {
  if (price === 0) return "0,00 €";
  return `${price.toFixed(2).replace(".", ",")} €`;
}

/**
 * Berechnet den Jahresgesamtpreis
 * @param monthlyPrice Monatlicher Preis
 * @param discountPercent Rabatt in Prozent (z.B. 16.67 für 16.67%)
 * @returns Jahresgesamtpreis
 */
export function calculateYearlyTotal(
  monthlyPrice: number,
  discountPercent: number = 16.67
): number {
  if (monthlyPrice === 0) return 0;
  const discountFactor = 1 - discountPercent / 100;
  return monthlyPrice * 12 * discountFactor;
}

/**
 * Berechnet die Ersparnis pro Jahr
 * @param monthlyPrice Monatlicher Preis
 * @param discountPercent Rabatt in Prozent
 * @returns Ersparnis in Euro
 */
export function calculateYearlySavings(
  monthlyPrice: number,
  discountPercent: number = 16.67
): number {
  if (monthlyPrice === 0) return 0;
  const yearlyWithoutDiscount = monthlyPrice * 12;
  const yearlyWithDiscount = calculateYearlyTotal(monthlyPrice, discountPercent);
  return yearlyWithoutDiscount - yearlyWithDiscount;
}

/**
 * Berechnet den Rabatt in Prozent
 * @param monthlyPrice Monatlicher Preis
 * @param monthlyPriceYearly Monatlicher Preis im Jahresabo
 * @returns Rabatt in Prozent
 */
export function calculateDiscountPercent(
  monthlyPrice: number,
  monthlyPriceYearly: number
): number {
  if (monthlyPrice === 0 || monthlyPriceYearly === 0) return 0;
  return ((monthlyPrice - monthlyPriceYearly) / monthlyPrice) * 100;
}

/**
 * Formatiert die Ersparnis als Text
 * @param savings Ersparnis in Euro
 * @param discountPercent Rabatt in Prozent
 * @returns Formatierter Text (z.B. "Spare 48 € pro Jahr" oder "Spare 20% pro Jahr")
 */
export function formatSavingsText(savings: number, discountPercent: number): string {
  if (savings === 0) return "";
  
  // Zeige sowohl Euro als auch Prozent
  return `Spare ${formatPrice(savings)} pro Jahr`;
}

/**
 * Berechnet den monatlichen Preis im Jahresabo
 * @param monthlyPrice Monatlicher Preis
 * @param discountPercent Rabatt in Prozent
 * @returns Monatlicher Preis im Jahresabo
 */
export function calculateMonthlyPriceYearly(
  monthlyPrice: number,
  discountPercent: number = 16.67
): number {
  if (monthlyPrice === 0) return 0;
  const discountFactor = 1 - discountPercent / 100;
  return monthlyPrice * discountFactor;
}

