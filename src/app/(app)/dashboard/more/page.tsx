import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MoreHorizontal className="w-8 h-8" />
          Mehr
        </h1>
        <p className="text-muted-foreground mt-2">
          Weitere Funktionen und Einstellungen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Weitere Funktionen werden in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten kontinuierlich an neuen Features und Funktionen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

