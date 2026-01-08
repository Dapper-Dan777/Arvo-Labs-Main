import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Target className="w-8 h-8" />
          Ziele
        </h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine Ziele und Meilensteine
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Ziel-Verwaltung wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Ziel-Management-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

