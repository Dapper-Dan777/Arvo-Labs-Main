/**
 * Zentrale Konfiguration für Section-spezifische Gradients, Box Colors und Secondary Colors
 *
 * Dieses Mapping verbindet Routes/Sections mit ihren zugehörigen Design-Tokens.
 * Die Tokens werden konsistent in Sidebar (Active-State) und auf den Inhaltsseiten verwendet.
 */

export const SECTION_GRADIENTS: Record<string, string> = {
  // Haupt-Sections
  "/dashboard": "var(--gradient-dashboard)",
  "/automations": "var(--gradient-automations)",
  "/workflows": "var(--gradient-workflows)",
  "/triggers": "var(--gradient-triggers)",
  "/analytics": "var(--gradient-analytics)",
  "/integrations": "var(--gradient-integrations)",
  "/inbox": "var(--gradient-mailbox)",
  "/documents": "var(--gradient-docs)",
  "/whiteboard": "var(--gradient-whiteboard)",
  "/forms": "var(--gradient-forms)",
  "/customers": "var(--gradient-customers)",
  "/mail": "var(--gradient-mail)",
  "/goals": "var(--gradient-goals)",
  "/timesheets": "var(--gradient-time)",
  "/team": "var(--gradient-team)",
  "/ai-assistant": "var(--gradient-primary)",
  "/chatbots": "var(--gradient-ai-assistant)",

  // Sub-Routes (erben vom Parent)
  "/workflows/marketing": "var(--gradient-workflows)",
  "/workflows/invoicing": "var(--gradient-workflows)",
  "/workflows/custom": "var(--gradient-workflows)",

  // Neutrale Sections
  "/settings": "var(--gradient-neutral)",
  "/help": "var(--gradient-neutral)",
};

export const SECTION_BOX_COLORS: Record<string, string> = {
  // Haupt-Sections
  "/dashboard": "var(--box-dashboard)",
  "/automations": "var(--box-automations)",
  "/workflows": "var(--box-workflows)",
  "/triggers": "var(--box-triggers)",
  "/analytics": "var(--box-analytics)",
  "/integrations": "var(--box-integrations)",
  "/inbox": "var(--box-mailbox)",
  "/documents": "var(--box-docs)",
  "/whiteboard": "var(--box-whiteboard)",
  "/forms": "var(--box-forms)",
  "/customers": "var(--box-customers)",
  "/mail": "var(--box-mail)",
  "/goals": "var(--box-goals)",
  "/timesheets": "var(--box-time)",
  "/team": "var(--box-team)",
  "/ai-assistant": "var(--glass-card-bg)",
  "/chatbots": "var(--glass-card-bg)",

  // Sub-Routes (erben vom Parent)
  "/workflows/marketing": "var(--box-workflows)",
  "/workflows/invoicing": "var(--box-workflows)",
  "/workflows/custom": "var(--box-workflows)",

  // Neutrale Sections
  "/settings": "var(--glass-card-bg)",
  "/help": "var(--glass-card-bg)",
};

export const SECTION_SECONDARY_COLORS: Record<string, string> = {
  // Haupt-Sections
  "/dashboard": "var(--secondary-dashboard)",
  "/automations": "var(--secondary-automations)",
  "/workflows": "var(--secondary-workflows)",
  "/triggers": "var(--secondary-triggers)",
  "/analytics": "var(--secondary-analytics)",
  "/integrations": "var(--secondary-integrations)",
  "/inbox": "var(--secondary-mailbox)",
  "/documents": "var(--secondary-docs)",
  "/whiteboard": "var(--secondary-whiteboard)",
  "/forms": "var(--secondary-forms)",
  "/customers": "var(--secondary-customers)",
  "/mail": "var(--secondary-mail)",
  "/goals": "var(--secondary-goals)",
  "/timesheets": "var(--secondary-time)",
  "/team": "var(--secondary-team)",
  "/ai-assistant": "var(--color-text-secondary)",
  "/chatbots": "var(--color-text-secondary)",

  // Sub-Routes (erben vom Parent)
  "/workflows/marketing": "var(--secondary-workflows)",
  "/workflows/invoicing": "var(--secondary-workflows)",
  "/workflows/custom": "var(--secondary-workflows)",

  // Neutrale Sections
  "/settings": "var(--color-text-secondary)",
  "/help": "var(--color-text-secondary)",
};

/**
 * Ermittelt den passenden Gradient-Token für eine gegebene Route
 */
export function getSectionGradient(pathname: string): string {
  if (SECTION_GRADIENTS[pathname]) {
    return SECTION_GRADIENTS[pathname];
  }

  const sortedRoutes = Object.keys(SECTION_GRADIENTS).sort((a, b) => b.length - a.length);
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return SECTION_GRADIENTS[route];
    }
  }

  return "var(--gradient-primary)";
}

/**
 * Ermittelt die passende Box-Color (Card Background) für eine gegebene Route
 */
export function getSectionBoxColor(pathname: string): string {
  if (SECTION_BOX_COLORS[pathname]) {
    return SECTION_BOX_COLORS[pathname];
  }

  const sortedRoutes = Object.keys(SECTION_BOX_COLORS).sort((a, b) => b.length - a.length);
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return SECTION_BOX_COLORS[route];
    }
  }

  return "var(--glass-card-bg)";
}

/**
 * Ermittelt die passende Secondary-Color (Hover, Borders, Accents) für eine gegebene Route
 */
export function getSectionSecondaryColor(pathname: string): string {
  if (SECTION_SECONDARY_COLORS[pathname]) {
    return SECTION_SECONDARY_COLORS[pathname];
  }

  const sortedRoutes = Object.keys(SECTION_SECONDARY_COLORS).sort((a, b) => b.length - a.length);
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return SECTION_SECONDARY_COLORS[route];
    }
  }

  return "var(--color-text-secondary)";
}

export function useSectionGradient(): string {
  if (typeof window === "undefined") {
    return "var(--gradient-primary)";
  }
  return getSectionGradient(window.location.pathname);
}

export function useSectionBoxColor(): string {
  if (typeof window === "undefined") {
    return "var(--glass-card-bg)";
  }
  return getSectionBoxColor(window.location.pathname);
}

export function useSectionSecondaryColor(): string {
  if (typeof window === "undefined") {
    return "var(--color-text-secondary)";
  }
  return getSectionSecondaryColor(window.location.pathname);
}



