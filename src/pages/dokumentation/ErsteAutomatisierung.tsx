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
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";

export default function ErsteAutomatisierung() {
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
                <BreadcrumbPage>Erste Automatisierung erstellen</BreadcrumbPage>
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
            Erste Automatisierung erstellen
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Automatisierungen sind das Herzstück von Arvo Labs. Sie übernehmen wiederkehrende Aufgaben 
              für dich, sparen Zeit und sorgen für konsistente Ergebnisse. Stell dir vor, jede neue 
              Kundenanfrage wird automatisch beantwortet, Termine werden selbstständig koordiniert und 
              wichtige Informationen werden nie vergessen.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              In diesem Guide lernst du, wie du in wenigen Minuten deine erste Automatisierung erstellst. 
              Wir beginnen mit einem einfachen, aber praktischen Beispiel: einer automatischen Antwort auf 
              neue Anfragen.
            </p>
          </div>

          {/* Beispiel: Automatische Antwort auf neue Anfrage */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Beispiel: Automatische Antwort auf neue Anfrage
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Was macht diese Automatisierung?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sobald eine neue E-Mail in deinem Postfach eintrifft, die bestimmte Kriterien erfüllt 
                (z.B. enthält das Wort "Anfrage" im Betreff), wird automatisch eine professionelle 
                Antwort-E-Mail erstellt und versendet. Du erhältst eine Benachrichtigung, damit du 
                informiert bleibst, aber musst nicht mehr jede einzelne Anfrage manuell beantworten.
              </p>
            </div>
          </section>

          {/* Vorbereitung */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Vorbereitung
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <h3 className="font-semibold text-foreground mb-4">Was du benötigst:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">E-Mail-Postfach verbunden:</strong> Stelle sicher, 
                    dass du mindestens ein E-Mail-Postfach in Arvo Labs verbunden hast. Dies kannst du 
                    in den Einstellungen unter „Integrationen" erledigen.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">Workspace eingerichtet:</strong> Du solltest bereits 
                    einen Workspace haben, in dem du arbeiten kannst.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">Antwortvorlage im Kopf:</strong> Überlege dir, 
                    welche Antwort du automatisch senden möchtest. Sie sollte professionell, hilfreich 
                    und nicht zu generisch sein.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Schritt-für-Schritt Anleitung */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Schritt-für-Schritt Anleitung
            </h2>

            <div className="space-y-6">
              {/* Schritt 1 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Trigger wählen</h3>
                    <p className="text-muted-foreground mb-3">
                      Gehe zu „Automationen" in der linken Seitenleiste und klicke auf „Neue Automatisierung". 
                      Wähle als Trigger „Neue E-Mail empfangen" aus.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Ein Trigger ist das Ereignis, das deine Automatisierung startet – in diesem Fall 
                      das Eintreffen einer neuen E-Mail.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schritt 2 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Bedingung definieren</h3>
                    <p className="text-muted-foreground mb-3">
                      Jetzt legst du fest, wann die Automatisierung ausgelöst werden soll. Füge eine Bedingung 
                      hinzu, z.B. „Betreff enthält 'Anfrage'" oder „Absender ist nicht in Kontaktliste".
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Tipp: Beginne mit einer einfachen Bedingung. Du kannst später weitere hinzufügen, 
                      um die Automatisierung zu verfeinern.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schritt 3 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Antwortvorlage erstellen</h3>
                    <p className="text-muted-foreground mb-3">
                      Klicke auf „Aktion hinzufügen" und wähle „E-Mail senden". Erstelle deine Antwortvorlage:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                      <li>Betreff: z.B. "Vielen Dank für Ihre Anfrage"</li>
                      <li>Text: Eine freundliche, professionelle Antwort, die dem Absender zeigt, dass seine Nachricht angekommen ist</li>
                      <li>Optional: Nutze Variablen wie {`{Absender-Name}`} für eine persönliche Ansprache</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Schritt 4 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Testlauf durchführen</h3>
                    <p className="text-muted-foreground mb-3">
                      Bevor du die Automatisierung aktivierst, solltest du einen Testlauf durchführen. 
                      Klicke auf „Testen" und sende dir selbst eine Test-E-Mail, die deine Bedingung erfüllt.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Überprüfe, ob die Antwort korrekt formuliert ist und ob alle Variablen richtig 
                      eingefügt werden.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schritt 5 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Automatisierung aktivieren</h3>
                    <p className="text-muted-foreground">
                      Wenn alles passt, aktiviere die Automatisierung mit dem Schalter oben rechts. 
                      Ab jetzt läuft sie automatisch im Hintergrund und bearbeitet eingehende E-Mails 
                      entsprechend deiner Regeln.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tipps & Best Practices */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">
              Tipps & Best Practices
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Klare Betreffzeilen verwenden</h3>
                    <p className="text-sm text-muted-foreground">
                      Deine automatischen Antworten sollten einen aussagekräftigen Betreff haben, 
                      der dem Empfänger sofort zeigt, worum es geht. Vermeide generische Betreffzeilen 
                      wie "Automatische Antwort".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Persönliche Ansprache nicht vergessen</h3>
                    <p className="text-sm text-muted-foreground">
                      Nutze Variablen, um den Namen des Absenders einzufügen. Eine persönliche Ansprache 
                      wirkt professioneller und freundlicher als eine generische Nachricht.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Logs regelmäßig prüfen</h3>
                    <p className="text-sm text-muted-foreground">
                      Schaue in den ersten Tagen regelmäßig in die Automatisierungs-Logs, um zu sehen, 
                      ob alles wie erwartet funktioniert. So kannst du schnell Anpassungen vornehmen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Nicht zu viele Automationen parallel starten</h3>
                    <p className="text-sm text-muted-foreground">
                      Beginne mit einer oder zwei Automatisierungen und gewöhne dich daran, bevor du 
                      weitere hinzufügst. So behältst du den Überblick und kannst Probleme schneller 
                      identifizieren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Erwartungen kommunizieren</h3>
                    <p className="text-sm text-muted-foreground">
                      In deiner automatischen Antwort solltest du klar kommunizieren, wann der Empfänger 
                      mit einer ausführlichen Antwort rechnen kann. Das schafft Transparenz und vermeidet 
                      Unzufriedenheit.
                    </p>
                  </div>
                </div>
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
                Jetzt, da du deine erste Automatisierung erstellt hast, kannst du weitere automatisierte 
                Workflows aufbauen:
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="opux" asChild>
                <Link to="/dokumentation/automationen-workflows">
                  Weitere Automatisierungen
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

