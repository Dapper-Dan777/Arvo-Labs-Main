import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Inbox className="w-8 h-8" />
          Posteingang
        </h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine Nachrichten und Benachrichtigungen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Der Posteingang wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen Posteingang-System für deine Nachrichten und Benachrichtigungen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

