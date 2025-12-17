import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Rocket,
  Zap,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Mail,
  Workflow,
  Plug,
  Calendar,
  Code,
  ArrowRight,
  FileCode,
  Lightbulb,
} from "lucide-react";

export default function Dokumentation() {
  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-6 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Startseite</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dokumentation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* 1. Hero-Bereich "Dokumentation & Hilfe" */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                Dokumentation & Hilfe
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
                Hier findest du Anleitungen, Feature-Guides, Integrationsbeschreibungen und Antworten auf häufige Fragen. 
                Alles, was du brauchst, um mit Arvo Labs produktiver zu werden.
              </p>

              {/* Suchfeld */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Suche nach Themen, z.B. 'E-Mails automatisieren'"
                  className="pl-10 h-12 text-base"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Tipp: Starte mit „Erste Schritte", wenn du neu bei Arvo Labs bist.
              </p>
            </div>

            {/* Dashboard-Bild - Hier später ein echtes Arvo-Labs-Screenshot/GIF einbauen */}
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format"
                alt="Arvo Labs Dashboard"
                className="rounded-xl border border-border shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sektion "Erste Schritte" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Erste Schritte
            </h2>
            <p className="text-muted-foreground text-lg">
              Dieser Bereich ist ideal für neue Nutzer:innen. Hier lernst du die Grundlagen von Arvo Labs kennen und kannst schnell loslegen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card: Was ist Arvo Labs? */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Was ist Arvo Labs?</CardTitle>
                <CardDescription>
                  Lerne Arvo Labs kennen: Ein All-in-One-Tool für Automatisierung und KI-Unterstützung im Alltag. 
                  Perfekt für Teams und Solo-Selbstständige, die Zeit sparen und effizienter arbeiten wollen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format"
                  alt="Arvo Labs Übersicht"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/was-ist-arvo-labs">
                    Artikel lesen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Card: Dein erster Workspace */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Dein erster Workspace</CardTitle>
                <CardDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Workspace anlegen</li>
                    <li>Team einladen</li>
                    <li>Grundlegende Einstellungen</li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&auto=format"
                  alt="Workspace Setup"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/erster-workspace">
                    Schritt-für-Schritt Anleitung
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Card: Erste Automatisierung erstellen */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Erste Automatisierung erstellen</CardTitle>
                <CardDescription>
                  In wenigen Minuten kannst du deine erste Automatisierung bauen. 
                  Beispiel: Automatische E-Mail-Reminder für wiederkehrende Aufgaben.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&auto=format"
                  alt="Automatisierung"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/erste-automatisierung">
                    Guide öffnen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Sektion "Features im Detail" */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Features im Detail
            </h2>
            <p className="text-muted-foreground text-lg">
              Lerne die wichtigsten Bereiche von Arvo Labs kennen – vom Dashboard bis zur E-Mail-Automatisierung.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Dashboard & Workspaces */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">Dashboard & Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Überblick über Aufgaben</li>
                  <li>• Struktur für Teams</li>
                  <li>• Zentrale Steuerung deiner KI-Workflows</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/dashboard-workspaces">Zur Doku</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* KI-Chat & Assistenten */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">KI-Chat & Assistenten</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Kontextbezogene Antworten</li>
                  <li>• Dokumentenwissen nutzen</li>
                  <li>• Wiederkehrende Aufgaben delegieren</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/ki-chat-assistenten">Zur Doku</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Dokumente & Wissensbasis */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">Dokumente & Wissensbasis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Wissensspeicher für dein Team</li>
                  <li>• Versionierung & Updates</li>
                  <li>• Suche über alle Inhalte</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/dokumente-wissensbasis">Zur Doku</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* E-Mail & Kommunikation */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">E-Mail & Kommunikation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• E-Mails automatisiert beantworten</li>
                  <li>• Vorlagen & Sequenzen</li>
                  <li>• Tracking und Nachverfolgung</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/email-kommunikation">Zur Doku</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Automationen & Workflows */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <Workflow className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">Automationen & Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• If-this-then-that Logik</li>
                  <li>• Wiederkehrende Tasks automatisieren</li>
                  <li>• Integration externer Systeme</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/automationen-workflows">Zur Doku</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Sektion "Integrationen & API" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Integrationen & API
            </h2>
            <p className="text-muted-foreground text-lg">
              Arvo Labs verbindet sich nahtlos mit E-Mail, Kalender, CRM und anderen Tools, 
              um deine Automatisierungen zu erweitern und deinen Workflow zu optimieren.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Linke Spalte: Textblock */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Warum Integrationen wichtig sind
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrationen ermöglichen es dir, alle deine Tools an einem Ort zu steuern. 
                Statt zwischen verschiedenen Anwendungen zu wechseln, kannst du E-Mails, Termine und Daten 
                direkt in Arvo Labs verwalten und automatisieren.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Durch die Verbindung mit externen Systemen sparst du nicht nur Zeit, sondern reduzierst 
                auch Fehlerquellen und schaffst eine zentrale Wissensbasis für dein Team.
              </p>
            </div>

            {/* Rechte Spalte: Cards */}
            <div className="space-y-4">
              {/* E-Mail-Postfächer */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">E-Mail-Postfächer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Einrichtung, Sync, automatische Antworten und intelligente Kategorisierung deiner E-Mails.
                  </p>
                </CardContent>
              </Card>

              {/* Kalender & Termine */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Kalender & Termine</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Meetings, Erinnerungen, Follow-ups und automatische Terminplanung direkt aus Arvo Labs.
                  </p>
                </CardContent>
              </Card>

              {/* Weitere Integrationen */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plug className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Weitere Integrationen</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Weitere Verbindungen folgen – sag uns, welche Tools du brauchst.
                  </p>
                </CardContent>
              </Card>

              {/* API & Entwicklerbereich */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">API & Entwicklerbereich</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Technische Details, Authentifizierung und Beispiel-Requests für Entwickler:innen. 
                    Erweitere Arvo Labs nach deinen Bedürfnissen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sektion "FAQ & Troubleshooting" */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              FAQ & Troubleshooting
            </h2>
            <p className="text-muted-foreground text-lg">
              Hier findest du Antworten auf die häufigsten Fragen und kannst kleinere Probleme selbst lösen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  Ich kann mich nicht einloggen – was tun?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      Wenn du dich nicht einloggen kannst, prüfe zuerst deinen Browser-Cache und versuche, 
                      die Seite neu zu laden. Falls das nicht hilft, kannst du dein Passwort zurücksetzen, 
                      indem du auf „Passwort vergessen" klickst.
                    </p>
                    <p>
                      Überprüfe auch, ob es aktuelle Wartungsarbeiten gibt, indem du unsere Status-Seite besuchst. 
                      Falls das Problem weiterhin besteht, kontaktiere unseren Support – wir helfen dir gerne weiter.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Wie ändere ich meinen Plan oder mein Abo?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      Du kannst deinen Plan jederzeit in den Einstellungen unter „Abrechnung" ändern. 
                      Dort siehst du alle verfügbaren Pläne und kannst zwischen monatlicher und jährlicher Abrechnung wechseln.
                    </p>
                    <p>
                      Wichtig: Änderungen am Abrechnungszyklus werden zum nächsten Abrechnungszeitpunkt wirksam. 
                      Eine Downgrade-Änderung wird erst nach Ablauf deines aktuellen Abrechnungszeitraums aktiv.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Wie erreiche ich den Support?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      Du kannst uns über das Kontaktformular auf unserer Website erreichen oder eine E-Mail 
                      an support@arvo-labs.de senden. Wir melden uns in der Regel innerhalb von 24 Stunden zurück.
                    </p>
                    <p>
                      Für dringende technische Probleme nutze bitte unser Support-Ticket-System, 
                      das du direkt in deinem Arvo Labs Dashboard findest.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <Button variant="opux" size="lg" asChild className="mb-4">
              <Link to="/kontakt">
                Support kontaktieren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Du hast keine passende Antwort gefunden? Schreib uns – wir melden uns in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Sektion "Ressourcen & Updates" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Ressourcen & Updates
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Produkt-Updates & Changelog */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileCode className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Produkt-Updates & Changelog</CardTitle>
                <CardDescription>
                  Bleib auf dem Laufenden über neue Features, Verbesserungen und Bugfixes. 
                  Wir dokumentieren alle Änderungen transparent und nachvollziehbar.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/updates">
                    Zu den Updates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Guides & Best Practices */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Guides & Best Practices</CardTitle>
                <CardDescription>
                  Erfahre, wie andere Nutzer:innen Arvo Labs erfolgreich einsetzen. 
                  Von Tipps für Einsteiger bis zu fortgeschrittenen Automatisierungsstrategien.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/guides">
                    Zu den Guides
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

