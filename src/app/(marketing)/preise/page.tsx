"use client";

import React, { useState } from "react";
import { LayoutNext } from "@/components/layout/LayoutNext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PlanTypeToggle } from "@/components/pricing/PlanTypeToggle";
import { PricingCardNext } from "@/components/pricing/PricingCardNext";
import type { PricingPlan } from "@/components/pricing/PricingCard";
import { Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { CreateOrganizationDialog } from "@/components/org/create-organization-dialog";

export default function PreisePage() {
  const { t } = useLanguage();
  const { isSignedIn } = useUser();
  const [isYearly, setIsYearly] = useState(false);
  const [planType, setPlanType] = useState<"user" | "team">("user");
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  // Pricing plans data
  const userPlans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfekt für den Einstieg",
      price: "0",
      priceYearly: "0",
      period: "/Monat",
      users: "Für Einzelpersonen",
      features: [
        "Basis-Funktionen",
        "E-Mail-Support",
        "5 Workflows",
        "Basis-Integrationen",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Für professionelle Nutzer",
      price: "29",
      priceYearly: "24",
      period: "/Monat",
      users: "Für Einzelpersonen",
      features: [
        "Alle Starter-Funktionen",
        "Prioritäts-Support",
        "Unbegrenzte Workflows",
        "Erweiterte Integrationen",
        "Analytics & Reports",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
      popular: "Beliebt",
      yearlyDiscountPercent: 17.24,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Für Unternehmen",
      price: "99",
      priceYearly: "83",
      period: "/Monat",
      users: "Für Einzelpersonen",
      features: [
        "Alle Pro-Funktionen",
        "24/7 Support",
        "Custom Integrationen",
        "Dedicated Account Manager",
        "SLA-Garantie",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
      yearlyDiscountPercent: 16.16,
    },
    {
      id: "individual",
      name: "Individual",
      description: "Maßgeschneiderte Lösung",
      price: "Auf Anfrage",
      priceYearly: "Auf Anfrage",
      period: "",
      users: "Für Einzelpersonen",
      features: [
        "Alle Enterprise-Funktionen",
        "Custom Development",
        "On-Premise Option",
        "White-Label",
      ],
      cta: "Kontakt aufnehmen",
      ctaLink: "/kontakt",
    },
  ];

  const teamPlans: PricingPlan[] = [
    {
      id: "team_starter",
      name: "Starter",
      description: "Perfekt für kleine Teams",
      price: "0",
      priceYearly: "0",
      period: "/Monat",
      users: "Bis zu 5 Nutzer",
      features: [
        "Basis-Funktionen",
        "Team-Kollaboration",
        "10 Workflows",
        "Basis-Integrationen",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
    },
    {
      id: "team_pro",
      name: "Pro",
      description: "Für wachsende Teams",
      price: "79",
      priceYearly: "66",
      period: "/Monat",
      users: "Bis zu 20 Nutzer",
      features: [
        "Alle Starter-Funktionen",
        "Prioritäts-Support",
        "Unbegrenzte Workflows",
        "Erweiterte Integrationen",
        "Team Analytics",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
      popular: "Beliebt",
      yearlyDiscountPercent: 16.46,
    },
    {
      id: "team_enterprise",
      name: "Enterprise",
      description: "Für große Teams",
      price: "249",
      priceYearly: "208",
      period: "/Monat",
      users: "Unbegrenzte Nutzer",
      features: [
        "Alle Pro-Funktionen",
        "24/7 Support",
        "Custom Integrationen",
        "Dedicated Account Manager",
        "SLA-Garantie",
        "SSO",
      ],
      cta: "Jetzt starten",
      ctaLink: "",
      yearlyDiscountPercent: 16.47,
    },
    {
      id: "team_individual",
      name: "Individual",
      description: "Maßgeschneiderte Lösung",
      price: "Auf Anfrage",
      priceYearly: "Auf Anfrage",
      period: "",
      users: "Unbegrenzte Nutzer",
      features: [
        "Alle Enterprise-Funktionen",
        "Custom Development",
        "On-Premise Option",
        "White-Label",
      ],
      cta: "Kontakt aufnehmen",
      ctaLink: "/kontakt",
    },
  ];

  const plans = planType === "user" ? userPlans : teamPlans;
  const accountType = planType === "user" ? "user" : "team";

  // Helper function to handle team plan selection
  const handleTeamPlanSelect = (planId: string) => {
    // Map plan IDs to UI plan names
    const planMap: Record<string, string> = {
      team_starter: "starter",
      team_pro: "pro",
      team_enterprise: "enterprise",
      team_individual: "individual",
    };

    const uiPlan = planMap[planId] || "starter";

    // For individual plans, redirect to contact
    if (uiPlan === "individual") {
      window.location.href = "/kontakt";
      return;
    }

    // If user is not signed in, redirect to sign-up
    if (!isSignedIn) {
      window.location.href = `/sign-up?plan=${uiPlan}&accountType=team`;
      return;
    }

    // If user is signed in, show organization dialog
    setSelectedPlan(uiPlan);
    setShowOrgDialog(true);
  };

  // Helper function to get sign-up URL with query parameters (for user plans)
  const getSignUpUrl = (planId: string) => {
    // Map plan IDs to UI plan names (these will be mapped to Clerk plans in the API)
    const planMap: Record<string, string> = {
      starter: "starter",
      pro: "pro",
      enterprise: "enterprise",
      individual: "individual",
      team_starter: "starter", // UI uses "starter", API maps to "team_starter"
      team_pro: "pro", // UI uses "pro", API maps to "team_pro"
      team_enterprise: "enterprise", // UI uses "enterprise", API maps to "team_enterprise"
      team_individual: "individual",
    };

    const plan = planMap[planId] || "starter";

    // For individual plans, redirect to contact
    if (plan === "individual") {
      return "/kontakt";
    }

    // For team plans, return empty string (will be handled by onClick)
    if (planId.startsWith("team_")) {
      return "";
    }

    // Return URL with UI plan name and accountType for user plans
    return `/sign-up?plan=${plan}&accountType=${accountType}`;
  };

  return (
    <LayoutNext>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.pricing.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-4">
              {t.pricing.subtitle}
            </p>

            {/* Plan Type Toggle (User vs Team) */}
            <div className="mb-6">
              <PlanTypeToggle
                planType={planType}
                onToggle={setPlanType}
                userLabel="Für Einzelpersonen"
                teamLabel="Für Teams"
              />
            </div>

            {/* Billing Toggle */}
            <BillingToggle
              isYearly={isYearly}
              onToggle={setIsYearly}
              monthlyLabel={t.pricing.monthly}
              yearlyLabel={t.pricing.yearly}
              discountLabel={t.pricing.yearlyDiscount}
            />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const signUpUrl = getSignUpUrl(plan.id);
              const isHighlighted = plan.popular !== undefined;
              const isTeamPlan = plan.id.startsWith("team_");

              // Create plan object with Next.js Link or onClick handler
              const planWithNextLink = {
                ...plan,
                ctaLink: signUpUrl,
                // For team plans, add onClick handler
                ...(isTeamPlan && {
                  onCtaClick: () => handleTeamPlanSelect(plan.id),
                }),
              };

              return (
                <PricingCardNext
                  key={plan.id}
                  plan={planWithNextLink}
                  isYearly={isYearly}
                  highlighted={isHighlighted}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Create Organization Dialog */}
      <CreateOrganizationDialog
        plan={selectedPlan}
        isOpen={showOrgDialog}
        onClose={() => {
          setShowOrgDialog(false);
          setSelectedPlan("");
        }}
      />
    </LayoutNext>
  );
}

