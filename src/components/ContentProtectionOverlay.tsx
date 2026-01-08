"use client";

import React from "react";
import { Lock } from "lucide-react";

interface ContentProtectionOverlayProps {
  pageName?: string;
}

export function ContentProtectionOverlay({ pageName }: ContentProtectionOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Blur-Layer über gesamte Viewport - zeigt Inhalt verschwommen */}
      <div className="fixed inset-0 backdrop-blur-lg bg-background/20 pointer-events-auto"></div>
      
      {/* Zentrale Message-Card fixiert in der Mitte des Viewports */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-card border border-border rounded-2xl p-8 md:p-12 max-w-lg text-center shadow-2xl mx-4 pointer-events-auto">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          Diese Seite ist noch in Arbeit
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground text-base">
          {pageName ? (
            <>Die Inhalte der Seite "{pageName}" werden in Kürze veröffentlicht. Wir arbeiten daran.</>
          ) : (
            <>Die Inhalte dieser Seite werden in Kürze veröffentlicht. Wir arbeiten daran.</>
          )}
        </p>
      </div>
    </div>
  );
}

