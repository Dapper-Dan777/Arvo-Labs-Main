import { 
    Home, 
    Inbox, 
    MessageSquare, 
    Users, 
    FileText, 
    LayoutDashboard, 
    PenTool, 
    FileInput, 
    Mail, 
    Target, 
    Clock, 
    MoreHorizontal,
    Bot,
    type LucideIcon
  } from 'lucide-react';
  
  // ============================================================
  // NAVIGATION CONFIG
  // Zentrale Konfiguration für alle Haupt-Tabs und Navigation
  // 
  // Um einen neuen Tab hinzuzufügen:
  // 1. Füge ein neues Objekt zu MAIN_TABS hinzu
  // 2. Erstelle die entsprechende Route in App.tsx
  // 3. Erstelle die Seiten-Komponente in src/pages/
  // ============================================================
  
  export interface NavTab {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
    /** Badge-Anzahl (für Inbox, Benachrichtigungen etc.) */
    badgeCount?: number;
    /** Nur für Pro/Enterprise Pläne verfügbar */
    requiresPlan?: 'pro' | 'enterprise';
    /** In Bottom-Navigation anzeigen */
    showInBottomNav?: boolean;
  }
  
  // Haupt-Tabs für Bottom Navigation (Mobile)
  export const BOTTOM_NAV_TABS: NavTab[] = [
    {
      id: 'dashboard',
      label: 'Start',
      icon: Home,
      path: '/dashboard',
      showInBottomNav: true,
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      path: '/dashboard/inbox',
      badgeCount: 3,
      showInBottomNav: true,
    },
    {
      id: 'assistant',
      label: 'Assistent',
      icon: Bot,
      path: '/dashboard/assistant',
      showInBottomNav: true,
    },
    {
      id: 'more',
      label: 'Mehr',
      icon: MoreHorizontal,
      path: '/dashboard/more',
      showInBottomNav: true,
    },
  ];
  
  // Alle verfügbaren Tabs (für Sidebar und More-Bereich)
  export const ALL_TABS: NavTab[] = [
    {
      id: 'dashboard',
      label: 'Startseite',
      icon: Home,
      path: '/',
    },
    {
      id: 'inbox',
      label: 'Posteingang',
      icon: Inbox,
      path: '/inbox',
      badgeCount: 3,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      path: '/chat',
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: Users,
      path: '/teams',
      requiresPlan: 'pro',
    },
    {
      id: 'documents',
      label: 'Dokumente',
      icon: FileText,
      path: '/documents',
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: LayoutDashboard,
      path: '/dashboards',
    },
    {
      id: 'whiteboards',
      label: 'Whiteboards',
      icon: PenTool,
      path: '/whiteboards',
    },
    {
      id: 'forms',
      label: 'Formulare',
      icon: FileInput,
      path: '/forms',
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: Mail,
      path: '/mail',
      requiresPlan: 'pro',
    },
    {
      id: 'goals',
      label: 'Ziele',
      icon: Target,
      path: '/goals',
      requiresPlan: 'enterprise',
    },
    {
      id: 'timesheets',
      label: 'Zeiterfassung',
      icon: Clock,
      path: '/timesheets',
    },
    {
      id: 'assistant',
      label: 'KI-Assistent',
      icon: Bot,
      path: '/assistant',
    },
  ];
  
  // Hilfsfunktion: Tab nach ID finden
  export function getTabById(id: string): NavTab | undefined {
    return ALL_TABS.find(tab => tab.id === id);
  }
  
  // Hilfsfunktion: Path zu Tab-ID
  export function getTabByPath(path: string): NavTab | undefined {
    return ALL_TABS.find(tab => tab.path === path);
  }
  