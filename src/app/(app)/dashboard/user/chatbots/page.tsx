"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { MessageCircle } from "lucide-react";

export default function UserChatbotsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Chatbots
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          KI-Chatbots verwalten
        </p>
      </div>

      <PremiumFeatureCard
        title="Chatbots"
        description="Die Chatbots-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft KI-Chatbots erstellen und verwalten."
        icon={MessageCircle}
        path="/dashboard/user/chatbots"
        delay={0}
      />
    </div>
  );
}

