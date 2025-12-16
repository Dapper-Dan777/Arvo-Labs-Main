import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AGB() {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.terms.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t.terms.lastUpdated.replace("{date}", currentDate)}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.terms.intro.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.terms.intro.text}
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.terms.services.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.terms.services.text}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.terms.pricing.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.terms.pricing.text}
              </p>
            </div>

            {/* Cancellation */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.terms.cancellation.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.terms.cancellation.text}
              </p>
            </div>

            {/* Liability */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.terms.liability.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.terms.liability.text}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

