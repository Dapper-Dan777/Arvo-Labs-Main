"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PenTool, Target, Clock, Bot, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TeamDashboardStarter() {
  const features = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance-Insights und Datenanalyse',
      icon: BarChart3,
      path: '/dashboard/team/analytics',
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
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 w-full" style={{ backgroundColor: 'transparent' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Willkommen zurück! Team Starter Plan
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <CardTitle className="text-sm font-medium">Erreichte Ziele</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Noch keine Ziele gesetzt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team-Stunden</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
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
          <CardTitle>Upgrade auf Team Pro oder Enterprise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Erhalten Sie Zugang zu Automations, Integrations, Dokumenten und mehr mit einem Upgrade.
          </p>
          <Button asChild>
            <Link href="/preise">Jetzt upgraden</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

