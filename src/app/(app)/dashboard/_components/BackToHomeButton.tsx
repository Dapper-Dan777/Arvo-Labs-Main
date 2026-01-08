"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BackToHomeButton - Prominenter Button zum Navigieren zur Startseite
 * 
 * Design: Passt exakt ans bestehende Website-Design an
 * - Verwendet opuxOutline Variant (wie andere Primary-Buttons)
 * - Home-Icon + Text "Startseite"
 * - Responsive: Nur Icon auf Mobile (< 768px)
 * - Position: Fixed oben rechts
 */
export function BackToHomeButton() {
  return (
    <Button
      variant="opuxOutline"
      size="sm"
      asChild
      className={cn(
        "fixed top-4 right-4 z-50",
        "md:px-4 md:gap-2",
        "shadow-lg hover:shadow-xl transition-all duration-200",
        "bg-card/95 backdrop-blur-sm border-border"
      )}
      aria-label="Zurück zur Startseite"
    >
      <Link href="/?stay=true">
        <Home className="w-4 h-4" />
        <span className="hidden md:inline">Startseite</span>
      </Link>
    </Button>
  );
}


