"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function UserSettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full" style={{ backgroundColor: 'transparent' }}>
      <div>
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          Einstellungen
        </h1>
        <p className="text-sm text-muted-foreground">
          Account-Präferenzen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Einstellungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Die Einstellungen-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Account-Präferenzen verwalten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

