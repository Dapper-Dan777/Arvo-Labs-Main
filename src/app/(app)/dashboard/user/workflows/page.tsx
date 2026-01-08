"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Workflow } from "lucide-react";

export default function UserWorkflowsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Workflows
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Automatisieren Sie komplexe Prozesse
        </p>
      </div>

      <PremiumFeatureCard
        title="Workflows"
        description="Die Workflows-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft komplexe Prozesse automatisieren."
        icon={Workflow}
        path="/dashboard/user/workflows"
        delay={0}
      />
    </div>
  );
}

