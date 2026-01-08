"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { applyBackgroundDesign } from "@/lib/applyBackgroundDesign";

type BackgroundStyle = 
  | "neon-grid" 
  | "holographic" 
  | "cyber-mesh" 
  | "liquid-gradient" 
  | "particle-field" 
  | "neural-network"
  | "aurora-borealis"
  | "matrix-rain"
  | "circuit-board"
  | "starry-night"
  | "geometric-waves"
  | "prism-light"
  | "hexagon-pattern"
  | "flowing-lines"
  | "digital-rain"
  | "cosmic-dust"
  | "minimal-dots"
  | "subtle-lines"
  | "soft-gradient"
  | "paper-texture"
  | "gentle-waves"
  | "clean-grid"
  | "soft-blur"
  | "minimal-mesh"
  | "geometric-shapes"
  | "wave-pattern"
  | "dot-matrix"
  | "radial-gradient"
  | "diagonal-lines"
  | "organic-blobs"
  | "tech-circuit"
  | "watercolor"
  | "noise-texture"
  | "luminous-gradient";

type ColorScheme = 
  | "electric-blue" 
  | "neon-purple" 
  | "cyber-green" 
  | "sunset-orange" 
  | "ocean-teal" 
  | "cosmic-pink"
  | "professional-navy"
  | "elegant-gray"
  | "warm-beige"
  | "forest-green"
  | "royal-blue"
  | "charcoal-smoke"
  | "sage-mint"
  | "amber-gold"
  | "crimson-red"
  | "lavender-dream"
  | "emerald-jade"
  | "midnight-indigo"
  | "coral-reef"
  | "slate-stone"
  | "rose-gold"
  | "turquoise-cyan"
  | "violet-purple"
  | "copper-bronze"
  | "mint-fresh"
  | "deep-ocean"
  | "sunset-glow";

interface BackgroundOption {
  id: BackgroundStyle;
  name: string;
  description: string;
  className: string;
}

