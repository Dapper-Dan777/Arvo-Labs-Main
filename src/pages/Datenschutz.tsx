import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProtectedPageLayout } from "@/components/ProtectedPageLayout";

export default function Datenschutz() {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <ProtectedPageLayout isProtected={true}>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.privacy.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t.privacy.lastUpdated.replace("{date}", currentDate)}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.privacy.intro.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.privacy.intro.general.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.privacy.intro.general.text}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.privacy.intro.dataCollection.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.privacy.intro.dataCollection.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Responsible */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.privacy.responsible.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t.privacy.responsible.text}
              </p>
              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <p className="font-semibold text-foreground">{t.privacy.responsible.company}</p>
                <p className="text-muted-foreground">{t.privacy.responsible.address}</p>
                <p className="text-muted-foreground">{t.privacy.responsible.city}</p>
                <p className="text-muted-foreground">{t.privacy.responsible.country}</p>
                <p className="text-muted-foreground mt-2">{t.privacy.responsible.email}</p>
              </div>
            </div>

            {/* Data Collection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.privacy.dataCollection.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.privacy.dataCollection.serverLogs.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.privacy.dataCollection.serverLogs.text}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.privacy.dataCollection.contact.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.privacy.dataCollection.contact.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Rights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {t.privacy.rights.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.privacy.rights.text}
              </p>
            </div>
          </div>
        </div>
      </section>
      </ProtectedPageLayout>
    </Layout>
  );
}

