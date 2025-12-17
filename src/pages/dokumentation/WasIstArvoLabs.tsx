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
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function WasIstArvoLabs() {
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
                <BreadcrumbPage>Was ist Arvo Labs?</BreadcrumbPage>
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
            Was ist Arvo Labs?
          </h1>

          {/* Intro-Abschnitt */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Arvo Labs ist ein KI-gestütztes Workspace- und Automations-Tool, das speziell für Teams und 
              Solo-Selbstständige entwickelt wurde. Es kombiniert intelligente Automatisierung, zentrale 
              Wissensverwaltung und KI-Unterstützung in einer einzigen, übersichtlichen Plattform.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Statt zwischen verschiedenen Tools zu wechseln und Informationen zu verlieren, bringt Arvo Labs 
              alles an einem Ort zusammen – von E-Mail-Management über Dokumentenverwaltung bis hin zu 
              wiederkehrenden Aufgaben, die automatisch erledigt werden.
            </p>
          </div>

          {/* Für wen ist Arvo Labs? */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Für wen ist Arvo Labs?
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Lokale Dienstleister:</strong> Friseure, Agenturen, 
                    Coaches und andere Service-Anbieter, die ihre Kundenkommunikation und Terminplanung 
                    effizienter gestalten wollen.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Kleine Teams und Start-ups:</strong> Teams, die 
                    ohne komplexe Enterprise-Software produktiv arbeiten und eine zentrale Wissensbasis 
                    aufbauen möchten.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Solo-Selbstständige:</strong> Einzelpersonen, die 
                    wiederkehrende Aufgaben automatisieren und mehr Zeit für die wichtigen Dinge haben wollen, 
                    statt in E-Mail-Postfächern und Kalendern zu versinken.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Was bringt dir Arvo Labs im Alltag? */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Was bringt dir Arvo Labs im Alltag?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Zeit sparen</h3>
                <p className="text-sm text-muted-foreground">
                  Automatisierungen übernehmen Routineaufgaben, sodass du dich auf das konzentrieren kannst, 
                  was wirklich wichtig ist.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Fehler reduzieren</h3>
                <p className="text-sm text-muted-foreground">
                  Konsistente Prozesse und automatisierte Abläufe minimieren menschliche Fehlerquellen 
                  und sorgen für zuverlässige Ergebnisse.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Einheitliche Kommunikation</h3>
                <p className="text-sm text-muted-foreground">
                  Professionelle, konsistente E-Mail-Antworten und Nachverfolgung – auch wenn du gerade 
                  nicht am Schreibtisch sitzt.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Besseres Follow-up</h3>
                <p className="text-sm text-muted-foreground">
                  Keine vergessenen Termine oder offenen Anfragen mehr. Arvo Labs erinnert dich an wichtige 
                  Aufgaben und Follow-ups.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Zentrale Wissensbasis</h3>
                <p className="text-sm text-muted-foreground">
                  Alle wichtigen Informationen, Dokumente und Prozesse an einem Ort – für dich und dein Team 
                  jederzeit zugänglich.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">KI-Unterstützung</h3>
                <p className="text-sm text-muted-foreground">
                  Nutze KI, um schnell Antworten aus deinen Dokumenten zu finden, Texte zu generieren oder 
                  komplexe Anfragen zu bearbeiten.
                </p>
              </div>
            </div>
          </section>

          {/* Wie passt Arvo Labs in deinen bisherigen Workflow? */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Wie passt Arvo Labs in deinen bisherigen Workflow?
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Arvo Labs ist nicht dazu da, deine bestehenden Tools zu ersetzen, sondern sie zu verbinden 
                und zu erweitern. Stell dir vor, du könntest alle deine E-Mails an einem Ort bündeln, 
                automatisch kategorisieren und beantworten lassen – ohne ständig zwischen verschiedenen 
                Postfächern wechseln zu müssen.
              </p>
              <p>
                <strong className="text-foreground">Beispiel E-Mail-Management:</strong> Statt jeden Morgen 
                durch drei verschiedene Postfächer zu scrollen, siehst du in Arvo Labs alle wichtigen Nachrichten 
                auf einen Blick. Die KI hilft dir dabei, Prioritäten zu setzen und automatische Antworten 
                zu generieren, die du nur noch freigeben musst.
              </p>
              <p>
                <strong className="text-foreground">Beispiel Terminplanung:</strong> Arvo Labs verbindet sich 
                mit deinem Kalender und kann automatisch Termine koordinieren, Erinnerungen senden und 
                Follow-up-E-Mails nach Meetings verschicken – alles ohne manuellen Aufwand.
              </p>
              <p>
                <strong className="text-foreground">Beispiel Wissensmanagement:</strong> Alle deine Dokumente, 
                Notizen und wichtigen Informationen werden in Arvo Labs gespeichert und durchsuchbar gemacht. 
                Die KI kann dir auf Basis deiner Dokumente konkrete Antworten geben, ohne dass du jedes Mal 
                manuell suchen musst.
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
                <Link to="/dokumentation/erster-workspace">
                  Dein erster Workspace
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

