// Hilfsfunktion zum Anwenden des Hintergrund-Designs

export interface BackgroundDesignConfig {
  background: string;
  colorScheme: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  appliedAt?: string;
}

// Liste aller Hintergrund-Klassen
const backgroundClassNames = [
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

// Mapping von Background ID zu CSS-Klasse
const backgroundIdToClassName: Record<string, string> = {
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

// Konvertiert Hex zu HSL
function hexToHsl(hex: string): string {
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
}

/**
 * Wendet das Hintergrund-Design auf das Dashboard an
 */
export function applyBackgroundDesign(config: BackgroundDesignConfig) {
  const rootElement = document.documentElement;
  
  // Stelle sicher, dass der Hintergrund basierend auf dem Theme gesetzt wird
  const currentTheme = rootElement.classList.contains('dark') ? 'dark' : 'light';
  if (currentTheme === 'light') {
    // Im Light-Mode: Stelle sicher, dass der Hintergrund hell bleibt
    rootElement.style.setProperty('--background', '0 0% 100%');
    rootElement.style.backgroundColor = '#fafbfc';
    if (document.body) {
      document.body.style.backgroundColor = '#fafbfc';
    }
  } else {
    // Im Dark-Mode: Dunkler Hintergrund
    rootElement.style.setProperty('--background', '240 10% 6%');
    rootElement.style.backgroundColor = '#050505';
    if (document.body) {
      document.body.style.backgroundColor = '#050505';
    }
  }

  // Setze CSS-Variablen für Hintergründe
  if (config.primary) {
    rootElement.style.setProperty("--color-primary", config.primary);
  }
  if (config.secondary) {
    rootElement.style.setProperty("--color-secondary", config.secondary);
  }
  if (config.accent) {
    rootElement.style.setProperty("--color-accent", config.accent);
  }

  // Setze Tailwind CSS-Variablen (--primary, --secondary, --accent)
  if (config.primary) {
    const primaryHsl = hexToHsl(config.primary);
    rootElement.style.setProperty("--primary", primaryHsl);
    const l = parseInt(primaryHsl.split(' ')[2].replace('%', ''));
    const primaryForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
    rootElement.style.setProperty("--primary-foreground", primaryForeground);
  }

  if (config.secondary) {
    const secondaryHsl = hexToHsl(config.secondary);
    rootElement.style.setProperty("--secondary", secondaryHsl);
    const l = parseInt(secondaryHsl.split(' ')[2].replace('%', ''));
    const secondaryForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
    rootElement.style.setProperty("--secondary-foreground", secondaryForeground);
  }

  if (config.accent) {
    const accentHsl = hexToHsl(config.accent);
    rootElement.style.setProperty("--accent", accentHsl);
    const l = parseInt(accentHsl.split(' ')[2].replace('%', ''));
    const accentForeground = l > 50 ? "0 0% 0%" : "0 0% 100%";
    rootElement.style.setProperty("--accent-foreground", accentForeground);
  }

  // Entferne alle alten Hintergrund-Klassen
  backgroundClassNames.forEach(className => {
    rootElement.classList.remove(className);
  });

  // Füge die neue Hintergrund-Klasse hinzu
  const className = backgroundIdToClassName[config.background];
  if (className) {
    rootElement.classList.add(className);
  }
}

/**
 * Lädt das gespeicherte Hintergrund-Design aus localStorage und wendet es an
 */
export function loadAndApplyBackgroundDesign() {
  if (typeof window === 'undefined') return;

  try {
    const savedDesign = localStorage.getItem("dashboard-background-design");
    if (savedDesign) {
      const design: BackgroundDesignConfig = JSON.parse(savedDesign);
      applyBackgroundDesign(design);
    }
  } catch (error) {
    console.error("Error loading background design:", error);
  }
}

