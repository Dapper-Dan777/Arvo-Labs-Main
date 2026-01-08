import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function MailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Mail className="w-8 h-8" />
          Mail
        </h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine E-Mails
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Die Mail-Funktion wird in Kürze verfügbar sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Wir arbeiten an einem vollständigen E-Mail-Management-System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

