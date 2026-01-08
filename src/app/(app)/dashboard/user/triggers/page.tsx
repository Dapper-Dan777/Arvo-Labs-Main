"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Timer } from "lucide-react";

export default function UserTriggersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Triggers
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Zeit- und Ereignis-basierte Trigger
        </p>
      </div>

      <PremiumFeatureCard
        title="Triggers"
        description="Die Triggers-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft zeit- und ereignis-basierte Trigger erstellen."
        icon={Timer}
        path="/dashboard/user/triggers"
        delay={0}
      />
    </div>
  );
}

