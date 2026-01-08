import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function DashboardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8" />
          Dashboards
        </h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine Dashboards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Dashboard-Verwaltung wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Dashboard-Management-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

