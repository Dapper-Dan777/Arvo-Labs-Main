"use client";

import { ImplementationStatus } from "@/components/automations/ImplementationStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Database, Zap, Mail, MessageSquare, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ImplementationPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Implementierungs-Status</h1>
        <p className="text-sm text-muted-foreground">
          Übersicht der implementierten Features des Automation Tools (Zapier-Klon)
        </p>
      </div>

      <ImplementationStatus />

      {/* Setup-Anleitung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Setup-Anleitung
          </CardTitle>
          <CardDescription>
            Schritte zum Einrichten des Automation Tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Database Schema ausführen</h4>
                <p className="text-sm text-muted-foreground">
                  Öffne Supabase SQL Editor und führe die Migration aus:
                </p>
                <code className="block mt-2 text-xs bg-muted p-2 rounded">
                  supabase/migrations/001_automation_schema.sql
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Dependencies installieren</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Installiere fehlende Packages:
                </p>
                <code className="block text-xs bg-muted p-2 rounded">
                  npm install resend
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Environment Variables setzen</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Füge diese Variablen zu <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> oder Vercel hinzu:
                </p>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`STRIPE_SECRET_KEY=sk_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@arvo-labs.de
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...`}
                </pre>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Template erstellen</h4>
                <p className="text-sm text-muted-foreground">
                  Erstelle das Customer Onboarding Template via API oder UI:
                </p>
                <code className="block mt-2 text-xs bg-muted p-2 rounded">
                  POST /api/automation/templates/customer-onboarding
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Dokumentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            Verfügbare API Endpoints für Workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">GET</Badge>
                <code className="text-sm">/api/automation/workflows</code>
              </div>
              <p className="text-sm text-muted-foreground ml-16">
                Liste aller Workflows für den aktuellen User
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">POST</Badge>
                <code className="text-sm">/api/automation/workflows</code>
              </div>
              <p className="text-sm text-muted-foreground ml-16">
                Erstellt einen neuen Workflow
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">POST</Badge>
                <code className="text-sm">/api/automation/workflows/[id]/execute</code>
              </div>
              <p className="text-sm text-muted-foreground ml-16">
                Führt einen Workflow manuell aus
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">POST</Badge>
                <code className="text-sm">/api/automation/workflows/[id]/webhook</code>
              </div>
              <p className="text-sm text-muted-foreground ml-16">
                Webhook-Endpoint zum Triggern eines Workflows
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">GET</Badge>
                <code className="text-sm">/api/automation/executions</code>
              </div>
              <p className="text-sm text-muted-foreground ml-16">
                Execution History abrufen
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Adapters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Verfügbare Integration Adapters
          </CardTitle>
          <CardDescription>
            Implementierte Integrationen für Workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Stripe</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer, Subscription, Invoice Operations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Email (Resend)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Send Email, Template Emails
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Slack</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Webhooks, Channel Messages, DMs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Database</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Onboarding Logs CRUD Operations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg md:col-span-2">
              <FileText className="h-5 w-5 text-pink-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Formatter</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Text, Number, Date Formatting | Split, Find/Replace, Extract
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dokumentation Links */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/team/automations/monitoring">
            ← Zurück zu Monitoring
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/team/automations">
            → Zum Editor
          </Link>
        </Button>
      </div>
    </div>
  );
}

