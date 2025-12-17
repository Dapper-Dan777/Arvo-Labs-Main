import React from "react";
import { Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Video Hero */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-16">
          <video
            src="/video/about-hero.mp4"
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            Dein Browser unterstützt das Video-Element nicht.
          </video>
        </div>

        {/* Hero Card: Dein Automatisierungs-Co-Pilot */}
        <div className="max-w-[900px] mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-transparent border border-[#262626] rounded-xl p-6 md:p-10 text-center hover:border-primary/30 transition-colors duration-200">
            {/* Optional Icon */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            
            {/* Headline */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Dein Automatisierungs‑Co‑Pilot für den Alltag
            </h1>

            {/* Subline */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[700px] mx-auto">
              Arvo Labs bündelt deine Postfächer, Tools und Abläufe in einem klaren Dashboard. Statt zehn Logins und vergessenen Abos hast du einen Ort, an dem alles zusammenläuft – für Betriebe und Einzelpersonen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
