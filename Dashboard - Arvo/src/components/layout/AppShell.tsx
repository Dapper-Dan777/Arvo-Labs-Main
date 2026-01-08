import { useState, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PageTransition } from "@/components/common/PageTransition";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

// Alle verfügbaren Hintergrund-Klassen
const backgroundClasses = [
  "neon-grid-background",
  "holographic-background",
  "cyber-mesh-background",
  "liquid-gradient-background",
  "particle-field-background",
  "neural-network-background",
  "aurora-borealis-background",
  "matrix-rain-background",
  "circuit-board-background",
  "starry-night-background",
  "geometric-waves-background",
  "prism-light-background",
  "hexagon-pattern-background",
  "flowing-lines-background",
  "digital-rain-background",
  "cosmic-dust-background",
  "minimal-dots-background",
  "subtle-lines-background",
  "soft-gradient-background",
  "paper-texture-background",
  "gentle-waves-background",
  "clean-grid-background",
  "soft-blur-background",
  "minimal-mesh-background",
  "geometric-shapes-background",
  "wave-pattern-background",
  "dot-matrix-background",
  "radial-gradient-background",
  "diagonal-lines-background",
  "organic-blobs-background",
  "tech-circuit-background",
  "watercolor-background",
  "noise-texture-background",
  "luminous-gradient-background",
];

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState<string>("");
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lade gespeichertes Hintergrund-Design
  useEffect(() => {
    const savedDesign = localStorage.getItem("dashboard-background-design");
    if (savedDesign) {
      try {
        const design = JSON.parse(savedDesign);
        const rootElement = document.getElementById("root");
        if (rootElement) {
          // Entferne alle alten Hintergrund-Klassen
          backgroundClasses.forEach(cls => {
            rootElement.classList.remove(cls);
          });
          
          // Finde die entsprechende Klasse
          const backgroundOptionMap: Record<string, string> = {
            "neon-grid": "neon-grid-background",
            "holographic": "holographic-background",
            "cyber-mesh": "cyber-mesh-background",
            "liquid-gradient": "liquid-gradient-background",
            "particle-field": "particle-field-background",
            "neural-network": "neural-network-background",
            "aurora-borealis": "aurora-borealis-background",
            "matrix-rain": "matrix-rain-background",
            "circuit-board": "circuit-board-background",
            "starry-night": "starry-night-background",
            "geometric-waves": "geometric-waves-background",
            "prism-light": "prism-light-background",
            "hexagon-pattern": "hexagon-pattern-background",
            "flowing-lines": "flowing-lines-background",
            "digital-rain": "digital-rain-background",
            "cosmic-dust": "cosmic-dust-background",
            "minimal-dots": "minimal-dots-background",
            "subtle-lines": "subtle-lines-background",
            "soft-gradient": "soft-gradient-background",
            "paper-texture": "paper-texture-background",
            "gentle-waves": "gentle-waves-background",
            "clean-grid": "clean-grid-background",
            "soft-blur": "soft-blur-background",
            "minimal-mesh": "minimal-mesh-background",
            "geometric-shapes": "geometric-shapes-background",
            "wave-pattern": "wave-pattern-background",
            "dot-matrix": "dot-matrix-background",
            "radial-gradient": "radial-gradient-background",
            "diagonal-lines": "diagonal-lines-background",
            "organic-blobs": "organic-blobs-background",
            "tech-circuit": "tech-circuit-background",
            "watercolor": "watercolor-background",
            "noise-texture": "noise-texture-background",
            "luminous-gradient": "luminous-gradient-background",
          };
          
          const className = backgroundOptionMap[design.background];
          if (className) {
            rootElement.classList.add(className);
            setBackgroundClass(className);
            
            // Setze CSS-Variablen für Hintergrund-Farben
            if (design.primary) {
              document.documentElement.style.setProperty("--color-primary", design.primary);
            }
            if (design.secondary) {
              document.documentElement.style.setProperty("--color-secondary", design.secondary);
            }
            if (design.accent) {
              document.documentElement.style.setProperty("--color-accent", design.accent);
            }
            
            // Hex zu HSL Konvertierung für Tailwind CSS-Variablen
            const hexToHsl = (hex: string): string => {
              hex = hex.replace('#', '');
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
            
            // Setze Tailwind CSS-Variablen für Website-Farben
            if (design.primary) {
              const primaryHsl = hexToHsl(design.primary);
              document.documentElement.style.setProperty("--primary", primaryHsl);
              const l = parseInt(primaryHsl.split(' ')[2].replace('%', ''));
              const primaryForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
              document.documentElement.style.setProperty("--primary-foreground", primaryForeground);
            }
            if (design.secondary) {
              const secondaryHsl = hexToHsl(design.secondary);
              document.documentElement.style.setProperty("--secondary", secondaryHsl);
              const l = parseInt(secondaryHsl.split(' ')[2].replace('%', ''));
              const secondaryForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
              document.documentElement.style.setProperty("--secondary-foreground", secondaryForeground);
            }
            if (design.accent) {
              const accentHsl = hexToHsl(design.accent);
              document.documentElement.style.setProperty("--accent", accentHsl);
              const l = parseInt(accentHsl.split(' ')[2].replace('%', ''));
              const accentForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
              document.documentElement.style.setProperty("--accent-foreground", accentForeground);
            }
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden des Hintergrund-Designs:", error);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Wenn wir die Sidebar manuell öffnen, sollte hovered zurückgesetzt werden
    if (!sidebarCollapsed) {
      setSidebarHovered(false);
    }
  };

  const sidebarWidth = sidebarCollapsed && !sidebarHovered ? 64 : 256;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          onMouseEnter={() => {
            if (sidebarCollapsed) {
              setSidebarHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (sidebarCollapsed) {
              setSidebarHovered(false);
            }
          }}
        >
          <AppSidebar
            collapsed={sidebarCollapsed}
            hovered={sidebarHovered}
            onToggle={handleToggleSidebar}
          />
        </div>
      )}
      
      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <AppSidebar
              collapsed={false}
              hovered={false}
              onToggle={() => setMobileSidebarOpen(false)}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div 
        className="flex flex-1 flex-col min-w-0"
        style={{ 
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`
        }}
      >
        <Topbar 
          onToggleMobile={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={isMobile ? () => setMobileSidebarOpen(true) : handleToggleSidebar}
          sidebarWidth={isMobile ? 0 : sidebarWidth}
        />
        <main 
          className={cn("flex-1 overflow-auto bg-background", backgroundClass)}
          style={{ 
            paddingTop: '4rem', // Platz für fixierte Topbar (min-h-[3rem] + padding)
            "--color-primary": "var(--color-primary, #4facfe)",
            "--color-secondary": "var(--color-secondary, #00f2fe)",
            "--color-accent": "var(--color-accent, #a855f7)",
          } as React.CSSProperties}
        >
          {children ? (
            <PageTransition>
              {children}
            </PageTransition>
          ) : (
            <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Laden...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
