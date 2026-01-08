"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { Bot } from "lucide-react";

export default function UserAIAssistantPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          AI Assistant
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Ihr KI-Helfer
        </p>
      </div>

      <PremiumFeatureCard
        title="AI Assistant"
        description="Die AI Assistant-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft mit einem KI-Assistenten interagieren."
        icon={Bot}
        path="/dashboard/user/ai-assistant"
        delay={0}
      />
    </div>
  );
}

