import { AVAILABLE_WIDGETS, DEFAULT_WIDGET_IDS, type Widget } from '@/config/widgets';

// ============================================================
// WIDGET STORAGE
// Abstraktionsschicht für Widget-Persistenz
// 
// PERSISTENZ-WECHSEL: Um auf Supabase umzustellen:
// 1. Implementiere die Funktionen mit Supabase-Client
// 2. Ersetze localStorage-Aufrufe durch Supabase-Queries
// 3. Nutze userId für user-spezifische Speicherung
// ============================================================

const STORAGE_KEY = 'arvo_user_widgets';

export interface UserWidgetConfig {
  activeWidgetIds: string[];
  /** Position/Reihenfolge der Widgets (für spätere Drag-and-Drop) */
  widgetOrder: string[];
  lastUpdated: string;
}

// Default-Konfiguration für neue User
function getDefaultConfig(): UserWidgetConfig {
  return {
    activeWidgetIds: [...DEFAULT_WIDGET_IDS],
    widgetOrder: [...DEFAULT_WIDGET_IDS],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Lädt die Widget-Konfiguration eines Users
 * @param userId - User-ID (für spätere Supabase-Integration)
 */
export function loadUserWidgets(userId?: string): UserWidgetConfig {
  // PERSISTENZ: Hier für Supabase anpassen
  // const { data } = await supabase.from('user_widgets').select('*').eq('user_id', userId).single();
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId || 'guest'}`);
    if (stored) {
      return JSON.parse(stored) as UserWidgetConfig;
    }
  } catch (e) {
    console.error('Error loading widget config:', e);
  }
  
  return getDefaultConfig();
}

/**
 * Speichert die Widget-Konfiguration eines Users
 * @param userId - User-ID (für spätere Supabase-Integration)
 * @param config - Widget-Konfiguration
 */
export function saveUserWidgets(userId: string | undefined, config: UserWidgetConfig): void {
  // PERSISTENZ: Hier für Supabase anpassen
  // await supabase.from('user_widgets').upsert({ user_id: userId, ...config });
  
  try {
    const updatedConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`${STORAGE_KEY}_${userId || 'guest'}`, JSON.stringify(updatedConfig));
  } catch (e) {
    console.error('Error saving widget config:', e);
  }
}

/**
 * Aktiviert ein Widget für den User
 */
export function activateWidget(userId: string | undefined, widgetId: string): UserWidgetConfig {
  const config = loadUserWidgets(userId);
  
  if (!config.activeWidgetIds.includes(widgetId)) {
    config.activeWidgetIds.push(widgetId);
    config.widgetOrder.push(widgetId);
  }
  
  saveUserWidgets(userId, config);
  return config;
}

/**
 * Deaktiviert ein Widget für den User
 */
export function deactivateWidget(userId: string | undefined, widgetId: string): UserWidgetConfig {
  const config = loadUserWidgets(userId);
  
  config.activeWidgetIds = config.activeWidgetIds.filter(id => id !== widgetId);
  config.widgetOrder = config.widgetOrder.filter(id => id !== widgetId);
  
  saveUserWidgets(userId, config);
  return config;
}

/**
 * Gibt aktive Widgets als vollständige Widget-Objekte zurück
 */
export function getActiveWidgets(userId?: string): Widget[] {
  const config = loadUserWidgets(userId);
  
  // Sortiere nach widgetOrder
  return config.widgetOrder
    .filter(id => config.activeWidgetIds.includes(id))
    .map(id => AVAILABLE_WIDGETS.find(w => w.id === id))
    .filter((w): w is Widget => w !== undefined);
}

/**
 * Gibt verfügbare (nicht aktive) Widgets zurück
 */
export function getAvailableWidgets(userId?: string): Widget[] {
  const config = loadUserWidgets(userId);
  
  return AVAILABLE_WIDGETS.filter(w => !config.activeWidgetIds.includes(w.id));
}

/**
 * Aktualisiert die Reihenfolge der Widgets
 * DRAG-AND-DROP: Diese Funktion für Sortierung nutzen
 */
export function updateWidgetOrder(userId: string | undefined, newOrder: string[]): UserWidgetConfig {
  const config = loadUserWidgets(userId);
  config.widgetOrder = newOrder;
  saveUserWidgets(userId, config);
  return config;
}
