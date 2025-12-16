import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  highlighted?: boolean;
}

export function PricingCard({ plan, isYearly, highlighted }: PricingCardProps) {
  const displayPrice = isYearly ? plan.priceYearly : plan.price;
  const isCustom = plan.price === "Auf Anfrage" || plan.price === "On request";

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
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold text-foreground">{displayPrice}</span>
          {!isCustom && <span className="text-muted-foreground ml-1">{plan.period}</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{plan.users}</p>
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

      <Button
        variant={highlighted ? "opux" : "opuxOutline"}
        className="w-full"
        size="lg"
        asChild
      >
        <Link to={plan.ctaLink}>{plan.cta}</Link>
      </Button>
    </div>
  );
}

