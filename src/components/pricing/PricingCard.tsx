import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parsePrice,
  formatPrice,
  calculateYearlyTotal,
  calculateYearlySavings,
  calculateDiscountPercent,
  formatSavingsText,
  calculateMonthlyPriceYearly,
} from "@/lib/pricing-utils";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceYearly: string;
  period: string;
  users: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: string;
  yearlyDiscountPercent?: number; // Rabatt in Prozent für Jahresabo (z.B. 16.67)
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  highlighted?: boolean;
  onSubscribe?: () => void;
}

export function PricingCard({ plan, isYearly, highlighted, onSubscribe }: PricingCardProps) {
  const isCustom = plan.price === "Auf Anfrage" || plan.price === "On request";
  const isFree = plan.id === "starter" || plan.id === "team_starter";

  // Parse Preise zu Zahlen
  const monthlyPrice = parsePrice(plan.price);
  const monthlyPriceYearly = parsePrice(plan.priceYearly);

  // Berechne Rabatt, falls nicht vorhanden
  const discountPercent =
    plan.yearlyDiscountPercent ||
    (monthlyPrice > 0 && monthlyPriceYearly > 0
      ? calculateDiscountPercent(monthlyPrice, monthlyPriceYearly)
      : 16.67);

  // Berechnungen für Yearly
  const yearlyTotal = isYearly ? calculateYearlyTotal(monthlyPrice, discountPercent) : 0;
  const yearlySavings = isYearly ? calculateYearlySavings(monthlyPrice, discountPercent) : 0;
  const monthlyPriceInYearly = isYearly
    ? calculateMonthlyPriceYearly(monthlyPrice, discountPercent)
    : 0;

  // Display-Preise
  const displayPrice = isYearly
    ? isCustom
      ? plan.priceYearly
      : formatPrice(monthlyPriceInYearly)
    : plan.price;

  const handleClick = () => {
    if (onSubscribe) {
      onSubscribe();
    }
  };

  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border transition-all flex flex-col",
        highlighted
          ? "bg-card border-foreground/20 shadow-lg"
          : "bg-card border-border hover:border-foreground/10"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1 text-xs font-medium">
            {plan.popular}
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-xl text-foreground mb-1">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </div>

      <div className="mb-4">
        {isYearly && !isCustom && !isFree && monthlyPrice > 0 ? (
          <>
            {/* Yearly View: Zeige monatlichen Preis im Jahresabo, Jahresgesamtpreis und Ersparnis */}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-foreground leading-none whitespace-nowrap">{displayPrice}</span>
              <span className="text-muted-foreground ml-1 whitespace-nowrap">{plan.period}</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                {formatPrice(yearlyTotal)} pro Jahr
              </p>
              <Badge variant="secondary" className="text-xs font-medium">
                {formatSavingsText(yearlySavings, discountPercent)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{plan.users}</p>
          </>
        ) : (
          <>
            {/* Monthly View: Zeige nur monatlichen Preis */}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-foreground leading-none whitespace-nowrap">{displayPrice}</span>
              {!isCustom && <span className="text-muted-foreground ml-1 whitespace-nowrap">{plan.period}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{plan.users}</p>
          </>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-foreground" />
            </div>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {onSubscribe ? (
        <Button
          variant={highlighted ? "opux" : "opuxOutline"}
          className="w-full"
          size="lg"
          onClick={handleClick}
        >
          {plan.cta}
        </Button>
      ) : (
        <Button
          variant={highlighted ? "opux" : "opuxOutline"}
          className="w-full"
          size="lg"
          asChild
        >
          <Link to={plan.ctaLink}>{plan.cta}</Link>
        </Button>
      )}
    </div>
  );
}

