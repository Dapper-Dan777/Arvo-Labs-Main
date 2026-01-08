"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PenTool, Target, Clock, Bot, Zap, Plug, FileText, MessageCircle, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TeamDashboardPro() {
  const features = [
    {
      id: 'automations',
      title: 'Automations',
      description: 'Automatisieren Sie wiederkehrende Aufgaben',
      icon: Zap,
      path: '/dashboard/team/automations',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Verbinden Sie Ihre Tools',
      icon: Plug,
      path: '/dashboard/team/integrations',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance-Insights und Datenanalyse',
      icon: BarChart3,
      path: '/dashboard/team/analytics',
    },
    {
      id: 'documents',
      title: 'Dokumente',
      description: 'Dokumente verwalten und organisieren',
      icon: FileText,
      path: '/dashboard/team/documents',
    },
    {
      id: 'whiteboards',
      title: 'Whiteboards',
      description: 'Kollaboratives Zeichenbrett',
      icon: PenTool,
      path: '/dashboard/team/whiteboards',
    },
    {
      id: 'goals',
      title: 'Ziele',
      description: 'Ziele verfolgen und Meilensteine erreichen',
      icon: Target,
      path: '/dashboard/team/goals',
    },
    {
      id: 'timesheets',
      title: 'Zeiterfassung',
      description: 'Arbeitszeit verfolgen',
      icon: Clock,
      path: '/dashboard/team/timesheets',
    },
    {
      id: 'teams',
      title: 'Teams',
      description: 'Team-Management',
      icon: Users,
      path: '/dashboard/team/teams',
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Ihr KI-Helfer',
      icon: Bot,
      path: '/dashboard/team/ai-assistant',
    },
    {
      id: 'chatbots',
      title: 'Chatbots',
      description: 'KI-Chatbots verwalten',
      icon: MessageCircle,
      path: '/dashboard/team/chatbots',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 w-full" style={{ backgroundColor: 'transparent' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Willkommen zurück! Team Pro Plan
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Noch keine Automations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verbindungen</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Noch keine Integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team-Mitglieder</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Aktuell im Team</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0%</div>
            <p className="text-xs text-muted-foreground">Diese Woche</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
          Verfügbare Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.id} href={feature.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upgrade CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Upgrade auf Team Enterprise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Erhalten Sie Zugang zu Workflows, Triggers, Posteingang, Formularen, Kunden-Management und mehr.
          </p>
          <Button asChild>
            <Link href="/preise">Jetzt upgraden</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

