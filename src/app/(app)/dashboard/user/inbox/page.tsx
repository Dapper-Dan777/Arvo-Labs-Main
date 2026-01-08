"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Inbox } from "lucide-react";

export default function UserInboxPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Posteingang
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          E-Mails verwalten
        </p>
      </div>

      <PremiumFeatureCard
        title="Posteingang"
        description="Die Posteingang-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft Ihre E-Mails verwalten."
        icon={Inbox}
        path="/dashboard/user/inbox"
        delay={0}
      />
    </div>
  );
}

