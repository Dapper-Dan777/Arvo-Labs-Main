import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Download, Eye, Bot, Trash2, ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSectionGradient } from "@/lib/sectionGradients";
import { Chatbot, ChatbotInput, getChatbotById, updateChatbot, deleteChatbot } from "@/lib/chatbots";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatbotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const sectionGradient = useSectionGradient();

  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "",
    customInstructions: "",
    primaryColor: "#4facfe",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    // Botpress
    botpressBotId: "",
    botpressComposerPlaceholder: "Schreibe eine Nachricht...",
    botpressBotName: "",
    botpressBotAvatar: "",
  });

  // Lade Chatbot
  useEffect(() => {
    if (id && user?.id) {
      loadChatbot();
    }
  }, [id, user?.id]);

  const loadChatbot = async () => {
    if (!id || !user?.id) return;

    setLoading(true);
    try {
      const data = await getChatbotById(id, user.id);
      if (!data) {
        toast({
          title: "Fehler",
          description: "Chatbot nicht gefunden.",
          variant: "destructive",
        });
        navigate("/chatbots");
        return;
      }

      setChatbot(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        welcomeMessage: data.config?.welcomeMessage || "",
        customInstructions: data.config?.customInstructions || "",
        primaryColor: data.config?.colors?.primary || "#4facfe",
        backgroundColor: data.config?.colors?.background || "#ffffff",
        textColor: data.config?.colors?.text || "#000000",
        // Botpress
        botpressBotId: data.config?.botpressBotId || "",
        botpressComposerPlaceholder: data.config?.botpressEmbedConfig?.composerPlaceholder || "Schreibe eine Nachricht...",
        botpressBotName: data.config?.botpressEmbedConfig?.botName || "",
        botpressBotAvatar: data.config?.botpressEmbedConfig?.botAvatar || "",
      });
    } catch (error) {
      console.error("Error loading chatbot:", error);
      toast({
        title: "Fehler",
        description: "Chatbot konnte nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!chatbot || !user?.id) return;

    setIsSaving(true);
    try {
      // Update Chatbot in Supabase (ohne externe API)
      const input: Partial<ChatbotInput> = {
        name: formData.name,
        description: formData.description || undefined,
        config: {
          welcomeMessage: formData.welcomeMessage || undefined,
          customInstructions: formData.customInstructions || undefined,
          colors: {
            primary: formData.primaryColor,
            background: formData.backgroundColor,
            text: formData.textColor,
          },
          // Botpress
          botpressBotId: formData.botpressBotId || undefined,
          botpressEmbedConfig: formData.botpressBotId ? {
            composerPlaceholder: formData.botpressComposerPlaceholder || undefined,
            botName: formData.botpressBotName || undefined,
            botAvatar: formData.botpressBotAvatar || undefined,
          } : undefined,
        },
      };

      await updateChatbot(chatbot.id, user.id, input);
      
      toast({
        title: "Gespeichert",
        description: `${formData.name} wurde erfolgreich aktualisiert.`,
      });

      loadChatbot();
    } catch (error: any) {
      console.error("Error updating chatbot:", error);
      toast({
        title: "Fehler",
        description: error.message || "Chatbot konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!chatbot || !user?.id) return;

    try {
      await deleteChatbot(chatbot.id, user.id);
      toast({
        title: "Chatbot gelöscht",
        description: `${chatbot.name} wurde gelöscht.`,
      });
      navigate("/chatbots");
    } catch (error: any) {
      console.error("Error deleting chatbot:", error);
      toast({
        title: "Fehler",
        description: error.message || "Chatbot konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadScript = () => {
    if (!chatbot) return;

    // Generiere Mock Embed-Script (ohne externe API)
    const script = `<!-- Embed Script für ${chatbot.name} -->
<script>
  // Mock Embed Script
  console.log('Chatbot: ${chatbot.name}');
  console.log('Agent ID: ${chatbot.chatbase_agent_id}');
</script>`;

    const blob = new Blob([script], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chatbot.name.toLowerCase().replace(/\s+/g, "-")}-embed.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download gestartet",
      description: "Das Embed-Script wurde heruntergeladen.",
    });
  };

  const handleDownloadBotpressEmbed = () => {
    if (!chatbot || !chatbot.config?.botpressBotId) return;

    const botpressClientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID || "BOTPRESS_CLIENT_ID_HIER_EINFÜGEN";
    const embedConfig = chatbot.config.botpressEmbedConfig || {};
    
    const embedCode = `<!-- Botpress Webchat Embed für ${chatbot.name} -->
<div id="webchat-container"></div>
<script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
<script>
  window.botpress.init({
    botId: "${chatbot.config.botpressBotId}",
    clientId: "${botpressClientId}",
    configuration: ${JSON.stringify(embedConfig, null, 2)}
  });
</script>`;

    const blob = new Blob([embedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chatbot.name.toLowerCase().replace(/\s+/g, "-")}-botpress-embed.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download gestartet",
      description: "Die Botpress Embed-Datei wurde heruntergeladen.",
    });
  };

  const handleOpenBotpressStudio = () => {
    if (!chatbot?.config?.botpressBotId) return;
    // Botpress Studio URL: https://studio.botpress.cloud/bots/{botId}
    const studioUrl = `https://studio.botpress.cloud/bots/${chatbot.config.botpressBotId}`;
    window.open(studioUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Chatbot nicht gefunden</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/chatbots")}
            >
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock Embed URL (ohne externe API)
  const embedUrl = `data:text/html,<html><body style="padding: 40px; text-align: center; font-family: system-ui; background: ${formData.backgroundColor}; color: ${formData.textColor};"><h2>Chatbot Preview: ${chatbot.name}</h2><p>Agent ID: ${chatbot.chatbase_agent_id}</p><p style="margin-top: 20px; opacity: 0.7;">Preview-Funktion (Mock)</p></body></html>`;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chatbots")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{chatbot.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Chatbot bearbeiten und konfigurieren
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/chatbots/${chatbot.id}/preview`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadScript}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Script
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          {chatbot?.config?.botpressBotId && (
            <TabsTrigger value="botpress">Botpress</TabsTrigger>
          )}
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basis-Informationen */}
            <Card>
              <CardHeader>
                <CardTitle>Basis-Informationen</CardTitle>
                <CardDescription>
                  Name und Beschreibung des Chatbots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Support Bot"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kurze Beschreibung des Chatbots"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nachrichten & Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Nachrichten & Instructions</CardTitle>
                <CardDescription>
                  Welcome Message und Custom Instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Input
                    id="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    placeholder="z.B. Hallo! Wie kann ich Ihnen helfen?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customInstructions">Custom Instructions</Label>
                  <Textarea
                    id="customInstructions"
                    value={formData.customInstructions}
                    onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                    placeholder="Wie soll sich der Chatbot verhalten?"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Definieren Sie, wie sich der Chatbot verhalten soll.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Farben & Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Farben & Branding</CardTitle>
                <CardDescription>
                  Anpassen der Farben für das Chat-Widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primärfarbe</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#4facfe"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Hintergrundfarbe</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Textfarbe</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
                <CardDescription>
                  Agent Details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Agent ID</Label>
                  <code className="block text-sm bg-muted px-3 py-2 rounded break-all">
                    {chatbot.chatbase_agent_id}
                  </code>
                </div>
                <div className="space-y-2">
                  <Label>Erstellt am</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(chatbot.created_at).toLocaleString("de-DE")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Zuletzt aktualisiert</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(chatbot.updated_at).toLocaleString("de-DE")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/chatbots")}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              style={{ background: sectionGradient }}
              className="text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Vorschau des Chatbots mit aktuellen Einstellungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  title="Chatbot Preview"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Botpress Tab */}
        {chatbot?.config?.botpressBotId && (
          <TabsContent value="botpress">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Botpress Integration</CardTitle>
                  <CardDescription>
                    Verwalten Sie die Botpress-Integration für diesen Chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Botpress Bot ID</Label>
                    <code className="block text-sm bg-muted px-3 py-2 rounded break-all">
                      {chatbot.config.botpressBotId}
                    </code>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleOpenBotpressStudio}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      In Botpress öffnen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadBotpressEmbed}
                      className="flex-1"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Embed-Code generieren
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/chatbots/${chatbot.id}/preview`, "_blank")}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview öffnen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Botpress Konfiguration</CardTitle>
                  <CardDescription>
                    Anpassen der Botpress-Embed-Einstellungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="botpressBotId">
                      Botpress Bot ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="botpressBotId"
                      value={formData.botpressBotId}
                      onChange={(e) => setFormData({ ...formData, botpressBotId: e.target.value })}
                      placeholder="z.B. abc123-def456-ghi789"
                    />
                    <p className="text-xs text-muted-foreground">
                      Die Bot ID finden Sie im Botpress Studio unter &quot;Webchat&quot; → &quot;Erweiterte Einstellungen&quot;
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="botpressComposerPlaceholder">Composer Placeholder</Label>
                    <Input
                      id="botpressComposerPlaceholder"
                      value={formData.botpressComposerPlaceholder}
                      onChange={(e) => setFormData({ ...formData, botpressComposerPlaceholder: e.target.value })}
                      placeholder="Schreibe eine Nachricht..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="botpressBotName">Bot Name</Label>
                    <Input
                      id="botpressBotName"
                      value={formData.botpressBotName}
                      onChange={(e) => setFormData({ ...formData, botpressBotName: e.target.value })}
                      placeholder="z.B. Support Bot"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="botpressBotAvatar">Bot Avatar URL</Label>
                    <Input
                      id="botpressBotAvatar"
                      value={formData.botpressBotAvatar}
                      onChange={(e) => setFormData({ ...formData, botpressBotAvatar: e.target.value })}
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chatbot löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie wirklich "{chatbot.name}" löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

