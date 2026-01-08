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
import { useUser } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { getTodayISO } from '@/lib/date-utils';
import { useMemo } from 'react';

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

const Index = () => {
  const { user } = useUser();
  const { stats, timeEntries } = useDashboardStats();

  // Extrahiere Benutzernamen (memoized)
  const { userName, userFullName } = useMemo(() => {
    const firstName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Benutzer';
    const fullName = user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Benutzer';
    return { userName: firstName, userFullName: fullName };
  }, [user]);

  // Berechne Team-Aktivität (basierend auf TimeEntries)
  const teamActivity = useMemo(() => {
    return timeEntries.length > 0 ? Math.min(100, Math.round((timeEntries.length / 10) * 100)) : 0;
  }, [timeEntries.length]);

  return (
    <div className="space-y-6 animate-fade-in pt-4">
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
        <div className="flex gap-2 flex-wrap">
          <SettingsDialog
            trigger={
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-border hover:border-primary hover:text-primary transition-all text-xs sm:text-sm"
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">Einstellungen</span>
                <span className="sm:hidden">Einst.</span>
              </Button>
            }
          />
          <WidgetManager>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 border-border hover:border-primary hover:text-primary transition-all text-xs sm:text-sm"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Karten verwalten</span>
              <span className="sm:hidden">Karten</span>
            </Button>
          </WidgetManager>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Erledigte Tasks"
          value={stats.completedTasksThisWeek}
          description="Diese Woche"
          icon={CheckCircle2}
          trend={stats.tasksChange !== 0 ? { value: Math.abs(stats.tasksChange), isPositive: stats.tasksChange >= 0 } : undefined}
        />
        <StatsCard
          title="Ausstehend"
          value={stats.pendingTasksToday}
          description="Heute fällig"
          icon={Clock}
        />
        <StatsCard
          title="Team-Aktivität"
          value={`${teamActivity}%`}
          description="Engagement-Rate"
          icon={TrendingUp}
          trend={teamActivity > 50 ? { value: 3, isPositive: true } : undefined}
        />
        <StatsCard
          title="Zeitbuchungen"
          value={stats.totalTimeEntries}
          description="Gesamt erfasst"
          icon={Users}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Today Card + Tasks */}
        <div className="md:col-span-2 lg:col-span-2 space-y-4 md:space-y-6">
          <TodayCard userName={userName} />
          <TasksCard />
        </div>

        {/* Right Column - Activity + Quick Actions */}
        <div className="md:col-span-2 lg:col-span-1 space-y-4 md:space-y-6">
          <QuickActionsCard />
          <ActivityCard />
        </div>
      </div>
    </div>
  );
};

export default Index;
