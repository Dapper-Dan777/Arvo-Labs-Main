"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, FileText, Code, Database, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusItem {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'in_progress';
  description?: string;
  file?: string;
}

const implementationStatus: StatusItem[] = [
  {
    id: 'database',
    label: 'Database Schema',
    status: 'completed',
    description: 'Supabase PostgreSQL Schema mit RLS Policies',
    file: 'supabase/migrations/001_automation_schema.sql',
  },
  {
    id: 'types',
    label: 'TypeScript Types',
    status: 'completed',
    description: 'Core Types für Workflows, Executions, Nodes',
    file: 'src/lib/automation/types.ts',
  },
  {
    id: 'engine',
    label: 'Workflow Execution Engine',
    status: 'completed',
    description: 'Workflow Executor mit Topological Sort und Placeholder Resolution',
    file: 'src/lib/automation/engine.ts',
  },
  {
    id: 'adapters',
    label: 'Integration Adapters',
    status: 'completed',
    description: 'Stripe, Email (Resend), Slack, Database, Formatter',
    file: 'src/lib/automation/adapters/',
  },
  {
    id: 'api',
    label: 'API Routes',
    status: 'completed',
    description: 'Workflows CRUD, Execution, Webhooks, Templates',
    file: 'src/app/api/automation/',
  },
  {
    id: 'template',
    label: 'Customer Onboarding Template',
    status: 'completed',
    description: 'Kompletter Workflow mit 10 Steps',
    file: 'src/lib/automation/templates/customer-onboarding.ts',
  },
  {
    id: 'inngest',
    label: 'Inngest Queue Integration',
    status: 'pending',
    description: 'Optional - für async Workflow Execution',
  },
  {
    id: 'frontend',
    label: 'Frontend Builder Integration',
    status: 'in_progress',
    description: 'UI bereits vorhanden, Backend-Integration fehlt',
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    label: 'Abgeschlossen',
  },
  in_progress: {
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'In Arbeit',
  },
  pending: {
    icon: XCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    label: 'Ausstehend',
  },
};

export function ImplementationStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Implementierungs-Status</h2>
        <p className="text-sm text-muted-foreground">
          Übersicht der implementierten Features des Automation Tools
        </p>
      </div>

      <div className="grid gap-4">
        {implementationStatus.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <Card key={item.id} className={cn("border-2", config.border)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.label}</CardTitle>
                      {item.description && (
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      )}
                      {item.file && (
                        <div className="mt-2 flex items-center gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {item.file}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(config.border, config.color)}>
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Schema
              </h4>
              <p className="text-sm text-muted-foreground">
                Führe die SQL-Migration in Supabase aus: <code className="text-xs bg-muted px-1 py-0.5 rounded">supabase/migrations/001_automation_schema.sql</code>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                API Endpoints
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/automation/workflows</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/automation/workflows/[id]/execute</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/automation/workflows/[id]/webhook</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

