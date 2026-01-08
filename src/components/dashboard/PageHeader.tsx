"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 blur-2xl rounded-3xl" />
          <div className="relative p-4 rounded-3xl bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 border border-[#6366f1]/20 backdrop-blur-xl">
            <Icon className="w-7 h-7 text-[#6366f1]" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-[-0.05em] leading-none mb-3">
            {title}
          </h1>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] rounded-full" />
        </div>
      </div>
      <p className="text-base md:text-lg lg:text-xl text-[#64748b] dark:text-[#94a3b8] leading-relaxed max-w-3xl font-medium">
        {description}
      </p>
    </div>
  );
}
