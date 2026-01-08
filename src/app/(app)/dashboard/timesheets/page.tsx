import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function TimesheetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Clock className="w-8 h-8" />
          Zeiterfassung
        </h1>
        <p className="text-muted-foreground mt-2">
          Erfasse und verwalte deine Arbeitszeit
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Zeiterfassung wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Zeiterfassungs-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

