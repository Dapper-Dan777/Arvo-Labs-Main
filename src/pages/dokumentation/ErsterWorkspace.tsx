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
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ErsterWorkspace() {
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
                <BreadcrumbPage>Dein erster Workspace</BreadcrumbPage>
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
            Dein erster Workspace
          </h1>

          {/* Einleitung */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ein Workspace in Arvo Labs ist dein zentraler Kontainer für Team, Daten und Automationen. 
              Hier organisierst du alle deine Projekte, Dokumente und Workflows an einem Ort. 
              Dieser Guide führt dich Schritt für Schritt durch die Einrichtung deines ersten Workspaces.
            </p>
          </div>

          {/* Voraussetzungen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Voraussetzungen
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Ein aktiver Arvo Labs Account (kostenlos registrieren unter arvo-labs.de)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Zugriff auf deine E-Mail-Adresse für die Bestätigung</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Optional: Bereits vorhandene E-Mail-Postfächer oder Kalender, die du verbinden möchtest</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Schritt 1: Workspace anlegen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Schritt 1: Workspace anlegen
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Nach dem Login</h3>
                    <p className="text-muted-foreground">
                      Nachdem du dich in dein Arvo Labs Konto eingeloggt hast, wirst du automatisch zum 
                      Workspace-Setup weitergeleitet. Falls nicht, klicke auf „Neuer Workspace" in der 
                      oberen Navigationsleiste.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Workspace-Name wählen</h3>
                    <p className="text-muted-foreground mb-2">
                      Gib deinem Workspace einen aussagekräftigen Namen. Dieser Name wird in der gesamten 
                      Anwendung angezeigt und kann später geändert werden.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Tipp: Verwende den Namen deines Unternehmens oder Projekts, z.B. "Mein Unternehmen" 
                      oder "Projekt Alpha".
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Workspace erstellen</h3>
                    <p className="text-muted-foreground">
                      Klicke auf „Workspace erstellen". Dein Workspace wird nun angelegt und du wirst 
                      automatisch zum Dashboard weitergeleitet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Schritt 2: Teammitglieder einladen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Schritt 2: Teammitglieder einladen
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
              <p className="text-muted-foreground leading-relaxed">
                Ein Workspace wird erst richtig wertvoll, wenn mehrere Personen zusammenarbeiten. 
                Gemeinsam könnt ihr Aufgaben verteilen, Dokumente teilen und Automationen nutzen, 
                die für alle sichtbar sind.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Zum Einstellungsbereich navigieren</h3>
                    <p className="text-muted-foreground">
                      Klicke in der linken Seitenleiste auf „Einstellungen" und wähle dann „Team" aus.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Einladung senden</h3>
                    <p className="text-muted-foreground mb-2">
                      Klicke auf „Teammitglied einladen" und gib die E-Mail-Adresse der Person ein, 
                      die du einladen möchtest.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Die eingeladene Person erhält eine E-Mail mit einem Link zur Registrierung. 
                      Nach der Anmeldung hat sie automatisch Zugriff auf den Workspace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Berechtigungen verwalten</h3>
                    <p className="text-muted-foreground">
                      Du kannst für jedes Teammitglied individuelle Berechtigungen festlegen: 
                      Admin, Editor oder Viewer. Diese können jederzeit geändert werden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Schritt 3: Erste Bereiche strukturieren */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Schritt 3: Erste Bereiche strukturieren
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
              <p className="text-muted-foreground leading-relaxed">
                Ein gut strukturierter Workspace macht die Zusammenarbeit einfacher und hilft dir, 
                den Überblick zu behalten. Überlege dir, welche Bereiche für dein Team wichtig sind.
              </p>
            </div>

            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Tipps für die Strukturierung:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Channels/Projekte benennen:</strong> Verwende klare, 
                    aussagekräftige Namen wie "Kundenkommunikation", "Interne Dokumente" oder "Marketing". 
                    Vermeide zu generische Namen wie "Ordner 1".
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Informationen kategorisieren:</strong> Überlege, 
                    welche Informationen wohin gehören. E-Mails und Kommunikation in einen Bereich, 
                    Dokumente und Wissensbasis in einen anderen.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Nicht zu komplex starten:</strong> Beginne mit 
                    3-5 Bereichen und erweitere die Struktur später, wenn du merkst, was wirklich gebraucht wird.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">Team einbeziehen:</strong> Frage dein Team, 
                    welche Struktur für sie sinnvoll ist. Ein Workspace sollte für alle praktisch sein.
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Beispiel-Struktur für einen kleinen Betrieb:</h3>
                <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                  <li>Kundenanfragen (für E-Mails und Kommunikation)</li>
                  <li>Interne Dokumente (für Prozesse, Vorlagen, Notizen)</li>
                  <li>Termine & Kalender (für Planung und Erinnerungen)</li>
                  <li>Automatisierungen (für alle Workflows und Automationen)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Nächste Schritte */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Nächste Schritte
            </h2>
            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">
                Jetzt, da dein Workspace eingerichtet ist, kannst du mit den ersten praktischen Schritten beginnen:
              </p>
            </div>
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

