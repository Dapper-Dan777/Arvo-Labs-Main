import React from "react";
import { cn } from "@/lib/utils";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
  monthlyLabel: string;
  yearlyLabel: string;
  discountLabel: string;
}

export function BillingToggle({
  isYearly,
  onToggle,
  monthlyLabel,
  yearlyLabel,
  discountLabel,
}: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-3 p-1 bg-secondary rounded-lg border border-border">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          !isYearly
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {monthlyLabel}
      </button>
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
          isYearly
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {yearlyLabel}
        <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
          {discountLabel}
        </span>
      </button>
    </div>
  );
}

