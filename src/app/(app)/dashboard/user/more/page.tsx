"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { MoreHorizontal } from "lucide-react";

export default function UserMorePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Mehr
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Zusätzliche Features
        </p>
      </div>

      <PremiumFeatureCard
        title="Weitere Features"
        description="Weitere Features werden bald verfügbar sein."
        icon={MoreHorizontal}
        path="/dashboard/user/more"
        delay={0}
      />
    </div>
  );
}

