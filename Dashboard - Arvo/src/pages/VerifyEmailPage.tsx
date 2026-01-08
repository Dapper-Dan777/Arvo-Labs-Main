import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Zap } from "lucide-react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Kein Verifizierungs-Token gefunden. Bitte verwenden Sie den Link aus der E-Mail.");
      return;
    }

    const verify = async () => {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus("success");
        setMessage("Ihre E-Mail-Adresse wurde erfolgreich bestätigt!");
        
        toast({
          title: "E-Mail bestätigt",
          description: "Ihre E-Mail-Adresse wurde erfolgreich verifiziert.",
        });
        
        // Weiterleitung nach 3 Sekunden
        setTimeout(() => {
          if (isAuthenticated) {
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
        }, 3000);
      } else {
        setStatus("error");
        setMessage(result.error || "Die Verifizierung ist fehlgeschlagen. Der Link ist möglicherweise abgelaufen.");
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate, isAuthenticated, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Arvo Labs
          </h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              E-Mail-Verifizierung
            </CardTitle>
            <CardDescription className="text-center">
              Bitte warten Sie, während wir Ihre E-Mail-Adresse verifizieren...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              {status === "loading" && (
                <>
                  <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Verifizierung wird durchgeführt...
                  </p>
                </>
              )}
              
              {status === "success" && (
                <>
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                    Sie werden in Kürze weitergeleitet...
                  </p>
                </>
              )}
              
              {status === "error" && (
                <>
                  <XCircle className="h-12 w-12 text-red-500" />
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {message}
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    Zur Anmeldung
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


