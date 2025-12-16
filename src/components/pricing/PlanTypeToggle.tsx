import React from "react";
import { cn } from "@/lib/utils";

interface PlanTypeToggleProps {
  planType: "user" | "team";
  onToggle: (type: "user" | "team") => void;
  userLabel: string;
  teamLabel: string;
}

export function PlanTypeToggle({
  planType,
  onToggle,
  userLabel,
  teamLabel,
}: PlanTypeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border p-1 bg-secondary">
      <button
        onClick={() => onToggle("user")}
        className={cn(
          "px-6 py-2 rounded-md text-sm font-medium transition-all",
          planType === "user"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {userLabel}
      </button>
      <button
        onClick={() => onToggle("team")}
        className={cn(
          "px-6 py-2 rounded-md text-sm font-medium transition-all",
          planType === "team"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {teamLabel}
      </button>
    </div>
  );
}


