"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Plug } from "lucide-react";

export default function UserIntegrationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Integrations
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Verbinden Sie Ihre Tools
        </p>
      </div>

      <PremiumFeatureCard
        title="Integrations"
        description="Die Integrations-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Tools verbinden."
        icon={Plug}
        path="/dashboard/user/integrations"
        delay={0}
      />
    </div>
  );
}

