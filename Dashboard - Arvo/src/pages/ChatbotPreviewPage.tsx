import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getChatbotById } from "@/lib/chatbots";
import { Skeleton } from "@/components/ui/skeleton";

// Botpress Webchat Script URL
const BOTPRESS_WEBCHAT_SCRIPT = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";

declare global {
  interface Window {
    botpress?: {
      init: (config: {
        botId: string;
        clientId: string;
        configuration?: any;
        containerId?: string;
      }) => void;
    };
  }
}

export default function ChatbotPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webchatContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (id && user?.id) {
      loadChatbot();
    }
  }, [id, user?.id]);

  const loadChatbot = async () => {
    if (!id || !user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const chatbot = await getChatbotById(id, user.id);
      if (!chatbot) {
        navigate("/chatbots");
        return;
      }

      // Prüfe ob Botpress Bot ID vorhanden ist
      if (chatbot.config?.botpressBotId) {
        initializeBotpressWebchat(chatbot.config.botpressBotId, chatbot.config.botpressEmbedConfig || {});
      } else {
        // Fallback: Mock Preview (ohne Botpress)
        setError("Keine Botpress Bot ID konfiguriert");
      }
    } catch (error) {
      console.error("Error loading chatbot:", error);
      setError("Fehler beim Laden des Chatbots");
    } finally {
      setLoading(false);
    }
  };

  const initializeBotpressWebchat = (botId: string, embedConfig: any) => {
    if (!webchatContainerRef.current) return;

    // Botpress Client ID aus Environment Variable
    const clientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID || "";
    
    if (!clientId) {
      setError("VITE_BOTPRESS_CLIENT_ID ist nicht gesetzt. Bitte konfigurieren Sie die Client ID in der .env Datei.");
      return;
    }

    // Lade Botpress Script falls noch nicht geladen
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = BOTPRESS_WEBCHAT_SCRIPT;
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initBotpress(botId, clientId, embedConfig);
      };
      script.onerror = () => {
        setError("Fehler beim Laden des Botpress Webchat Scripts");
      };
      document.body.appendChild(script);
    } else {
      // Script bereits geladen, direkt initialisieren
      initBotpress(botId, clientId, embedConfig);
    }
  };

  const initBotpress = (botId: string, clientId: string, embedConfig: any) => {
    if (!window.botpress) {
      setError("Botpress Webchat Script konnte nicht geladen werden");
      return;
    }

    try {
      window.botpress.init({
        botId: botId,
        clientId: clientId,
        configuration: embedConfig,
        containerId: "webchat-container",
      });
    } catch (error) {
      console.error("Error initializing Botpress:", error);
      setError("Fehler beim Initialisieren des Botpress Webchats");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 flex items-center gap-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/chatbots/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Chatbot Preview</h2>
          <p className="text-sm text-muted-foreground">
            Vollbild-Vorschau des Botpress Chatbots
          </p>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-hidden relative">
        {error ? (
          <Card className="h-full m-4">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => navigate(`/chatbots/${id}`)}>
                Zurück zur Bearbeitung
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            id="webchat-container"
            ref={webchatContainerRef}
            className="w-full h-full"
            style={{ minHeight: "600px" }}
          />
        )}
      </div>
    </div>
  );
}
