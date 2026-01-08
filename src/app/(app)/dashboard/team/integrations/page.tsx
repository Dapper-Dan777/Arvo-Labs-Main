"use client";

import { Check, AlertTriangle, X, Plus, Settings, ExternalLink, Zap, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionGradient } from "@/lib/sectionGradients";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { APIKeysGuide } from "@/components/integrations/APIKeysGuide";
import { IntegrationIcon } from "@/components/integrations/IntegrationIcons";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "connected":
      return <Check className="h-4 w-4 text-primary" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    default:
      return <X className="h-4 w-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    connected: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    disconnected: "bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      <StatusIcon status={status} />
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  );
};

const availableIntegrations = [
  // KI & AI Services
  { name: "OpenAI", description: "GPT-4, DALL-E, Whisper API", defaultStatus: "disconnected" },
  { name: "Anthropic Claude", description: "Claude AI by Anthropic", defaultStatus: "disconnected" },
  { name: "Perplexity", description: "AI-powered search and research", defaultStatus: "disconnected" },
  { name: "Google Gemini", description: "Google's AI model API", defaultStatus: "disconnected" },
  { name: "Cohere", description: "Enterprise AI platform", defaultStatus: "disconnected" },
  { name: "Hugging Face", description: "AI models and datasets", defaultStatus: "disconnected" },
  { name: "Replicate", description: "Run AI models in the cloud", defaultStatus: "disconnected" },
  { name: "Stability AI", description: "Stable Diffusion and AI models", defaultStatus: "disconnected" },
  { name: "Together AI", description: "Open-source AI models API", defaultStatus: "disconnected" },
  { name: "Mistral AI", description: "Open-source LLM API", defaultStatus: "disconnected" },
  // Business & Productivity
  { name: "Gmail", description: "Send and receive emails via Gmail", defaultStatus: "disconnected" },
  { name: "Slack", description: "Send notifications and updates", defaultStatus: "disconnected" },
  { name: "Notion", description: "Sync databases and documents", defaultStatus: "disconnected" },
  { name: "Stripe", description: "Payment processing integration", defaultStatus: "disconnected" },
  { name: "Google Sheets", description: "Import and export data", defaultStatus: "disconnected" },
  { name: "Zapier", description: "Connect apps and automate workflows", defaultStatus: "disconnected" },
  { name: "HubSpot", description: "CRM and marketing automation", defaultStatus: "disconnected" },
  { name: "Airtable", description: "Database and collaboration", defaultStatus: "disconnected" },
  { name: "Mailchimp", description: "Email marketing platform", defaultStatus: "disconnected" },
];

