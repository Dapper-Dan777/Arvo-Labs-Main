"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { FileText } from "lucide-react";

export default function UserDocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Dokumente
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Dokumente verwalten und organisieren
        </p>
      </div>

      <PremiumFeatureCard
        title="Dokumente"
        description="Die Dokumente-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Dokumente verwalten und organisieren."
        icon={FileText}
        path="/dashboard/user/documents"
        delay={0}
      />
    </div>
  );
}