interface ColorModule {
  id: ColorScheme;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const colorModules: ColorModule[] = [
  {
    id: "electric-blue",
    name: "Electric Blue",
    primary: "#4facfe",
    secondary: "#00f2fe",
    accent: "#a855f7",
  },
  {
    id: "neon-purple",
    name: "Neon Purple",
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#f472b6",
  },
  {
    id: "cyber-green",
    name: "Cyber Green",
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#22c55e",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#f59e0b",
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    primary: "#14b8a6",
    secondary: "#2dd4bf",
    accent: "#06b6d4",
  },
  {
    id: "cosmic-pink",
    name: "Cosmic Pink",
    primary: "#ec4899",
    secondary: "#f472b6",
    accent: "#fbbf24",
  },
  {
    id: "professional-navy",
    name: "Professional Navy",
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    accent: "#60a5fa",
  },
  {
    id: "elegant-gray",
    name: "Elegant Gray",
    primary: "#4b5563",
    secondary: "#6b7280",
    accent: "#9ca3af",
  },
  {
    id: "warm-beige",
    name: "Warm Beige",
    primary: "#d4a574",
    secondary: "#e5c9a1",
    accent: "#f5e6d3",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    primary: "#166534",
    secondary: "#22c55e",
    accent: "#4ade80",
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    primary: "#1e40af",
    secondary: "#2563eb",
    accent: "#3b82f6",
  },
  {
    id: "charcoal-smoke",
    name: "Charcoal Smoke",
    primary: "#374151",
    secondary: "#4b5563",
    accent: "#6b7280",
  },
  {
    id: "sage-mint",
    name: "Sage Mint",
    primary: "#6b9080",
    secondary: "#a8c5a0",
    accent: "#c8e6c9",
  },
  {
    id: "amber-gold",
    name: "Amber Gold",
    primary: "#b45309",
    secondary: "#d97706",
    accent: "#f59e0b",
  },
  {
    id: "crimson-red",
    name: "Crimson Red",
    primary: "#dc2626",
    secondary: "#ef4444",
    accent: "#f87171",
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    primary: "#a78bfa",
    secondary: "#c4b5fd",
    accent: "#e9d5ff",
  },
  {
    id: "emerald-jade",
    name: "Emerald Jade",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#34d399",
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo",
    primary: "#4338ca",
    secondary: "#6366f1",
    accent: "#818cf8",
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    primary: "#f87171",
    secondary: "#fb7185",
    accent: "#fda4af",
  },
  {
    id: "slate-stone",
    name: "Slate Stone",
    primary: "#475569",
    secondary: "#64748b",
    accent: "#94a3b8",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    primary: "#e11d48",
    secondary: "#f43f5e",
    accent: "#fb7185",
  },
  {
    id: "turquoise-cyan",
    name: "Turquoise Cyan",
    primary: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
  },
  {
    id: "violet-purple",
    name: "Violet Purple",
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    accent: "#a78bfa",
  },
  {
    id: "copper-bronze",
    name: "Copper Bronze",
    primary: "#b45309",
    secondary: "#d97706",
    accent: "#f59e0b",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#6ee7b7",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    primary: "#0c4a6e",
    secondary: "#075985",
    accent: "#0284c7",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#fdba74",
  },
];

const backgroundOptions: BackgroundOption[] = [
  {
    id: "neon-grid",
    name: "Neon Grid",
    description: "Elektrisches Grid mit Neon-Akzenten - futuristisch und modern",
    className: "neon-grid-background",
  },
  {
    id: "holographic",
    name: "Holographic",
    description: "Holografischer Effekt mit irisierenden Farben - premium Look",
    className: "holographic-background",
  },
  {
    id: "cyber-mesh",
    name: "Cyber Mesh",
    description: "Vernetztes Mesh-Design mit Cyber-Ästhetik - technisch und modern",
    className: "cyber-mesh-background",
  },
  {
    id: "liquid-gradient",
    name: "Liquid Gradient",
    description: "Fließende, organische Gradienten - weich und dynamisch",
    className: "liquid-gradient-background",
  },
  {
    id: "particle-field",
    name: "Particle Field",
    description: "Schwebende Partikel im Raum - minimalistisch und elegant",
    className: "particle-field-background",
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description: "Neuronales Netzwerk-Design - KI-inspiriert und intelligent",
    className: "neural-network-background",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    description: "Nordlicht-Effekt mit sanften Wellen - natürlich und beruhigend",
    className: "aurora-borealis-background",
  },
  {
    id: "matrix-rain",
    name: "Matrix Rain",
    description: "Klassischer Matrix-Effekt - retro-futuristisch und ikonisch",
    className: "matrix-rain-background",
  },
  {
    id: "circuit-board",
    name: "Circuit Board",
    description: "Elektronisches Schaltkreis-Design - technisch und präzise",
    className: "circuit-board-background",
  },
  {
    id: "starry-night",
    name: "Starry Night",
    description: "Sternenhimmel-Effekt - ruhig und elegant, funktioniert in beiden Modi",
    className: "starry-night-background",
  },
  {
    id: "geometric-waves",
    name: "Geometric Waves",
    description: "Geometrische Wellen-Muster - modern und dynamisch",
    className: "geometric-waves-background",
  },
  {
    id: "prism-light",
    name: "Prism Light",
    description: "Prismen-Licht-Effekt - bunt und lebendig, ideal für Light Mode",
    className: "prism-light-background",
  },
  {
    id: "hexagon-pattern",
    name: "Hexagon Pattern",
    description: "Sechseck-Muster - strukturell und modern, universell einsetzbar",
    className: "hexagon-pattern-background",
  },
  {
    id: "flowing-lines",
    name: "Flowing Lines",
    description: "Fließende Linien - organisch und elegant, perfekt für beide Modi",
    className: "flowing-lines-background",
  },
  {
    id: "digital-rain",
    name: "Digital Rain",
    description: "Digitale Regentropfen - minimalistisch und modern",
    className: "digital-rain-background",
  },
  {
    id: "cosmic-dust",
    name: "Cosmic Dust",
    description: "Kosmischer Staub-Effekt - subtil und atmosphärisch",
    className: "cosmic-dust-background",
  },
  {
    id: "minimal-dots",
    name: "Minimal Dots",
    description: "Dezente Punktmuster - schlicht und professionell",
    className: "minimal-dots-background",
  },
  {
    id: "subtle-lines",
    name: "Subtle Lines",
    description: "Sanfte Linien - minimalistisch und elegant",
    className: "subtle-lines-background",
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    description: "Weiche Farbverläufe - ruhig und harmonisch",
    className: "soft-gradient-background",
  },
  {
    id: "paper-texture",
    name: "Paper Texture",
    description: "Papier-Textur - natürlich und warm",
    className: "paper-texture-background",
  },
  {
    id: "gentle-waves",
    name: "Gentle Waves",
    description: "Sanfte Wellen - organisch und beruhigend",
    className: "gentle-waves-background",
  },
  {
    id: "clean-grid",
    name: "Clean Grid",
    description: "Sauberes Grid - strukturiert und klar",
    className: "clean-grid-background",
  },
  {
    id: "soft-blur",
    name: "Soft Blur",
    description: "Weiche Unschärfe-Effekte - modern und dezent",
    className: "soft-blur-background",
  },
  {
    id: "minimal-mesh",
    name: "Minimal Mesh",
    description: "Minimalistisches Mesh - modern und schlicht",
    className: "minimal-mesh-background",
  },
  {
    id: "geometric-shapes",
    name: "Geometric Shapes",
    description: "Abstrakte geometrische Formen - modern und dynamisch",
    className: "geometric-shapes-background",
  },
  {
    id: "wave-pattern",
    name: "Wave Pattern",
    description: "Fließende Wellen-Muster - organisch und harmonisch",
    className: "wave-pattern-background",
  },
  {
    id: "dot-matrix",
    name: "Dot Matrix",
    description: "Punkt-Matrix-Muster - strukturiert und präzise",
    className: "dot-matrix-background",
  },
  {
    id: "radial-gradient",
    name: "Radial Gradient",
    description: "Radiale Farbverläufe - weich und fokussiert",
    className: "radial-gradient-background",
  },
  {
    id: "diagonal-lines",
    name: "Diagonal Lines",
    description: "Diagonale Linien-Muster - dynamisch und modern",
    className: "diagonal-lines-background",
  },
  {
    id: "organic-blobs",
    name: "Organic Blobs",
    description: "Organische Blob-Formen - weich und natürlich",
    className: "organic-blobs-background",
  },
  {
    id: "tech-circuit",
    name: "Tech Circuit",
    description: "Technische Schaltkreis-Muster - futuristisch und präzise",
    className: "tech-circuit-background",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Aquarell-Effekt - künstlerisch und weich",
    className: "watercolor-background",
  },
  {
    id: "noise-texture",
    name: "Noise Texture",
    description: "Rauschen-Textur - subtil und modern",
    className: "noise-texture-background",
  },
  {
    id: "luminous-gradient",
    name: "Luminous Gradient",
    description: "Weicher, leuchtender Mehrfarb-Gradient - sanft und atmosphärisch",
    className: "luminous-gradient-background",
  },
];

export default function BackgroundDemoPage() {
  const [selectedBackground, setSelectedBackground] = useState<BackgroundStyle>("neon-grid");
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>("electric-blue");
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const selectedOption = backgroundOptions.find(opt => opt.id === selectedBackground);
  const selectedColors = colorModules.find(colors => colors.id === selectedColorScheme);

  // Hex zu HSL Konvertierung
  const hexToHsl = (hex: string): string => {
    // Entferne # falls vorhanden
    hex = hex.replace('#', '');
    
    // Konvertiere zu RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };

  const handleApplyToDashboard = () => {
    // Speichere das ausgewählte Design in localStorage
    const designConfig = {
      background: selectedBackground,
      colorScheme: selectedColorScheme,
      primary: selectedColors?.primary,
      secondary: selectedColors?.secondary,
      accent: selectedColors?.accent,
      appliedAt: new Date().toISOString(),
    };
    
    localStorage.setItem("dashboard-background-design", JSON.stringify(designConfig));
    
    // Wende das Design an (verwendet document.documentElement)
    applyBackgroundDesign(designConfig);
    
    toast({
      title: "Design angewendet!",
      description: `${selectedOption?.name} mit ${selectedColors?.name} wurde auf das Dashboard angewendet.`,
    });
    
    // Navigiere zum Dashboard
    router.push("/dashboard/team/enterprise");
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Hintergrund-Demo
          </h1>
          <p className="text-muted-foreground">
            Wähle einen Hintergrund-Stil und ein Farb-Modul aus und sieh dir die Vorschau an
          </p>
        </div>

        {/* Color Modules Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Farb-Module
            </CardTitle>
            <CardDescription>
              Wähle ein Farbschema für deinen Hintergrund
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colorModules.map((colorModule) => (
                <div
                  key={colorModule.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    selectedColorScheme === colorModule.id 
                      ? "border-primary ring-2 ring-primary ring-offset-2" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedColorScheme(colorModule.id)}
                >
                  {selectedColorScheme === colorModule.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex gap-1 h-8">
                      <div 
                        className="flex-1 rounded" 
                        style={{ backgroundColor: colorModule.primary }}
                      />
                      <div 
                        className="flex-1 rounded" 
                        style={{ backgroundColor: colorModule.secondary }}
                      />
                      <div 
                        className="flex-1 rounded" 
                        style={{ backgroundColor: colorModule.accent }}
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{colorModule.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vorschau</CardTitle>
            <CardDescription>
              Aktuell ausgewählt: <strong>{selectedOption?.name}</strong> mit <strong>{selectedColors?.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[600px] h-[600px] rounded-lg overflow-hidden border-2 border-border">
              <div 
                className={cn("absolute inset-0 w-full h-full", selectedOption?.className)}
                style={{
                  "--color-primary": selectedColors?.primary,
                  "--color-secondary": selectedColors?.secondary,
                  "--color-accent": selectedColors?.accent,
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 p-6 bg-background/70 backdrop-blur-md rounded-lg border border-border/50 shadow-lg max-w-xs">
                    <h3 className="text-lg font-semibold">{selectedOption?.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedOption?.description}</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div 
                        className="w-3 h-3 rounded-full border border-border/50" 
                        style={{ backgroundColor: selectedColors?.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-border/50" 
                        style={{ backgroundColor: selectedColors?.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-border/50" 
                        style={{ backgroundColor: selectedColors?.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => setPreviewMode(!previewMode)}
                variant={previewMode ? "default" : "outline"}
                className="flex-1"
              >
                {previewMode ? "Vorschau beenden" : "Vollbild-Vorschau"}
              </Button>
              <Button 
                onClick={handleApplyToDashboard}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Auf Dashboard anwenden
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {backgroundOptions.map((option) => (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary hover:shadow-lg",
                selectedBackground === option.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedBackground(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  {selectedBackground === option.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className={cn("h-32 rounded-lg overflow-hidden border relative", option.className)}
                  style={{
                    "--color-primary": selectedColors?.primary,
                    "--color-secondary": selectedColors?.secondary,
                    "--color-accent": selectedColors?.accent,
                  } as React.CSSProperties}
                />
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {previewMode && (
        <div 
          className="fixed inset-0 z-50 cursor-pointer"
          onClick={() => setPreviewMode(false)}
        >
          <div 
            className={cn("absolute inset-0 w-full h-full", selectedOption?.className)}
            style={{
              "--color-primary": selectedColors?.primary,
              "--color-secondary": selectedColors?.secondary,
              "--color-accent": selectedColors?.accent,
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 p-6 bg-background/70 backdrop-blur-md rounded-lg border border-border/50 shadow-xl max-w-sm">
                <h3 className="text-xl font-semibold">{selectedOption?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedOption?.description}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50" 
                    style={{ backgroundColor: selectedColors?.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50" 
                    style={{ backgroundColor: selectedColors?.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50" 
                    style={{ backgroundColor: selectedColors?.accent }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4">Klicke irgendwo, um zu schließen</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

