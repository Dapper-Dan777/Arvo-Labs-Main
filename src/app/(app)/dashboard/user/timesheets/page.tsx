"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Clock } from "lucide-react";

export default function UserTimesheetsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Zeiterfassung
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Arbeitszeit verfolgen
        </p>
      </div>

      <PremiumFeatureCard
        title="Zeiterfassung"
        description="Die Zeiterfassung-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Arbeitszeit erfassen und verfolgen."
        icon={Clock}
        path="/dashboard/user/timesheets"
        delay={0}
      />
    </div>
  );
}