export default function IntegrationsPage() {
  const sectionGradient = useSectionGradient(); // Integrations-Gradient: var(--gradient-integrations)
  const { integrations, updateIntegration, addIntegration, removeIntegration } = useIntegrations();
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogSearch, setAddDialogSearch] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    syncInterval: "",
    notifications: "",
  });
  const { toast } = useToast();

  const handleConnect = async (id: string) => {
    const integration = integrations.find(int => int.id === id);
    
    // Standard Connect für alle Integrationen
    updateIntegration(id, { 
      status: "connected",
      lastSync: "Just now",
    });
    toast({
      title: "Integration verbunden",
      description: `${integration?.name} wurde erfolgreich verbunden.`,
    });
  };

  // Filtere Integrationen basierend auf Suche
  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtere verfügbare Integrationen (die noch nicht hinzugefügt wurden)
  const availableToAdd = availableIntegrations.filter(avail =>
    !integrations.some(integration => 
      integration.name.toLowerCase() === avail.name.toLowerCase()
    )
  ).filter(avail =>
    avail.name.toLowerCase().includes(addDialogSearch.toLowerCase()) ||
    avail.description.toLowerCase().includes(addDialogSearch.toLowerCase())
  );

  const handleSettings = (id: string, name: string) => {
    setSelectedIntegration(name);
    setSelectedIntegrationId(id);
    const integration = integrations.find(int => int.id === id);
    setSettingsForm({
      syncInterval: integration?.config?.syncInterval || "",
      notifications: integration?.config?.notifications || "",
    });
    setSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    if (selectedIntegrationId) {
      updateIntegration(selectedIntegrationId, {
        config: {
          syncInterval: settingsForm.syncInterval,
          notifications: settingsForm.notifications,
        },
      });
      toast({
        title: "Einstellungen gespeichert",
        description: `Einstellungen für ${selectedIntegration} wurden erfolgreich gespeichert.`,
      });
    }
    setSettingsOpen(false);
    setSettingsForm({ syncInterval: "", notifications: "" });
  };

  const handleAddIntegration = (integrationName: string) => {
    const integrationData = availableIntegrations.find(
      avail => avail.name === integrationName
    );
    
    if (integrationData) {
      const newIntegration = addIntegration({
        name: integrationData.name,
        description: integrationData.description,
        icon: integrationData.name.toLowerCase().replace(/\s+/g, "_"),
        status: integrationData.defaultStatus as "connected" | "disconnected" | "warning",
        lastSync: "Never",
      });
      
      toast({
        title: "Integration hinzugefügt",
        description: `${integrationData.name} wurde erfolgreich hinzugefügt. Bitte verbinden Sie die Integration.`,
      });
    }
    setAddIntegrationOpen(false);
  };

  const handleDisconnect = (id: string) => {
    const integration = integrations.find(int => int.id === id);
    updateIntegration(id, {
      status: "disconnected",
      lastSync: "Never",
    });
    toast({
      title: "Integration getrennt",
      description: `${integration?.name} wurde erfolgreich getrennt.`,
    });
  };

  const handleRemove = (id: string) => {
    const integration = integrations.find(int => int.id === id);
    removeIntegration(id);
    toast({
      title: "Integration entfernt",
      description: `${integration?.name} wurde erfolgreich entfernt.`,
    });
  };

  const handleOpenExternal = (integrationName: string) => {
    // URLs zu den API Key/Dokumentations-Seiten
    const urls: Record<string, string> = {
      // KI & AI Services
      OpenAI: "https://platform.openai.com/api-keys",
      "Anthropic Claude": "https://console.anthropic.com/settings/keys",
      Perplexity: "https://www.perplexity.ai/settings/api",
      "Google Gemini": "https://aistudio.google.com/app/apikey",
      Cohere: "https://dashboard.cohere.com/api-keys",
      "Hugging Face": "https://huggingface.co/settings/tokens",
      Replicate: "https://replicate.com/account/api-tokens",
      "Stability AI": "https://platform.stability.ai/account/keys",
      "Together AI": "https://api.together.xyz/settings/api-keys",
      "Mistral AI": "https://console.mistral.ai/api-keys/",
      // Business & Productivity
      Slack: "https://api.slack.com/apps",
      Gmail: "https://console.cloud.google.com/apis/credentials",
      "Google Sheets": "https://console.cloud.google.com/apis/credentials",
      Notion: "https://www.notion.so/my-integrations",
      Webhooks: "https://webhook.site",
      Stripe: "https://dashboard.stripe.com/apikeys",
      Zapier: "https://zapier.com/apps",
      HubSpot: "https://app.hubspot.com/private-apps",
      Airtable: "https://airtable.com/create/tokens",
      Mailchimp: "https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/",
    };
    
    const url = urls[integrationName];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast({
        title: "Externe Seite geöffnet",
        description: `${integrationName} API Key Seite wurde in einem neuen Tab geöffnet.`,
      });
    } else {
      toast({
        title: "URL nicht gefunden",
        description: `Keine URL für ${integrationName} konfiguriert.`,
        variant: "destructive",
      });
    }
  };

  const handleSync = (id: string) => {
    const integration = integrations.find(int => int.id === id);
    updateIntegration(id, {
      lastSync: "Just now",
    });
    toast({
      title: "Synchronisierung gestartet",
      description: `${integration?.name} wird synchronisiert...`,
    });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Plug}
        title="Integrations"
        description="Connect your favorite tools and services"
      />
      
      <div className="flex items-center justify-end gap-2">
        <APIKeysGuide />
        <Button 
          size="sm" 
          className="text-white font-medium"
          style={{ background: sectionGradient }}
          onClick={() => setAddIntegrationOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input 
          placeholder="Search integrations..." 
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
          >
            Zurücksetzen
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredIntegrations.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title={
                searchQuery 
                  ? "Keine Integrationen gefunden"
                  : "Noch keine Integrationen vorhanden"
              }
              description={
                searchQuery 
                  ? `Keine Integrationen gefunden für "${searchQuery}". Versuchen Sie es mit einem anderen Suchbegriff.`
                  : "Verbinden Sie Ihre ersten Dienste, um Workflows zu automatisieren."
              }
              icon={Zap}
              action={
                !searchQuery
                  ? {
                      label: "Integration hinzufügen",
                      icon: Plus,
                      onClick: () => setAddIntegrationOpen(true),
                    }
                  : undefined
              }
              tip="Integrationen ermöglichen es Ihnen, verschiedene Dienste wie Slack, Google Drive oder Trello zu verbinden."
            />
          </div>
        ) : (
          filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <IntegrationIcon name={integration.name} className="w-8 h-8" />
                <StatusBadge status={integration.status} />
              </div>
              
              <h3 className="font-semibold mb-1">{integration.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{integration.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {integration.status !== "disconnected" && `Last sync: ${integration.lastSync || "Never"}`}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {integration.status !== "disconnected" ? (
                    <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleSettings(integration.id, integration.name)}
                          title="Einstellungen"
                        >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleOpenExternal(integration.name)}
                          title="Externe Seite öffnen"
                        >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => handleConnect(integration.id)}
                      >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Add Integration Dialog */}
      <Dialog open={addIntegrationOpen} onOpenChange={(open) => {
        setAddIntegrationOpen(open);
        if (!open) setAddDialogSearch("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Integration hinzufügen</DialogTitle>
            <DialogDescription>
              Wählen Sie eine Integration aus, die Sie verbinden möchten.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Suche nach Integrationen..." 
              value={addDialogSearch}
              onChange={(e) => setAddDialogSearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {availableToAdd.length === 0 ? (
                <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                  {addDialogSearch 
                    ? `Keine verfügbaren Integrationen für "${addDialogSearch}"`
                    : "Alle verfügbaren Integrationen sind bereits hinzugefügt"}
                </div>
              ) : (
                availableToAdd.map((integration) => (
                  <Button
                    key={integration.name}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleAddIntegration(integration.name);
                      setAddDialogSearch("");
                    }}
                  >
                    <IntegrationIcon name={integration.name} className="w-5 h-5 mr-2" />
                    {integration.name}
                  </Button>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddIntegrationOpen(false)}>
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Einstellungen - {selectedIntegration}</DialogTitle>
            <DialogDescription>
              Konfigurieren Sie die Einstellungen für diese Integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Synchronisierungsintervall</label>
              <Input 
                placeholder="z.B. 5 Minuten" 
                value={settingsForm.syncInterval}
                onChange={(e) => setSettingsForm({ ...settingsForm, syncInterval: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Benachrichtigungen</label>
              <Input 
                placeholder="E-Mail für Benachrichtigungen" 
                value={settingsForm.notifications}
                onChange={(e) => setSettingsForm({ ...settingsForm, notifications: e.target.value })}
              />
            </div>
            {selectedIntegrationId && (
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSync(selectedIntegrationId)}
                >
                  Jetzt synchronisieren
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive"
                    onClick={() => {
                      handleDisconnect(selectedIntegrationId);
                      setSettingsOpen(false);
                    }}
                  >
                    Trennen
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive"
                    onClick={() => {
                      handleRemove(selectedIntegrationId);
                      setSettingsOpen(false);
                    }}
                  >
                    Entfernen
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSettingsOpen(false);
              setSettingsForm({ syncInterval: "", notifications: "" });
            }}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-primary to-purple-500">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

