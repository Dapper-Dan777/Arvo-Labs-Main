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
import { ArrowLeft, ArrowRight, MessageSquare, FileText, Zap, Lightbulb } from "lucide-react";

export default function KiChatAssistenten() {
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
                <BreadcrumbPage>KI-Chat & Assistenten</BreadcrumbPage>
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
            KI-Chat & Assistenten
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Der KI-Chat von Arvo Labs ist dein intelligenter Assistent, der dir bei täglichen Aufgaben hilft. 
              Er nutzt deine Dokumente und Wissensbasis, um kontextbezogene Antworten zu geben und 
              wiederkehrende Aufgaben zu übernehmen.
            </p>
          </div>

          {/* Kontextbezogene Antworten */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              Kontextbezogene Antworten
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Der KI-Chat versteht nicht nur deine Fragen, sondern auch den Kontext deines Workspaces:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Workspace-Kontext:</strong> Der Chat weiß, in welchem Workspace du arbeitest und welche Projekte aktuell laufen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Vergangene Gespräche:</strong> Der Assistent erinnert sich an frühere Unterhaltungen und kann darauf Bezug nehmen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Aktuelle Aufgaben:</strong> Er berücksichtigt deine offenen Aufgaben und Termine bei seinen Antworten</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dokumentenwissen nutzen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Dokumentenwissen nutzen
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Wie funktioniert es?</h3>
                <p className="text-muted-foreground mb-4">
                  Der KI-Chat durchsucht automatisch alle Dokumente in deinem Workspace, um Antworten zu finden. 
                  Das bedeutet:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                  <li>Du musst nicht mehr manuell in Dokumenten suchen</li>
                  <li>Der Chat kann konkrete Informationen aus deinen Dateien zitieren</li>
                  <li>Neue Dokumente werden automatisch in die Wissensbasis integriert</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Beispiel-Fragen</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>"Was steht in unserem Vertrag mit Kunde XYZ über die Zahlungsbedingungen?"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>"Wie lautet unser Standardprozess für neue Kundenonboarding?"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>"Welche Informationen haben wir über Projekt Alpha gespeichert?"</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Wiederkehrende Aufgaben delegieren */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Wiederkehrende Aufgaben delegieren
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Der KI-Assistent kann nicht nur Fragen beantworten, sondern auch Aufgaben übernehmen:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">E-Mail-Zusammenfassungen:</strong> Lass dir wichtige E-Mails zusammenfassen, ohne sie alle lesen zu müssen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Text-Generierung:</strong> Erstelle professionelle E-Mails, Dokumente oder Notizen basierend auf deinen Anweisungen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Datenanalyse:</strong> Lass den Assistenten große Dokumente analysieren und die wichtigsten Punkte extrahieren</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Terminplanung:</strong> Der Assistent kann Terminvorschläge generieren oder Kalender-Einträge erstellen</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-primary" />
              Best Practices
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Sei spezifisch:</strong> Je genauer deine Frage ist, desto präziser wird die Antwort. 
                Statt "Was steht in den Dokumenten?" frage besser "Was sind die wichtigsten Punkte aus dem Vertrag mit Kunde XYZ?"
              </p>
              <p>
                <strong className="text-foreground">Nutze Follow-up-Fragen:</strong> Der Chat kann auf deine vorherigen Fragen Bezug nehmen. 
                Nutze das, um tiefer in ein Thema einzusteigen.
              </p>
              <p>
                <strong className="text-foreground">Überprüfe wichtige Informationen:</strong> Bei kritischen Entscheidungen solltest du 
                die vom Chat genannten Informationen noch einmal in den Originaldokumenten überprüfen.
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
                <Link to="/dokumentation/dokumente-wissensbasis">
                  Dokumente & Wissensbasis
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

