import { X, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEncryptedObject, setEncryptedObject } from "@/lib/crypto";

interface WelcomeBannerProps {
  onDismiss?: () => void;
}

const tips = [
  "💡 Tipp: Verwenden Sie den Zeitraum-Filter, um verschiedene Zeiträume zu analysieren",
  "🚀 Tipp: Personalisieren Sie Ihr Dashboard im Bearbeitungsmodus",
  "⚡ Tipp: Aktivieren Sie Live-Updates für Echtzeit-Daten",
  "📊 Tipp: Exportieren Sie Daten für detaillierte Analysen",
];

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Prüfe ob Banner bereits ausgeblendet wurde
    try {
      const bannerState = getEncryptedObject<{ dismissed: boolean }>("welcome_banner_dismissed");
      if (bannerState?.dismissed) {
        setShowBanner(false);
      }
    } catch (error) {
      // Ignore
    }
  }, []);

  // Rotiere Tipps alle 5 Sekunden
  useEffect(() => {
    if (!showBanner || dismissed) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showBanner, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    try {
      setEncryptedObject("welcome_banner_dismissed", { dismissed: true });
    } catch (error) {
      console.error("Error saving banner state:", error);
    }
    onDismiss?.();
  };

  if (!showBanner || dismissed) return null;

  const userName = user?.name?.split(" ")[0] || user?.username || "Nutzer";
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
      <div className="relative p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                  {timeOfDay()}, {userName}! 👋
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Willkommen zurück in Ihrem Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Lightbulb className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground animate-fade-in">
                {tips[currentTip]}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleDismiss}
            aria-label="Banner ausblenden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

