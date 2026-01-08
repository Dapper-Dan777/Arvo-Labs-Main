"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Mail } from "lucide-react";

export default function UserMailPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Mail
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          E-Mails senden und verwalten
        </p>
      </div>

      <PremiumFeatureCard
        title="Mail"
        description="Die Mail-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft E-Mails senden und verwalten."
        icon={Mail}
        path="/dashboard/user/mail"
        delay={0}
      />
    </div>
  );
}

