import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TodayCard } from '@/components/dashboard/TodayCard';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WidgetManager } from '@/components/widgets/WidgetManager';
import { SettingsDialog } from '@/components/dashboard/SettingsDialog';
import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';

/**
 * ============================================================================
 * PROJEKTSTRUKTUR & AKTIVE/INAKTIVE BUTTONS - ÜBERSICHT
 * ============================================================================
 * 
 * **Tech-Stack:**
 * - React 18 + TypeScript + Vite
 * - React Router für Navigation
 * - TanStack Query für Data Fetching
 * - Supabase als Backend/Datenbank
 * - shadcn/ui Komponenten + Tailwind CSS
 * - ThemeContext für Dark/Light Mode
 * 
 * **Wichtige Pages:**
 * - Index.tsx: Haupt-Dashboard mit Stats, Cards, Widgets
 * - DocumentsPage.tsx: Dokumenten-Verwaltung mit Tabelle
 * - TimesheetsPage.tsx: Zeiterfassung mit Buchungen
 * - InboxPage.tsx: Benachrichtigungen und Aktivitäten
 * - DashboardsPage.tsx: KPI-Übersichten und Analytics
 * - AssistantPage.tsx: KI-Chat-Interface
 * 
 * **Wichtige Komponenten:**
 * - LayoutShell: Haupt-Layout mit Sidebar, Header, BottomNav
 * - Dashboard Cards: TodayCard, TasksCard, ActivityCard, QuickActionsCard, StatsCard
 * - WidgetManager: Widget-Verwaltung (aktiv)
 * 
 * **Hooks & Contexts:**
 * - ThemeContext: Dark/Light Mode Management
 * - WidgetContext: Widget-State Management
 * - use-mobile: Responsive Hook
 * - use-toast: Toast-Notifications
 * 
 * **INAKTIVE BUTTONS - IMPLEMENTIERUNGSPLAN:**
 * 
 * 1. DocumentsPage.tsx:
 *    - Filter Button (Zeile 66): Öffnet FilterSheet mit erweiterten Filtern
 *    - Eye Button (Zeile 112): Öffnet Dokument-Vorschau/Dialog
 *    - Sparkles Button (Zeile 115): KI-Assistent für Dokument-Analyse
 *    - MoreVertical Button (Zeile 118): Dropdown mit Export, Teilen, Löschen
 * 
 * 2. TimesheetsPage.tsx:
 *    - "Neue Buchung" Button: Dialog funktioniert, aber handleSubmit nur console.log
 *    - FEHLT: Supabase-Insert, Refetch nach Insert, Toast-Notification
 * 
 * 3. InboxPage.tsx:
 *    - Filter Tabs (Zeile 78): Keine onClick Handler
 *    - FEHLT: Filter-State, gefilterte Liste anzeigen
 * 
 * 4. Index.tsx:
 *    - "Karten verwalten" Button: Öffnet WidgetManager (bereits aktiv)
 * 
 * 5. DashboardsPage.tsx:
 *    - FEHLT: Export Button für KPI-Daten
 *    - FEHLT: Refresh Button für Daten-Reload
 * 
 * **SUPABASE TABELLEN (zu erstellen):**
 * - documents: id, title, type, date, status, user_id, created_at
 * - time_entries: id, date, project, duration, description, user_id, created_at
 * - notifications: id, type, title, description, time, unread, user_id, created_at
 * 
 * ============================================================================
 */

// ANPASSEN: Benutzerdaten hier ändern oder aus Context/API laden
const userName = 'Max';
const userFullName = 'Max Kowalski';

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Hallo, {userFullName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Willkommen zurück, {userName}. Hier ist deine Übersicht.
          </p>
        </div>
        <div className="flex gap-2">
          <SettingsDialog
            trigger={
              <Button 
                variant="outline" 
                className="gap-2 border-border hover:border-primary hover:text-primary transition-all"
              >
                <Settings2 className="w-4 h-4" />
                Einstellungen
              </Button>
            }
          />
          <WidgetManager>
            <Button 
              variant="outline" 
              className="gap-2 border-border hover:border-primary hover:text-primary transition-all"
            >
              <Settings2 className="w-4 h-4" />
              Karten verwalten
            </Button>
          </WidgetManager>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Erledigte Tasks"
          value={12}
          description="Diese Woche"
          icon={CheckCircle2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Ausstehend"
          value={5}
          description="Heute fällig"
          icon={Clock}
        />
        <StatsCard
          title="Team-Aktivität"
          value="87%"
          description="Engagement-Rate"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Aktive Mitglieder"
          value={24}
          description="In deinem Workspace"
          icon={Users}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today Card + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <TodayCard userName={userName} />
          <TasksCard />
        </div>

        {/* Right Column - Activity + Quick Actions */}
        <div className="space-y-6">
          <QuickActionsCard />
          <ActivityCard />
        </div>
      </div>
    </div>
  );
};

export default Index;
