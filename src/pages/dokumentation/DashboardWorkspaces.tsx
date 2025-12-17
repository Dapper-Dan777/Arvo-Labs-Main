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
import { ArrowLeft, ArrowRight, LayoutDashboard, Users, Settings, Folder } from "lucide-react";

export default function DashboardWorkspaces() {
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
                <BreadcrumbPage>Dashboard & Workspaces</BreadcrumbPage>
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
            Dashboard & Workspaces
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Das Dashboard ist dein zentraler Einstiegspunkt in Arvo Labs. Hier behältst du den Überblick 
              über alle Aufgaben, Projekte und Automationen. Workspaces helfen dir dabei, verschiedene Bereiche 
              deines Unternehmens oder verschiedene Projekte klar zu strukturieren.
            </p>
          </div>

          {/* Dashboard Übersicht */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              Dashboard-Übersicht
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dein Dashboard zeigt dir auf einen Blick:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Offene Aufgaben:</strong> Alle Aufgaben, die deine Aufmerksamkeit benötigen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Aktuelle Automationen:</strong> Übersicht über laufende und geplante Workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">E-Mail-Status:</strong> Anzahl ungelesener Nachrichten und wichtige E-Mails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Team-Aktivitäten:</strong> Was dein Team gerade bearbeitet</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Workspaces verwalten */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Folder className="w-8 h-8 text-primary" />
              Workspaces verwalten
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Workspace erstellen</h3>
                <p className="text-muted-foreground mb-4">
                  Ein neuer Workspace ist ideal für separate Projekte, Kunden oder Abteilungen. 
                  Jeder Workspace hat seine eigenen Dokumente, Automationen und Team-Mitglieder.
                </p>
                <ol className="space-y-2 text-muted-foreground ml-4 list-decimal">
                  <li>Klicke auf „Neuer Workspace" in der linken Seitenleiste</li>
                  <li>Gib einen aussagekräftigen Namen ein (z.B. "Projekt Alpha" oder "Kunde XYZ")</li>
                  <li>Wähle optional eine Farbe oder ein Icon für bessere Unterscheidung</li>
                  <li>Klicke auf „Erstellen"</li>
                </ol>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Zwischen Workspaces wechseln</h3>
                <p className="text-muted-foreground">
                  Du kannst jederzeit zwischen deinen Workspaces wechseln, indem du in der linken Seitenleiste 
                  auf den gewünschten Workspace klickst. Alle Daten bleiben getrennt und übersichtlich.
                </p>
              </div>
            </div>
          </section>

          {/* Team-Struktur */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Team-Struktur in Workspaces
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Jeder Workspace kann sein eigenes Team haben. Das bedeutet:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>Teammitglieder können Zugriff auf mehrere Workspaces haben, aber mit unterschiedlichen Berechtigungen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>Du kannst Workspaces erstellen, die nur für bestimmte Personen sichtbar sind</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span>Jeder Workspace hat seine eigenen Einstellungen und Konfigurationen</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Zentrale Steuerung */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Zentrale Steuerung deiner KI-Workflows
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Im Dashboard kannst du alle deine KI-Workflows und Automationen zentral steuern. 
                Du siehst, welche Automationen aktiv sind, welche gerade laufen und welche Fehler aufgetreten sind.
              </p>
              <p>
                Über das Dashboard kannst du auch schnell neue Automationen erstellen, bestehende bearbeiten 
                oder temporär pausieren, ohne in die einzelnen Workspaces wechseln zu müssen.
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

