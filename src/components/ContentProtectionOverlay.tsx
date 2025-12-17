import React from "react";
import { Lock } from "lucide-react";

export function ContentProtectionOverlay() {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none min-h-screen">
      {/* Blur-Layer über gesamte Seite */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10 pointer-events-auto"></div>
      
      {/* Zentrale Message-Card über dem Blur - fix in Mitte der gesamten Seite */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-8 md:p-12 max-w-lg text-center shadow-2xl mx-4 pointer-events-auto">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          Diese Seite ist noch nicht verfügbar
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground text-base mb-6">
          Die Inhalte zu Datenschutz, Impressum und AGB werden in Kürze veröffentlicht. Wir arbeiten daran.
        </p>
        
        {/* Optional: Verfügbarkeitsdatum */}
        <div className="text-sm text-muted-foreground/70">
          Verfügbar ab: Januar 2026
        </div>
      </div>
    </div>
  );
}

