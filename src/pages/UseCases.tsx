import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, TrendingUp, Headphones, Building2, Briefcase, Lightbulb, ArrowRight } from "lucide-react";

const useCaseIcons = {
  teams: Users,
  sales: TrendingUp,
  support: Headphones,
  backoffice: Building2,
  hr: Briefcase,
  marketing: Lightbulb,
};

export default function UseCases() {
  const { t } = useLanguage();

  const useCases = [
    { key: "teams", icon: Users, ...t.useCases.teams },
    { key: "sales", icon: TrendingUp, ...t.useCases.sales },
    { key: "support", icon: Headphones, ...t.useCases.support },
    { key: "backoffice", icon: Building2, ...t.useCases.backoffice },
    { key: "hr", icon: Briefcase, ...t.useCases.hr },
    { key: "marketing", icon: Lightbulb, ...t.useCases.marketing },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.useCases.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {t.useCases.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div
                key={useCase.key}
                className="p-6 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4 text-foreground">
                  <useCase.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {useCase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(useCase.features as unknown as string[]).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {t.cta.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="opux" size="lg" asChild>
                <Link to="/kontakt">
                  {t.cta.primary}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" size="lg" asChild>
                <Link to="/funktionen">{t.cta.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
