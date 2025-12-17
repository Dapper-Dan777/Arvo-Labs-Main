import { 
    Home, 
    Inbox, 
    LayoutDashboard, 
    Clock, 
    Bot, 
    FileText,
    TrendingUp,
    CheckCircle2,
    Calendar,
    Users,
    Zap,
    type LucideIcon 
  } from 'lucide-react';
  
  // ============================================================
  // WIDGETS CONFIG
  // Dashboard-Karten / Widgets Konfiguration
  // 
  // Um ein neues Widget hinzuzufügen:
  // 1. Füge ein neues Objekt zu AVAILABLE_WIDGETS hinzu
  // 2. Setze linkedTabId auf den verknüpften Haupt-Tab
  // 3. Optional: focusParam für Query-Parameter im Ziel-Tab
  // ============================================================
  
  export interface Widget {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    /** Verknüpfung zu einem Haupt-Tab (aus navigation.ts) */
    linkedTabId: string;
    /** Query-Parameter für Fokus im Ziel-Tab */
    focusParam?: string;
    /** Standardmäßig aktiv für neue User */
    defaultActive: boolean;
  }
  
  export const AVAILABLE_WIDGETS: Widget[] = [
    {
      id: 'today-overview',
      title: 'Heute bei Arvo',
      subtitle: 'Dein Tagesüberblick',
      description: 'Aktive Workflows und heutiger Fokus auf einen Blick',
      icon: Home,
      linkedTabId: 'dashboard',
      focusParam: 'today',
      defaultActive: true,
    },
    {
      id: 'active-workflows',
      title: 'Aktive Workflows',
      subtitle: 'Laufende Prozesse',
      description: 'Übersicht deiner aktiven Automatisierungen',
      icon: Zap,
      linkedTabId: 'dashboards',
      focusParam: 'workflows',
      defaultActive: true,
    },
    {
      id: 'pending-tasks',
      title: 'Offene Aufgaben',
      subtitle: 'Heute fällig',
      description: 'Tasks die heute erledigt werden müssen',
      icon: CheckCircle2,
      linkedTabId: 'dashboard',
      focusParam: 'tasks',
      defaultActive: true,
    },
    {
      id: 'inbox-summary',
      title: 'Posteingang',
      subtitle: 'Neue Aktivitäten',
      description: 'Ungelesene Nachrichten und Benachrichtigungen',
      icon: Inbox,
      linkedTabId: 'inbox',
      defaultActive: true,
    },
    {
      id: 'kpi-overview',
      title: 'KPI-Übersicht',
      subtitle: 'Deine Kennzahlen',
      description: 'Wichtige Metriken auf einen Blick',
      icon: TrendingUp,
      linkedTabId: 'dashboards',
      focusParam: 'kpis',
      defaultActive: false,
    },
    {
      id: 'time-tracking',
      title: 'Zeiterfassung',
      subtitle: 'Heutige Buchungen',
      description: 'Erfasste Zeit und offene Buchungen',
      icon: Clock,
      linkedTabId: 'timesheets',
      defaultActive: false,
    },
    {
      id: 'ai-assistant',
      title: 'KI-Assistent',
      subtitle: 'Schnelle Hilfe',
      description: 'Frag deinen persönlichen KI-Assistenten',
      icon: Bot,
      linkedTabId: 'assistant',
      defaultActive: false,
    },
    {
      id: 'recent-documents',
      title: 'Letzte Dokumente',
      subtitle: 'Zuletzt bearbeitet',
      description: 'Schnellzugriff auf aktuelle Dokumente',
      icon: FileText,
      linkedTabId: 'documents',
      focusParam: 'recent',
      defaultActive: false,
    },
    {
      id: 'upcoming-events',
      title: 'Anstehende Termine',
      subtitle: 'Diese Woche',
      description: 'Meetings und wichtige Termine',
      icon: Calendar,
      linkedTabId: 'dashboard',
      focusParam: 'calendar',
      defaultActive: false,
    },
    {
      id: 'team-activity',
      title: 'Team-Aktivität',
      subtitle: 'Was passiert gerade',
      description: 'Aktuelle Aktivitäten deines Teams',
      icon: Users,
      linkedTabId: 'teams',
      defaultActive: false,
    },
  ];
  
  // Default Widget-IDs für neue User
  export const DEFAULT_WIDGET_IDS = AVAILABLE_WIDGETS
    .filter(w => w.defaultActive)
    .map(w => w.id);
  
  // Hilfsfunktion: Widget nach ID finden
  export function getWidgetById(id: string): Widget | undefined {
    return AVAILABLE_WIDGETS.find(widget => widget.id === id);
  }
  