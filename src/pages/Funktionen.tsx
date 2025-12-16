import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, BarChart3, Workflow, Shield, Plug, Smartphone, Zap, Clock, Users, FileText, Bell, Globe, ArrowRight } from "lucide-react";

const iconMap = {
  email: Mail,
  reporting: BarChart3,
  workflows: Workflow,
  security: Shield,
  integrations: Plug,
  mobile: Smartphone,
};

const additionalFeatures = [
  { icon: Zap, key: "ai" },
  { icon: Clock, key: "time" },
  { icon: Users, key: "team" },
  { icon: FileText, key: "docs" },
  { icon: Bell, key: "notifications" },
  { icon: Globe, key: "multilang" },
];

export default function Funktionen() {
  const { t, language } = useLanguage();

  const mainFeatures = [
    { icon: Mail, titleKey: "email", ...t.features.email },
    { icon: BarChart3, titleKey: "reporting", ...t.features.reporting },
    { icon: Workflow, titleKey: "workflows", ...t.features.workflows },
    { icon: Shield, titleKey: "security", ...t.features.security },
    { icon: Plug, titleKey: "integrations", ...t.features.integrations },
    { icon: Smartphone, titleKey: "mobile", ...t.features.mobile },
  ];

  const additionalFeaturesData = language === "de" ? [
    { icon: Zap, title: "KI-gestützte Entscheidungen", description: "Unsere KI lernt aus deinen Daten und trifft intelligente Entscheidungen innerhalb deiner Workflows." },
    { icon: Clock, title: "Zeitbasierte Trigger", description: "Plane Automatisierungen für bestimmte Zeiten oder Intervalle. Perfekt für wiederkehrende Aufgaben." },
    { icon: Users, title: "Team-Kollaboration", description: "Arbeite gemeinsam an Workflows, teile Templates und verwalte Berechtigungen für dein ganzes Team." },
    { icon: FileText, title: "Dokumenten-Verarbeitung", description: "Extrahiere automatisch Daten aus Dokumenten, klassifiziere Inhalte und leite sie weiter." },
    { icon: Bell, title: "Smart Notifications", description: "Erhalte Benachrichtigungen genau dann, wenn sie relevant sind – nicht mehr, nicht weniger." },
    { icon: Globe, title: "Mehrsprachigkeit", description: "Arvo Labs versteht und verarbeitet Inhalte in über 50 Sprachen – ideal für internationale Teams." },
  ] : [
    { icon: Zap, title: "AI-Powered Decisions", description: "Our AI learns from your data and makes intelligent decisions within your workflows." },
    { icon: Clock, title: "Time-Based Triggers", description: "Schedule automations for specific times or intervals. Perfect for recurring tasks." },
    { icon: Users, title: "Team Collaboration", description: "Work together on workflows, share templates, and manage permissions for your entire team." },
    { icon: FileText, title: "Document Processing", description: "Automatically extract data from documents, classify content, and route it accordingly." },
    { icon: Bell, title: "Smart Notifications", description: "Get notifications exactly when they're relevant—no more, no less." },
    { icon: Globe, title: "Multilingual", description: "Arvo Labs understands and processes content in over 50 languages—ideal for international teams." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.features.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-12 text-center">
            {language === "de" ? "Kernfunktionen" : "Core Features"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4 text-foreground">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-12 text-center">
            {language === "de" ? "Weitere Funktionen" : "Additional Features"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {additionalFeaturesData.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4 text-foreground">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
                <Link to="/preise">
                  {language === "de" ? "Preise ansehen" : "View Pricing"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" size="lg" asChild>
                <Link to="/kontakt">{t.nav.contact}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
