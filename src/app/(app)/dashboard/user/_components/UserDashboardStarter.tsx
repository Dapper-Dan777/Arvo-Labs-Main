"use client";

import React from 'react';
import { BarChart3, PenTool, Target, Clock, Bot, LayoutDashboard } from "lucide-react";
import { PremiumStatCard } from '@/components/dashboard/PremiumStatCard';
import { PremiumFeatureCard } from '@/components/dashboard/PremiumFeatureCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export function UserDashboardStarter() {
  const features = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance-Insights und Datenanalyse',
      icon: BarChart3,
      path: '/dashboard/user/analytics',
    },
    {
      id: 'whiteboards',
      title: 'Whiteboards',
      description: 'Kollaboratives Zeichenbrett',
      icon: PenTool,
      path: '/dashboard/user/whiteboards',
    },
    {
      id: 'goals',
      title: 'Ziele',
      description: 'Ziele verfolgen und Meilensteine erreichen',
      icon: Target,
      path: '/dashboard/user/goals',
    },
    {
      id: 'timesheets',
      title: 'Zeiterfassung',
      description: 'Arbeitszeit verfolgen',
      icon: Clock,
      path: '/dashboard/user/timesheets',
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Ihr KI-Helfer',
      icon: Bot,
      path: '/dashboard/user/ai-assistant',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Header Section - Design Showcase Style */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 blur-2xl rounded-3xl" />
            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 border border-[#6366f1]/20 backdrop-blur-xl">
              <LayoutDashboard className="w-7 h-7 text-[#6366f1]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-[-0.05em] leading-none mb-3">
              Dashboard
            </h1>
            <div className="h-[2px] w-24 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] rounded-full" />
          </div>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-[#64748b] dark:text-[#94a3b8] leading-relaxed max-w-3xl font-medium">
          Willkommen zurück! Starter Plan. Hier ist deine Übersicht über Projekte, Ziele und erfasste Stunden.
        </p>
      </div>

      {/* Quick Stats - Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PremiumStatCard
          title="Aktive Projekte"
          value={0}
          description="Noch keine Projekte"
          icon={BarChart3}
          delay={0}
        />
        <PremiumStatCard
          title="Erreichte Ziele"
          value={0}
          description="Noch keine Ziele gesetzt"
          icon={Target}
          delay={100}
        />
        <PremiumStatCard
          title="Erfasste Stunden"
          value="0h"
          description="Diese Woche"
          icon={Clock}
          delay={200}
        />
      </div>

      {/* Features Grid - Premium */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight mb-2">
            Verfügbare Features
          </h2>
          <p className="text-base text-[#64748b] dark:text-[#94a3b8] font-medium">
            Alle Features, die in deinem Starter Plan verfügbar sind
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <PremiumFeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              delay={index * 50}
            />
          ))}
        </div>
      </div>

      {/* Upgrade CTA - Premium */}
      <div className={cn(
        'relative overflow-hidden',
        'bg-white/70 dark:bg-[#0a0a0a]/70',
        'backdrop-blur-2xl',
        'border border-black/[0.03] dark:border-white/[0.03]',
        'rounded-2xl p-8',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-br before:from-[#6366f1]/10 before:via-[#8b5cf6]/5 before:to-[#ec4899]/10'
      )}>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-2 tracking-tight">
            Upgrade auf Pro oder Enterprise
          </h3>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6 font-medium">
            Erhalten Sie Zugang zu Automations, Integrations, Dokumenten und mehr mit einem Upgrade.
          </p>
          <Button asChild className="bg-gradient-to-br from-[#6366f1] to-[#ec4899] hover:from-[#6366f1]/90 hover:to-[#ec4899]/90 text-white shadow-lg shadow-[#6366f1]/30">
            <Link href="/preise">Jetzt upgraden</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
