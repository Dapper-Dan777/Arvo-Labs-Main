import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ExternalLink, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const guides = {
  gmail: {
    title: "Gmail API Setup",
    icon: "📧",
    steps: [
      {
        step: 1,
        title: "Google Cloud Console Projekt erstellen",
        description: "Erstellen Sie ein neues Projekt in der Google Cloud Console",
        details: [
          "Gehen Sie zu https://console.cloud.google.com/",
          "Klicken Sie auf das Projekt-Dropdown oben",
          "Wählen Sie 'Neues Projekt' aus",
          "Geben Sie einen Projektnamen ein (z.B. 'Arvo Workflows')",
          "Klicken Sie auf 'Erstellen'",
        ],
      },
      {
        step: 2,
        title: "Gmail API aktivieren",
        description: "Aktivieren Sie die Gmail API für Ihr Projekt",
        details: [
          "Navigieren Sie zu 'APIs & Services' > 'Bibliothek'",
          "Suchen Sie nach 'Gmail API'",
          "Klicken Sie auf 'Gmail API' und dann auf 'Aktivieren'",
        ],
      },
      {
        step: 3,
        title: "OAuth Consent Screen konfigurieren",
        description: "Richten Sie den OAuth-Zustimmungsbildschirm ein",
        details: [
          "Gehen Sie zu 'APIs & Services' > 'OAuth-Zustimmungsbildschirm'",
          "Wählen Sie 'Extern' aus und klicken Sie auf 'Erstellen'",
          "Füllen Sie die Pflichtfelder aus (App-Name, E-Mail)",
          "Klicken Sie auf 'Speichern und fortfahren'",
          "Fügen Sie Scopes hinzu:",
          "  • https://www.googleapis.com/auth/gmail.readonly",
          "  • https://www.googleapis.com/auth/gmail.send",
          "  • https://www.googleapis.com/auth/gmail.modify",
          "Fügen Sie Testbenutzer hinzu (Ihre E-Mail)",
        ],
      },
      {
        step: 4,
        title: "OAuth 2.0 Credentials erstellen",
        description: "Erstellen Sie OAuth Client-ID und Secret",
        details: [
          "Gehen Sie zu 'APIs & Services' > 'Anmeldedaten'",
          "Klicken Sie auf '+ Anmeldedaten erstellen' > 'OAuth-Client-ID'",
          "Wählen Sie 'Webanwendung' als Anwendungstyp",
          "Geben Sie einen Namen ein",
          "Fügen Sie autorisierte JavaScript-Ursprünge hinzu:",
          "  • http://localhost:3000 (für Entwicklung)",
          "  • Ihre Produktions-URL",
          "Fügen Sie autorisierte Weiterleitungs-URIs hinzu:",
          "  • http://localhost:3000/auth/callback",
          "Klicken Sie auf 'Erstellen'",
          "⚠️ WICHTIG: Kopieren Sie Client-ID und Client-Secret",
        ],
      },
      {
        step: 5,
        title: "API-Key in Arvo Workflows eintragen",
        description: "Fügen Sie die Credentials in Arvo Workflows ein",
        details: [
          "Öffnen Sie die Integrations-Seite",
          "Klicken Sie auf 'Gmail' > 'Settings'",
          "Fügen Sie Client-ID und Client-Secret ein",
          "Klicken Sie auf 'Speichern'",
          "Klicken Sie auf 'Verbinden', um die OAuth-Autorisierung durchzuführen",
        ],
      },
    ],
  },
  slack: {
    title: "Slack API Setup",
    icon: "💬",
    steps: [
      {
        step: 1,
        title: "Slack App erstellen",
        description: "Erstellen Sie eine neue Slack App",
        details: [
          "Gehen Sie zu https://api.slack.com/apps",
          "Klicken Sie auf 'Create New App' > 'From scratch'",
          "Geben Sie einen App-Namen ein (z.B. 'Arvo Workflows')",
          "Wählen Sie Ihren Workspace aus",
          "Klicken Sie auf 'Create App'",
        ],
      },
      {
        step: 2,
        title: "Bot Token Scopes hinzufügen",
        description: "Fügen Sie die notwendigen Berechtigungen hinzu",
        details: [
          "Gehen Sie zu 'OAuth & Permissions' im linken Menü",
          "Scrollen Sie zu 'Scopes' > 'Bot Token Scopes'",
          "Fügen Sie folgende Berechtigungen hinzu:",
          "  • chat:write - Nachrichten senden",
          "  • chat:write.public - Öffentliche Nachrichten senden",
          "  • channels:read - Kanäle lesen",
          "  • channels:history - Kanal-Verlauf lesen",
          "  • im:read - Direktnachrichten lesen",
          "  • im:history - Direktnachrichten-Verlauf lesen",
        ],
      },
      {
        step: 3,
        title: "App installieren",
        description: "Installieren Sie die App in Ihrem Workspace",
        details: [
          "Scrollen Sie zu 'OAuth Tokens for Your Workspace'",
          "Klicken Sie auf 'Install to Workspace'",
          "Überprüfen Sie die Berechtigungen",
          "Klicken Sie auf 'Allow'",
          "⚠️ WICHTIG: Kopieren Sie den 'Bot User OAuth Token' (beginnt mit xoxb-)",
        ],
      },
      {
        step: 4,
        title: "API-Key in Arvo Workflows eintragen",
        description: "Fügen Sie den Bot Token in Arvo Workflows ein",
        details: [
          "Öffnen Sie die Integrations-Seite",
          "Klicken Sie auf 'Slack' > 'Settings'",
          "Fügen Sie den Bot Token ein: xoxb-your-token-here",
          "Klicken Sie auf 'Speichern'",
          "Klicken Sie auf 'Verbinden', um die Verbindung zu testen",
        ],
      },
    ],
  },
  google_sheets: {
    title: "Google Sheets API Setup",
    icon: "📊",
    steps: [
      {
        step: 1,
        title: "Google Sheets API aktivieren",
        description: "Aktivieren Sie die Google Sheets API",
        details: [
          "Gehen Sie zu Google Cloud Console (siehe Gmail Guide Schritt 1)",
          "Navigieren Sie zu 'APIs & Services' > 'Bibliothek'",
          "Suchen Sie nach 'Google Sheets API'",
          "Klicken Sie auf 'Google Sheets API' und dann auf 'Aktivieren'",
        ],
      },
      {
        step: 2,
        title: "Service Account erstellen",
        description: "Erstellen Sie einen Service Account für automatisierte Zugriffe",
        details: [
          "Gehen Sie zu 'APIs & Services' > 'Anmeldedaten'",
          "Klicken Sie auf '+ Anmeldedaten erstellen' > 'Servicekonto'",
          "Geben Sie einen Namen ein (z.B. 'Arvo Sheets Service')",
          "Klicken Sie auf 'Erstellen und fortfahren'",
          "Überspringen Sie Rollen (optional)",
          "Klicken Sie auf 'Fertig'",
        ],
      },
      {
        step: 3,
        title: "Service Account Key generieren",
        description: "Generieren Sie einen JSON-Key für den Service Account",
        details: [
          "Klicken Sie auf das erstellte Servicekonto",
          "Gehen Sie zum Tab 'Keys'",
          "Klicken Sie auf 'Add Key' > 'Create new key'",
          "Wählen Sie 'JSON' aus",
          "Klicken Sie auf 'Erstellen'",
          "⚠️ WICHTIG: Die JSON-Datei wird heruntergeladen - speichern Sie sie sicher!",
        ],
      },
      {
        step: 4,
        title: "Google Sheet freigeben",
        description: "Geben Sie dem Service Account Zugriff auf Ihre Sheet",
        details: [
          "Öffnen Sie die Google Sheet, die Sie verwenden möchten",
          "Klicken Sie auf 'Teilen' (oben rechts)",
          "Fügen Sie die E-Mail-Adresse des Service Accounts ein",
          "  (finden Sie in der JSON-Datei unter 'client_email')",
          "Geben Sie 'Bearbeiter'-Berechtigung",
          "Klicken Sie auf 'Senden'",
        ],
      },
      {
        step: 5,
        title: "API-Key in Arvo Workflows eintragen",
        description: "Laden Sie die JSON-Datei in Arvo Workflows hoch",
        details: [
          "Öffnen Sie die Integrations-Seite",
          "Klicken Sie auf 'Google Sheets' > 'Settings'",
          "Laden Sie die JSON-Datei hoch oder fügen Sie den Inhalt ein",
          "Klicken Sie auf 'Speichern'",
        ],
      },
    ],
  },
  notion: {
    title: "Notion API Setup",
    icon: "📝",
    steps: [
      {
        step: 1,
        title: "Notion Integration erstellen",
        description: "Erstellen Sie eine neue Integration in Notion",
        details: [
          "Gehen Sie zu https://www.notion.so/my-integrations",
          "Klicken Sie auf '+ New integration'",
          "Geben Sie einen Namen ein (z.B. 'Arvo Workflows')",
          "Wählen Sie Ihren Workspace aus",
          "Wählen Sie die gewünschten Capabilities:",
          "  • ✅ Read content",
          "  • ✅ Update content",
          "  • ✅ Insert content",
          "Klicken Sie auf 'Submit'",
          "⚠️ WICHTIG: Kopieren Sie den 'Internal Integration Token' (beginnt mit secret_)",
        ],
      },
      {
        step: 2,
        title: "Notion Seite/Datenbank freigeben",
        description: "Verbinden Sie Ihre Integration mit Notion-Seiten",
        details: [
          "Öffnen Sie die Notion-Seite oder -Datenbank",
          "Klicken Sie auf die drei Punkte oben rechts",
          "Wählen Sie 'Connections'",
          "Suchen Sie nach Ihrer Integration ('Arvo Workflows')",
          "Klicken Sie darauf, um sie zu verbinden",
        ],
      },
      {
        step: 3,
        title: "API-Key in Arvo Workflows eintragen",
        description: "Fügen Sie den Integration Token in Arvo Workflows ein",
        details: [
          "Öffnen Sie die Integrations-Seite",
          "Klicken Sie auf 'Notion' > 'Settings'",
          "Fügen Sie den Integration Token ein: secret_your-token-here",
          "Klicken Sie auf 'Speichern'",
          "Klicken Sie auf 'Verbinden', um die Verbindung zu testen",
        ],
      },
      {
        step: 4,
        title: "Datenbank-ID finden",
        description: "Finden Sie die ID Ihrer Notion-Datenbank",
        details: [
          "Öffnen Sie Ihre Notion-Datenbank in einem Browser",
          "Die URL sieht so aus: https://www.notion.so/workspace/DATABASE_ID?v=...",
          "Kopieren Sie die DATABASE_ID (32 Zeichen, Hex-String)",
          "Verwenden Sie diese ID in Ihren Workflows",
        ],
      },
    ],
  },
  webhook: {
    title: "Webhooks Setup",
    icon: "🔗",
    steps: [
      {
        step: 1,
        title: "Webhook-URL erhalten",
        description: "Erhalten Sie eine Webhook-URL von Ihrem Service",
        details: [
          "Identifizieren Sie den Service, der Webhooks senden soll",
          "Erstellen Sie eine Webhook-URL in Ihrem Ziel-Service",
          "Kopieren Sie die Webhook-URL",
        ],
      },
      {
        step: 2,
        title: "Webhook in Arvo Workflows konfigurieren",
        description: "Richten Sie Webhooks in Ihren Workflows ein",
        details: [
          "Erstellen Sie einen neuen Workflow",
          "Wählen Sie 'Webhook' als Trigger",
          "Kopieren Sie die generierte Webhook-URL",
          "Fügen Sie diese URL in Ihrem externen Service ein",
        ],
      },
      {
        step: 3,
        title: "Webhook als Action verwenden",
        description: "Verwenden Sie Webhooks, um Daten an externe Services zu senden",
        details: [
          "Fügen Sie eine 'Webhook'-Action zu Ihrem Workflow hinzu",
          "Geben Sie die Ziel-URL ein",
          "Wählen Sie die HTTP-Methode (GET, POST, PUT, DELETE)",
          "Fügen Sie optional Headers hinzu",
          "Konfigurieren Sie den Body (JSON, Form-Data, etc.)",
        ],
      },
    ],
  },
};

