import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool } from "lucide-react";

export default function WhiteboardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <PenTool className="w-8 h-8" />
          Whiteboards
        </h1>
        <p className="text-muted-foreground mt-2">
          Erstelle und teile Whiteboards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Whiteboard-Funktion wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Whiteboard-System für kollaborative Arbeit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

