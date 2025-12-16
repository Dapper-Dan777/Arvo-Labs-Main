import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UeberUns() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.about.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {t.about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {t.about.mission.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t.about.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {t.about.vision.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t.about.vision.description}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-12 text-center">
              {t.about.values.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {t.about.values.simplicity.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.about.values.simplicity.description}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {t.about.values.reliability.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.about.values.reliability.description}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {t.about.values.innovation.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.about.values.innovation.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

