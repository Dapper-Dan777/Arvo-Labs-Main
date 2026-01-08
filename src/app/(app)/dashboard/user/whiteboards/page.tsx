"use client";

import { PremiumFeatureCard } from "@/components/dashboard/PremiumFeatureCard";
import { PenTool } from "lucide-react";

export default function UserWhiteboardsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
          Whiteboards
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
          Kollaboratives Zeichenbrett
        </p>
      </div>

      <PremiumFeatureCard
        title="Whiteboard"
        description="Die Whiteboard-Funktion wird bald verfügbar sein. Hier können Sie in Zukunft kollaborativ zeichnen und Ideen visualisieren."
        icon={PenTool}
        path="/dashboard/user/whiteboards"
        delay={0}
      />
    </div>
  );
}

