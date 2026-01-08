/**
 * Gmail Integration Card Component
 * 
 * Zeigt Gmail Integration Status und Connect/Disconnect Button
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  LogOut,
} from "lucide-react";
import {
  startGmailOAuth,
  isGmailConnected,
  disconnectGmail,
  getGmailIntegration,
} from "@/lib/gmail/oauth";
import { IntegrationIcon } from "./IntegrationIcons";

export function GmailIntegrationCard() {
  console.log('🟢🟢🟢 GmailIntegrationCard wird gerendert');
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Prüfe Connection Status
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await isGmailConnected();
      setIsConnected(connected);

      if (connected) {
        const integration = await getGmailIntegration();
        if (integration?.updated_at) {
          const date = new Date(integration.updated_at);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 1) {
            setLastSync("Gerade eben");
          } else if (diffMins < 60) {
            setLastSync(`vor ${diffMins} Min`);
          } else {
            const diffHours = Math.floor(diffMins / 60);
            setLastSync(`vor ${diffHours} Std`);
          }
        }
      }
    } catch (error) {
      console.error("Error checking Gmail connection:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    console.log('🔵🔵🔵 GmailIntegrationCard: handleConnect wurde aufgerufen');
    console.log('🔵 Environment Check:', {
      VITE_GMAIL_CLIENT_ID: import.meta.env.VITE_GMAIL_CLIENT_ID,
      VITE_GMAIL_REDIRECT_URI: import.meta.env.VITE_GMAIL_REDIRECT_URI,
    });
    setIsConnecting(true);
    try {
      console.log('🔵 GmailIntegrationCard: startGmailOAuth wird aufgerufen...');
      await startGmailOAuth();
      // startGmailOAuth redirects, so we won't reach here
    } catch (error) {
      console.error("❌ GmailIntegrationCard: Error starting OAuth:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Fehler beim Starten der Gmail-Verbindung",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectGmail();
      setIsConnected(false);
      setLastSync(null);
      toast({
        title: "Gmail getrennt",
        description: "Ihr Gmail-Konto wurde erfolgreich getrennt.",
      });
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Fehler beim Trennen der Gmail-Verbindung",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IntegrationIcon name="gmail" className="h-5 w-5" />
            Gmail
          </CardTitle>
          <CardDescription>Lädt...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IntegrationIcon name="gmail" className="h-5 w-5" />
            <CardTitle>Gmail</CardTitle>
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Verbunden
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Nicht verbunden
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          Senden und empfangen Sie E-Mails über Gmail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && lastSync && (
          <div className="text-sm text-muted-foreground">
            Letzte Synchronisation: {lastSync}
          </div>
        )}

        {isConnected ? (
          <div className="space-y-2">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Ihr Gmail-Konto ist verbunden. Sie können jetzt E-Mails senden
                und empfangen.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={checkConnection}
                disabled={isDisconnecting}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Status prüfen
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="flex-1"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Trennen...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Trennen
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Alert>
              <AlertDescription>
                Verbinden Sie Ihr Gmail-Konto, um E-Mails zu senden und zu
                empfangen.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verbinden...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Gmail verbinden
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

