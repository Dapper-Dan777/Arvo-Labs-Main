/**
 * OAuth Callback Page
 * 
 * Diese Seite wird von Google nach erfolgreicher OAuth-Authentifizierung aufgerufen.
 * Sie tauscht den Authorization Code gegen Access/Refresh Tokens.
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForTokens, saveGmailTokens } from "@/lib/gmail/oauth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      // Prüfe auf OAuth Fehler
      if (error) {
        setStatus("error");
        setErrorMessage(
          error === "access_denied"
            ? "Zugriff wurde verweigert. Bitte erlauben Sie den Zugriff auf Ihr Gmail-Konto."
            : `OAuth Fehler: ${error}`
        );
        return;
      }

      // Prüfe auf Code
      if (!code || !state) {
        setStatus("error");
        setErrorMessage("Ungültiger OAuth Callback. Code oder State fehlt.");
        return;
      }

      try {
        // Tausche Code gegen Tokens
        const tokens = await exchangeCodeForTokens(code, state);

        // Speichere Tokens in Supabase
        await saveGmailTokens(tokens);

        setStatus("success");

        // Redirect nach 2 Sekunden zur Integrations Page
        setTimeout(() => {
          navigate("/integrations", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unbekannter Fehler beim Verbinden mit Gmail"
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Gmail Verbindung</CardTitle>
          <CardDescription>Verbindet Ihr Gmail-Konto...</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verbindung wird hergestellt...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Gmail wurde erfolgreich verbunden!
              </p>
              <p className="text-xs text-muted-foreground">
                Sie werden zur Integrations-Seite weitergeleitet...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <XCircle className="h-8 w-8 text-destructive" />
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <button
                onClick={() => navigate("/integrations", { replace: true })}
                className="text-sm text-primary hover:underline"
              >
                Zurück zu Integrations
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

