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
import { ArrowLeft, ArrowRight, FileCode, Sparkles, Bug, Zap } from "lucide-react";

export default function Updates() {
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
                <BreadcrumbPage>Produkt-Updates & Changelog</BreadcrumbPage>
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
            Produkt-Updates & Changelog
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hier findest du alle Updates, neuen Features und Verbesserungen von Arvo Labs. 
              Wir dokumentieren alle Änderungen transparent, damit du immer auf dem neuesten Stand bist.
            </p>
          </div>

          {/* Aktuelle Version */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-border rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <FileCode className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Version 2.1.0</h2>
                  <p className="text-sm text-muted-foreground">Veröffentlicht am 15. Januar 2025</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Neue Features</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
                      <li>Erweiterte KI-Chat-Funktionen mit besserem Kontextverständnis</li>
                      <li>Neue E-Mail-Vorlagen-Bibliothek mit über 50 professionellen Templates</li>
                      <li>Verbesserte Dashboard-Übersicht mit personalisierbaren Widgets</li>
                      <li>Kalender-Integration für Google Calendar und Outlook</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Verbesserungen</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
                      <li>Bessere Performance bei großen Dokumentensammlungen</li>
                      <li>Optimierte Suche mit schnelleren Ergebnissen</li>
                      <li>Verbesserte Mobile-Ansicht für Smartphones</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Bugfixes</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
                      <li>Behoben: E-Mail-Sync-Probleme bei bestimmten IMAP-Servern</li>
                      <li>Behoben: Fehler beim Speichern langer Dokumente</li>
                      <li>Behoben: Probleme mit der Workspace-Berechtigungsverwaltung</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frühere Updates */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Frühere Updates
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Version 2.0.5</h3>
                  <span className="text-sm text-muted-foreground">5. Januar 2025</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                  <li>Neue API-Endpunkte für erweiterte Integrationen</li>
                  <li>Verbesserte Dokumentenversionierung</li>
                  <li>Kleinere Performance-Optimierungen</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Version 2.0.0</h3>
                  <span className="text-sm text-muted-foreground">20. Dezember 2024</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                  <li>Komplettes Redesign des Dashboards</li>
                  <li>Neue KI-Chat-Funktionen</li>
                  <li>Erweiterte Automatisierungsmöglichkeiten</li>
                  <li>Verbesserte Team-Kollaboration</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Version 1.5.2</h3>
                  <span className="text-sm text-muted-foreground">10. Dezember 2024</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                  <li>Stabilitätsverbesserungen</li>
                  <li>Bugfixes für E-Mail-Automatisierung</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Update-Benachrichtigungen */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Update-Benachrichtigungen
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Du wirst automatisch über wichtige Updates informiert:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>E-Mail-Benachrichtigungen bei größeren Updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>In-App-Benachrichtigungen für neue Features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>RSS-Feed für automatische Update-Informationen</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Nächste Schritte */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Nächste Schritte
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="opux" asChild>
                <Link to="/dokumentation/guides">
                  Guides & Best Practices
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