interface APIKeysGuideProps {
  integration?: string;
}

export function APIKeysGuide({ integration }: APIKeysGuideProps) {
  const [open, setOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>(integration || "gmail");
  const { toast } = useToast();

  const guide = guides[selectedGuide as keyof typeof guides];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Text wurde in die Zwischenablage kopiert.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          API Keys Anleitung
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            API Keys & Integration Setup Guide
          </DialogTitle>
          <DialogDescription>
            Schritt-für-Schritt Anleitungen für die Konfiguration von API-Keys
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedGuide} onValueChange={setSelectedGuide} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="gmail" className="flex items-center gap-1">
              <span>📧</span>
              <span className="hidden sm:inline">Gmail</span>
            </TabsTrigger>
            <TabsTrigger value="slack" className="flex items-center gap-1">
              <span>💬</span>
              <span className="hidden sm:inline">Slack</span>
            </TabsTrigger>
            <TabsTrigger value="google_sheets" className="flex items-center gap-1">
              <span>📊</span>
              <span className="hidden sm:inline">Sheets</span>
            </TabsTrigger>
            <TabsTrigger value="notion" className="flex items-center gap-1">
              <span>📝</span>
              <span className="hidden sm:inline">Notion</span>
            </TabsTrigger>
            <TabsTrigger value="webhook" className="flex items-center gap-1">
              <span>🔗</span>
              <span className="hidden sm:inline">Webhook</span>
            </TabsTrigger>
          </TabsList>

          {Object.keys(guides).map((key) => {
            const currentGuide = guides[key as keyof typeof guides];
            return (
              <TabsContent key={key} value={key} className="mt-0">
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <span className="text-4xl">{currentGuide.icon}</span>
                      <div>
                        <h2 className="text-xl font-semibold">{currentGuide.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {currentGuide.steps.length} Schritte
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {currentGuide.steps.map((step) => (
                        <div key={step.step} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {step.step}
                              </span>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold text-base">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                {step.details.map((detail, idx) => {
                                  const isUrl = detail.startsWith("http");
                                  const isImportant = detail.startsWith("⚠️");
                                  const isCheckbox = detail.startsWith("  •");
                                  
                                  return (
                                    <div
                                      key={idx}
                                      className={`text-sm flex items-start gap-2 ${
                                        isCheckbox ? "pl-4" : ""
                                      } ${isImportant ? "text-warning font-medium" : ""}`}
                                    >
                                      {isUrl ? (
                                        <a
                                          href={detail}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline flex items-center gap-1"
                                        >
                                          {detail}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      ) : isCheckbox ? (
                                        <>
                                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                          <span className="flex-1">{detail.replace("  •", "")}</span>
                                        </>
                                      ) : (
                                        <span className="flex-1">{detail}</span>
                                      )}
                                      {isUrl && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5"
                                          onClick={() => handleCopy(detail)}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sicherheitshinweise */}
                    <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Sicherheitshinweise</h4>
                          <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                            <li>API-Keys niemals in öffentlichen Repositories speichern</li>
                            <li>Verwenden Sie Umgebungsvariablen für API-Keys</li>
                            <li>Gewähren Sie nur notwendigste Berechtigungen</li>
                            <li>Rotieren Sie API-Keys regelmäßig (alle 90 Tage)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

