"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Activity,
  BarChart3,
} from 'lucide-react';
import { PremiumStatCard } from '@/components/dashboard/PremiumStatCard';

export default function DesignShowcasePage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => [
    {
      title: 'Erledigte Tasks',
      value: 47,
      description: 'Diese Woche',
      icon: CheckCircle2,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Ausstehend',
      value: 8,
      description: 'Heute fällig',
      icon: Clock,
    },
    {
      title: 'Team-Aktivität',
      value: '87%',
      description: 'Engagement-Rate',
      icon: Activity,
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Zeitbuchungen',
      value: 124,
      description: 'Gesamt erfasst',
      icon: BarChart3,
    },
  ], []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 blur-2xl rounded-3xl" />
            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 border border-[#6366f1]/20 backdrop-blur-xl">
              <Sparkles className="w-7 h-7 text-[#6366f1]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-[-0.05em] leading-none mb-3">
              Design Showcase
            </h1>
            <div className="h-[2px] w-24 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] rounded-full" />
          </div>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-[#64748b] dark:text-[#94a3b8] leading-relaxed max-w-3xl font-medium">
          Ein Design-System auf dem Niveau der besten Produkte der Welt. 
          Inspiriert von Linear, Vercel und Arc. Jeder Pixel ist durchdacht, 
          jede Animation ist perfekt.
        </p>
      </div>

      {/* Stats Grid - FIXED LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <PremiumStatCard
            key={stat.title}
            {...stat}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}
