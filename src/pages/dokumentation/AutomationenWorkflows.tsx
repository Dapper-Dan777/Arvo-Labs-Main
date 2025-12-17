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
import { ArrowLeft, ArrowRight, Workflow, Zap, GitBranch, Settings } from "lucide-react";

export default function AutomationenWorkflows() {
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
                <BreadcrumbPage>Automationen & Workflows</BreadcrumbPage>
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
            Automationen & Workflows
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Automationen sind das Herzstück von Arvo Labs. Sie übernehmen wiederkehrende Aufgaben für dich, 
              sparen Zeit und reduzieren Fehler. Mit der If-this-then-that Logik kannst du komplexe Workflows 
              erstellen, die genau deinen Bedürfnissen entsprechen.
            </p>
          </div>

          {/* If-this-then-that Logik */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Workflow className="w-8 h-8 text-primary" />
              If-this-then-that Logik
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Jede Automatisierung folgt einem einfachen Prinzip: Wenn ein bestimmtes Ereignis eintritt, 
                dann wird eine Aktion ausgeführt. Du kannst mehrere Bedingungen und Aktionen kombinieren:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Trigger:</strong> Das Ereignis, das die Automatisierung startet (z.B. neue E-Mail, Termin, Dokument hochgeladen)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Bedingungen:</strong> Zusätzliche Kriterien, die erfüllt sein müssen (z.B. E-Mail enthält bestimmtes Wort, Absender ist bekannt)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Aktionen:</strong> Was passieren soll (z.B. E-Mail senden, Aufgabe erstellen, Dokument speichern)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Wiederkehrende Tasks automatisieren */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Wiederkehrende Tasks automatisieren
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Beispiele für automatisierbare Aufgaben</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>Automatische Antworten auf Kundenanfragen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>Erinnerungen für wiederkehrende Termine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>Automatische Kategorisierung von E-Mails</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>Follow-up-E-Mails nach Meetings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-semibold">•</span>
                    <span>Automatische Dokumentenerstellung basierend auf Vorlagen</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Zeitersparnis durch Automatisierung</h3>
                <p className="text-muted-foreground">
                  Selbst einfache Automationen können dir täglich mehrere Stunden sparen. Wenn du eine Aufgabe 
                  mehrfach pro Woche wiederholst, lohnt es sich, sie zu automatisieren. Beginne mit den 
                  einfachsten und häufigsten Aufgaben und erweitere deine Automationen schrittweise.
                </p>
              </div>
            </div>
          </section>

          {/* Integration externer Systeme */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Integration externer Systeme
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Arvo Labs kann sich mit verschiedenen externen Systemen verbinden, um deine Automationen 
                zu erweitern:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">E-Mail-Postfächer:</strong> Gmail, Outlook, IMAP-Server</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Kalender:</strong> Google Calendar, Outlook Calendar, iCal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">CRM-Systeme:</strong> Verbindungen zu gängigen CRM-Tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">API-Integrationen:</strong> Über die API kannst du eigene Systeme anbinden</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Workflow-Versionierung */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-primary" />
              Workflow-Versionierung & Testing
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Testen vor Aktivierung:</strong> Jede Automatisierung kann 
                vor der Aktivierung getestet werden. Nutze die Testfunktion, um sicherzustellen, dass alles 
                wie erwartet funktioniert.
              </p>
              <p>
                <strong className="text-foreground">Versionierung:</strong> Änderungen an Automationen werden 
                gespeichert. Du kannst zu früheren Versionen zurückkehren, falls etwas nicht wie erwartet läuft.
              </p>
              <p>
                <strong className="text-foreground">Logs & Monitoring:</strong> Überprüfe regelmäßig die Logs 
                deiner Automationen, um Fehler frühzeitig zu erkennen und zu beheben.
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

