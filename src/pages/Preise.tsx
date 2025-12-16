import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCard, type PricingPlan } from "@/components/pricing/PricingCard";
import { FeatureComparisonTable } from "@/components/pricing/FeatureComparisonTable";

export default function Preise() {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  // PLAN-DATEN: Hier Preise oder Features später anpassen
  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: t.pricing.starter.name,
      description: t.pricing.starter.description,
      price: t.pricing.starter.price,
      priceYearly: t.pricing.starter.priceYearly,
      period: t.pricing.starter.period,
      users: t.pricing.starter.users,
      features: t.pricing.starter.features as unknown as string[],
      cta: t.pricing.starter.cta,
      ctaLink: t.pricing.starter.ctaLink,
    },
    {
      id: "pro",
      name: t.pricing.pro.name,
      description: t.pricing.pro.description,
      price: t.pricing.pro.price,
      priceYearly: t.pricing.pro.priceYearly,
      period: t.pricing.pro.period,
      users: t.pricing.pro.users,
      features: t.pricing.pro.features as unknown as string[],
      cta: t.pricing.pro.cta,
      ctaLink: t.pricing.pro.ctaLink,
      popular: t.pricing.pro.popular,
    },
    {
      id: "enterprise",
      name: t.pricing.enterprise.name,
      description: t.pricing.enterprise.description,
      price: t.pricing.enterprise.price,
      priceYearly: t.pricing.enterprise.priceYearly,
      period: t.pricing.enterprise.period,
      users: t.pricing.enterprise.users,
      features: t.pricing.enterprise.features as unknown as string[],
      cta: t.pricing.enterprise.cta,
      ctaLink: t.pricing.enterprise.ctaLink,
    },
    {
      id: "individual",
      name: t.pricing.individual.name,
      description: t.pricing.individual.description,
      price: t.pricing.individual.price,
      priceYearly: t.pricing.individual.priceYearly,
      period: t.pricing.individual.period,
      users: t.pricing.individual.users,
      features: t.pricing.individual.features as unknown as string[],
      cta: t.pricing.individual.cta,
      ctaLink: t.pricing.individual.ctaLink,
    },
  ];

  // Feature-Vergleichsmatrix
  const featureMatrix = [
    {
      feature: t.pricing.features.chat,
      starter: true,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.homepage,
      starter: true,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.inbox,
      starter: true,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.documents,
      starter: false,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.email,
      starter: false,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.goals,
      starter: false,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.time,
      starter: false,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.teams,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.dashboards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.whiteboards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.forms,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.features.cards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
  ];

  // Tools & Erweiterungen Matrix
  const toolsMatrix = [
    {
      feature: t.pricing.tools.dashboards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.tools.whiteboards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.tools.forms,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.tools.cards,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.tools.customApps,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
    {
      feature: t.pricing.tools.workflows,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
  ];

  // Team & Support Matrix
  const teamMatrix = [
    {
      feature: t.pricing.team.teamSize,
      starter: t.pricing.starter.users,
      pro: t.pricing.pro.users,
      enterprise: t.pricing.enterprise.users,
      individual: t.pricing.individual.users,
    },
    {
      feature: t.pricing.team.community,
      starter: true,
      pro: false,
      enterprise: false,
      individual: false,
    },
    {
      feature: t.pricing.team.priority,
      starter: false,
      pro: true,
      enterprise: false,
      individual: false,
    },
    {
      feature: t.pricing.team.dedicated,
      starter: false,
      pro: false,
      enterprise: true,
      individual: false,
    },
    {
      feature: t.pricing.team.personal,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
    {
      feature: t.pricing.team.basicIntegrations,
      starter: true,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.team.customIntegrations,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.team.individualWorkspace,
      starter: true,
      pro: true,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.team.teamWorkspace,
      starter: false,
      pro: false,
      enterprise: true,
      individual: true,
    },
    {
      feature: t.pricing.team.customApps,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
    {
      feature: t.pricing.team.workflows,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
    {
      feature: t.pricing.team.onPremise,
      starter: false,
      pro: false,
      enterprise: false,
      individual: true,
    },
  ];

  return (
    <Layout>
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
            <p className="text-muted-foreground text-base mb-8">
              {t.pricing.heroText}
            </p>

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
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isYearly={isYearly}
                highlighted={plan.id === "pro"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Tables */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto space-y-16">
            <FeatureComparisonTable
              title={t.pricing.features.title}
              features={featureMatrix}
            />
            <FeatureComparisonTable
              title={t.pricing.tools.title}
              features={toolsMatrix}
            />
            <FeatureComparisonTable
              title={t.pricing.team.title}
              features={teamMatrix}
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {t.pricing.bottomCta.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.pricing.bottomCta.description}
            </p>
            <Button variant="opux" size="lg" asChild>
              <Link to="/kontakt">
                {t.pricing.bottomCta.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-6">
              {t.pricing.bottomCta.note}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
