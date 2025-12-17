import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lightbulb, BookOpen, Target, TrendingUp } from "lucide-react";

export default function Guides() {
  const guides = [
    {
      title: "Arvo Labs für Einsteiger",
      description: "Ein kompletter Guide für neue Nutzer:innen, der alle Grundlagen abdeckt.",
      category: "Grundlagen",
      icon: BookOpen,
      link: "/dokumentation/was-ist-arvo-labs"
    },
    {
      title: "Effiziente Workspace-Struktur",
      description: "Lerne, wie du deine Workspaces optimal organisierst für maximale Produktivität.",
      category: "Organisation",
      icon: Target,
      link: "/dokumentation/erster-workspace"
    },
    {
      title: "Automatisierung für kleine Teams",
      description: "Praktische Tipps, wie kleine Teams am besten von Automatisierung profitieren.",
      category: "Automatisierung",
      icon: TrendingUp,
      link: "/dokumentation/automationen-workflows"
    },
    {
      title: "KI-Chat optimal nutzen",
      description: "Erfahre, wie du den KI-Assistenten am effektivsten für deine tägliche Arbeit einsetzt.",
      category: "KI & Assistenten",
      icon: Lightbulb,
      link: "/dokumentation/ki-chat-assistenten"
    },
    {
      title: "E-Mail-Automatisierung Best Practices",
      description: "Professionelle E-Mail-Automatisierung ohne dabei persönlich zu wirken.",
      category: "Kommunikation",
      icon: Lightbulb,
      link: "/dokumentation/email-kommunikation"
    },
    {
      title: "Wissensbasis aufbauen",
      description: "Wie du eine effektive Wissensbasis für dein Team aufbaust und pflegst.",
      category: "Wissensmanagement",
      icon: BookOpen,
      link: "/dokumentation/dokumente-wissensbasis"
    }
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Startseite</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dokumentation">Dokumentation</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Guides & Best Practices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hauptinhalt */}
      <article className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Zurück-Button */}
          <Button variant="opuxGhost" asChild className="mb-8">
            <Link to="/dokumentation">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Link>
          </Button>

          {/* Titel */}
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
            Guides & Best Practices
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Erfahre, wie andere Nutzer:innen Arvo Labs erfolgreich einsetzen. Von Tipps für Einsteiger 
              bis zu fortgeschrittenen Automatisierungsstrategien – hier findest du praxisnahe Anleitungen 
              und bewährte Methoden.
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {guides.map((guide, index) => {
              const IconComponent = guide.icon;
              return (
                <Card key={index} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{guide.category}</div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="opuxOutline" className="w-full" asChild>
                      <Link to={guide.link}>
                        Guide öffnen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Best Practices Übersicht */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Allgemeine Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Starte klein</h3>
                <p className="text-sm text-muted-foreground">
                  Beginne mit einfachen Automationen und erweitere sie schrittweise. 
                  So lernst du das System kennen, ohne überfordert zu sein.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Team einbeziehen</h3>
                <p className="text-sm text-muted-foreground">
                  Beziehe dein Team frühzeitig ein. Gemeinsame Workspaces und geteilte Dokumente 
                  funktionieren am besten, wenn alle mitziehen.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Regelmäßig optimieren</h3>
                <p className="text-sm text-muted-foreground">
                  Überprüfe regelmäßig deine Automationen und Workflows. Was funktioniert gut? 
                  Was kann verbessert werden?
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Dokumentation pflegen</h3>
                <p className="text-sm text-muted-foreground">
                  Halte deine Wissensbasis aktuell. Aktualisierte Dokumente helfen nicht nur dir, 
                  sondern auch deinem Team und dem KI-Assistenten.
                </p>
              </div>
            </div>
          </section>

          {/* Nächste Schritte */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Nächste Schritte
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="opux" asChild>
                <Link to="/dokumentation/erste-automatisierung">
                  Erste Automatisierung erstellen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" asChild>
                <Link to="/dokumentation">
                  Zurück zur Übersicht
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </article>
    </Layout>
  );
}

