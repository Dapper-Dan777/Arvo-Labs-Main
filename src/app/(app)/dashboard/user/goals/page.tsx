"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Target } from "lucide-react";

export default function UserGoalsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Ziele
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Ziele verfolgen und Meilensteine erreichen
        </p>
      </div>

      <PremiumFeatureCard
        title="Ziele-Management"
        description="Die Ziele-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Ziele setzen, verfolgen und Meilensteine erreichen."
        icon={Target}
        path="/dashboard/user/goals"
        delay={0}
      />
    </div>
  );
}

