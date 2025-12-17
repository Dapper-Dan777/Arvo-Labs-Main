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
import { ArrowLeft, ArrowRight, FileText, Search, GitBranch, Users } from "lucide-react";

export default function DokumenteWissensbasis() {
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
                <BreadcrumbPage>Dokumente & Wissensbasis</BreadcrumbPage>
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
            Dokumente & Wissensbasis
          </h1>

          {/* Intro */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Die Wissensbasis ist das zentrale Gedächtnis deines Workspaces. Hier speicherst du alle wichtigen 
              Informationen, Dokumente und Prozesse, die dein Team täglich braucht. Arvo Labs macht diese 
              Informationen durchsuchbar und für den KI-Assistenten nutzbar.
            </p>
          </div>

          {/* Wissensspeicher für dein Team */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Wissensspeicher für dein Team
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8 mb-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Alle Dokumente, die du in Arvo Labs hochlädst oder erstellst, werden automatisch in der 
                Wissensbasis gespeichert und sind für dein Team zugänglich:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Zentrale Ablage:</strong> Keine verstreuten Dateien mehr – alles an einem Ort</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Team-Zugriff:</strong> Teammitglieder können Dokumente einsehen, bearbeiten oder kommentieren</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">KI-Integration:</strong> Der KI-Chat kann auf alle Dokumente zugreifen und Informationen daraus extrahieren</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Versionierung & Updates */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-primary" />
              Versionierung & Updates
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Automatische Versionshistorie</h3>
                <p className="text-muted-foreground mb-4">
                  Arvo Labs speichert automatisch alle Änderungen an deinen Dokumenten. Das bedeutet:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                  <li>Du kannst jederzeit zu einer früheren Version zurückkehren</li>
                  <li>Du siehst, wer wann welche Änderungen vorgenommen hat</li>
                  <li>Keine Sorge mehr vor versehentlichem Überschreiben wichtiger Informationen</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Dokumente aktualisieren</h3>
                <p className="text-muted-foreground">
                  Wenn du ein Dokument aktualisierst, bleibt die alte Version erhalten. Du kannst beide 
                  Versionen vergleichen und bei Bedarf wiederherstellen. Teammitglieder werden automatisch 
                  über wichtige Updates informiert.
                </p>
              </div>
            </div>
          </section>

          {/* Suche über alle Inhalte */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              Suche über alle Inhalte
            </h2>
            <div className="bg-secondary/30 border border-border rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die intelligente Suche durchsucht nicht nur Dateinamen, sondern auch den Inhalt aller Dokumente:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Volltext-Suche:</strong> Finde Dokumente anhand von Begriffen, die im Text vorkommen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">KI-gestützte Suche:</strong> Der KI-Assistent kann semantisch suchen – versteht also die Bedeutung, nicht nur exakte Wortübereinstimmungen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-semibold">•</span>
                  <span><strong className="text-foreground">Filter & Kategorien:</strong> Filtere nach Datum, Autor, Workspace oder Dokumenttyp</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dokumente organisieren */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Dokumente organisieren
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Ordnerstruktur:</strong> Erstelle Ordner und Unterordner, 
                um deine Dokumente logisch zu strukturieren. Du kannst Dokumente per Drag & Drop verschieben.
              </p>
              <p>
                <strong className="text-foreground">Tags & Kategorien:</strong> Versehe Dokumente mit Tags, 
                um sie thematisch zu gruppieren. So findest du verwandte Dokumente schneller.
              </p>
              <p>
                <strong className="text-foreground">Favoriten:</strong> Markiere wichtige Dokumente als Favoriten, 
                um schnellen Zugriff zu haben.
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
                <Link to="/dokumentation/ki-chat-assistenten">
                  KI-Chat & Assistenten
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

