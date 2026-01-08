import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="w-8 h-8" />
          Teams
        </h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine Teams und Mitglieder
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Team-Verwaltung wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Team-Management-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

