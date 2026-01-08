"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Zap } from "lucide-react";

export default function UserAutomationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Automations
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Automatisieren Sie wiederkehrende Aufgaben
        </p>
      </div>

      <PremiumFeatureCard
        title="Automations"
        description="Die Automations-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft wiederkehrende Aufgaben automatisieren."
        icon={Zap}
        path="/dashboard/user/automations"
        delay={0}
      />
    </div>
  );
}

