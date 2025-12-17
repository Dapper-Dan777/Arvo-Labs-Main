import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, MessageSquare, FileText, BarChart3 } from "lucide-react";

export default function EmailKommunikation() {
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
                <BreadcrumbPage>E-Mail & Kommunikation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hauptinhalt */}
      <article className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Zurück-Button */}
          <Button variant="opuxGhost" asChild className="mb-8">
            <Link to="/dokumentation">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Link>
          </Button>

          {/* Titel */}
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
            E-Mail & Kommunikation
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              E-Mail-Kommunikation ist oft zeitaufwändig und fehleranfällig. Arvo Labs hilft dir dabei, 
              E-Mails effizienter zu verwalten, automatisch zu beantworten und den Überblick zu behalten. 
              Alles an einem Ort, übersichtlich und intelligent.
            </p>
          </div>

          {/* E-Mails automatisiert beantworten */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Mail className="w-8 h-8 text-primary" />
              E-Mails automatisiert beantworten
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mit Arvo Labs kannst du E-Mails automatisch beantworten lassen, basierend auf intelligenten Regeln:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">KI-generierte Antworten:</strong> Der KI-Assistent erstellt passende Antworten basierend auf dem Inhalt der eingehenden E-Mail</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Automatische Kategorisierung:</strong> E-Mails werden automatisch nach Wichtigkeit und Thema sortiert</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Intelligente Weiterleitung:</strong> Wichtige E-Mails werden automatisch an die richtige Person weitergeleitet</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Vorlagen & Sequenzen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Vorlagen & Sequenzen
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">E-Mail-Vorlagen erstellen</h3>
                <p className="text-muted-foreground mb-4">
                  Erstelle wiederverwendbare E-Mail-Vorlagen für häufige Situationen:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                  <li>Kundenanfragen beantworten</li>
                  <li>Follow-up-E-Mails nach Meetings</li>
                  <li>Onboarding-Sequenzen für neue Kunden</li>
                  <li>Standardantworten auf häufige Fragen</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">E-Mail-Sequenzen</h3>
                <p className="text-muted-foreground">
                  Erstelle automatische E-Mail-Sequenzen, die über mehrere Tage verteilt werden. 
                  Perfekt für Kundenonboarding, Follow-ups oder Marketing-Kampagnen. Du definierst die 
                  Abstände zwischen den E-Mails und die Bedingungen, wann die Sequenz gestartet werden soll.
                </p>
              </div>
            </div>
          </section>

          {/* Tracking und Nachverfolgung */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Tracking und Nachverfolgung
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Behalte den Überblick über deine E-Mail-Kommunikation:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Öffnungsraten:</strong> Sieh, welche E-Mails geöffnet wurden</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Antwort-Status:</strong> Verfolge, welche E-Mails beantwortet wurden und welche noch offen sind</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Zeitanalyse:</strong> Erkenne Muster in deiner E-Mail-Kommunikation und optimiere deine Antwortzeiten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Team-Übersicht:</strong> Sieh, wie dein Team mit E-Mails umgeht und wo Unterstützung nötig ist</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              Best Practices für E-Mail-Automatisierung
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Persönlichkeit bewahren:</strong> Auch wenn E-Mails automatisch 
                generiert werden, sollten sie persönlich und authentisch klingen. Nutze Variablen für Namen 
                und personalisiere die Ansprache.
              </p>
              <p>
                <strong className="text-foreground">Wichtige E-Mails manuell prüfen:</strong> Bei kritischen 
                Anfragen solltest du automatische Antworten vor dem Versenden überprüfen oder manuell 
                bearbeiten.
              </p>
              <p>
                <strong className="text-foreground">Regelmäßig optimieren:</strong> Analysiere die Performance 
                deiner automatisierten E-Mails und passe sie basierend auf Öffnungsraten und Antworten an.
              </p>
            </div>
          </section>

          {/* Nächste Schritte */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Nächste Schritte
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="opux" asChild>
                <Link to="/dokumentation/automationen-workflows">
                  Automationen & Workflows
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

