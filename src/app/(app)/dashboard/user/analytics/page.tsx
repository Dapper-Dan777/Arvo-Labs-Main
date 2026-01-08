"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { BarChart3 } from "lucide-react";

export default function UserAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Performance-Insights und Datenanalyse
        </p>
      </div>

      <PremiumFeatureCard
        title="Analytics Dashboard"
        description="Die Analytics-Funktion wird bald verfügbar sein. Hier sehen Sie in Zukunft detaillierte Performance-Insights und Datenanalysen."
        icon={BarChart3}
        path="/dashboard/user/analytics"
        delay={0}
      />
    </div>
  );
}

