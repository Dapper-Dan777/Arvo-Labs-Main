import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function FormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          Formulare
        </h1>
        <p className="text-muted-foreground mt-2">
          Erstelle und verwalte Formulare
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Formular-Funktion wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Formular-Builder-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

