import { 
    Target, 
    Zap, 
    Bolt, 
    Settings, 
    HelpCircle, 
    Bell,
    Shield,
    CreditCard,
    type LucideIcon 
  } from 'lucide-react';
  
  // ============================================================
  // MORE SECTIONS CONFIG
  // Sekundäre Bereiche für den "Mehr"-Tab
  // 
  // Um einen neuen Bereich hinzuzufügen:
  // 1. Füge ein neues Objekt zu MORE_SECTIONS hinzu
  // 2. Erstelle die Route in App.tsx (/more/:sectionId)
  // ============================================================
  
  export interface MoreSection {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
    description: string;
    /** Nur für bestimmte Pläne verfügbar */
    requiresPlan?: 'pro' | 'enterprise';
  }
  
  export const MORE_SECTIONS: MoreSection[] = [
    {
      id: 'goals-progress',
      label: 'Ziele & Fortschritt',
      icon: Target,
      path: '/more/goals-progress',
      description: 'Verfolge deine persönlichen und Team-Ziele',
    },
    {
      id: 'automations',
      label: 'Automatisierungen',
      icon: Zap,
      path: '/more/automations',
      description: 'Insights zu deinen Workflow-Automatisierungen',
    },
    {
      id: 'quick-actions',
      label: 'Schnellaktionen',
      icon: Bolt,
      path: '/more/quick-actions',
      description: 'Häufig genutzte Aktionen auf einen Blick',
    },
    {
      id: 'notifications',
      label: 'Benachrichtigungen',
      icon: Bell,
      path: '/more/notifications',
      description: 'Verwalte deine Benachrichtigungseinstellungen',
    },
    {
      id: 'security',
      label: 'Sicherheit',
      icon: Shield,
      path: '/more/security',
      description: 'Passwort, 2FA und Sicherheitseinstellungen',
    },
    {
      id: 'billing',
      label: 'Abrechnung',
      icon: CreditCard,
      path: '/more/billing',
      description: 'Plan, Rechnungen und Zahlungsmethoden',
      requiresPlan: 'pro',
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: Settings,
      path: '/more/settings',
      description: 'App-Einstellungen und Präferenzen',
    },
    {
      id: 'help',
      label: 'Hilfe & Support',
      icon: HelpCircle,
      path: '/more/help',
      description: 'FAQ, Dokumentation und Kontakt',
    },
  ];
  
  // Hilfsfunktion: Section nach ID finden
  export function getMoreSectionById(id: string): MoreSection | undefined {
    return MORE_SECTIONS.find(section => section.id === id);
  }
  