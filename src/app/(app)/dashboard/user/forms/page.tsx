"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { ClipboardList } from "lucide-react";

export default function UserFormsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Formulare
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Formulare erstellen und verwalten
        </p>
      </div>

      <PremiumFeatureCard
        title="Formulare"
        description="Die Formulare-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Formulare erstellen und verwalten."
        icon={ClipboardList}
        path="/dashboard/user/forms"
        delay={0}
      />
    </div>
  );
}

