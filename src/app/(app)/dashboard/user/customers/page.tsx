"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Building2 } from "lucide-react";

export default function UserCustomersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Kunden
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Kunden-Datenbank verwalten
        </p>
      </div>

      <PremiumFeatureCard
        title="Kunden-Management"
        description="Die Kunden-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre Kunden-Datenbank verwalten."
        icon={Building2}
        path="/dashboard/user/customers"
        delay={0}
      />
    </div>
  );
}

