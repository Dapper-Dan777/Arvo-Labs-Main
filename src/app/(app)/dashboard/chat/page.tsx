import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageCircle className="w-8 h-8" />
          Chat
        </h1>
        <p className="text-muted-foreground mt-2">
          Kommuniziere mit deinem Team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Der Chat wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Chat-System für deine Team-Kommunikation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

