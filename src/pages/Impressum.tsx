import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Impressum() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.imprint.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Responsible */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.imprint.responsible.title}
              </h2>
              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <p className="font-semibold text-foreground mb-2">{t.imprint.responsible.name}</p>
                <p className="text-muted-foreground">{t.imprint.responsible.address}</p>
                <p className="text-muted-foreground">{t.imprint.responsible.city}</p>
                <p className="text-muted-foreground">{t.imprint.responsible.country}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.imprint.contact.title}
              </h2>
              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <p className="text-muted-foreground">{t.imprint.contact.email}</p>
                <p className="text-muted-foreground">{t.imprint.contact.phone}</p>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.imprint.legal.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.imprint.legal.disclaimer.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.imprint.legal.disclaimer.text}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.imprint.legal.links.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.imprint.legal.links.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

