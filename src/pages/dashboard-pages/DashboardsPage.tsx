import React, { useState, useMemo } from 'react';
import { LayoutDashboard, TrendingUp, ArrowUp, ArrowDown, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/documents/ExportButton';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getTasks, getTimeEntries, getDocuments } from '@/lib/supabase-queries';
import { useUser } from '@/contexts/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { queryKeys } from '@/lib/query-keys';
import { getDateDaysAgo, getLast7Days, isInLastWeek } from '@/lib/date-utils';
import { parseDurationToHours, calculateTotalDuration } from '@/lib/time-utils';

// ============================================================
// DASHBOARDS PAGE
// KPI-Übersichten und Analytics mit Export & Refresh
// ============================================================

interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  period: string;
}

const DashboardsPage = () => {
  const { isLoaded } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Lade Daten aus Supabase mit Error-Handling
  const { data: tasks = [], refetch: refetchTasks, error: tasksError, isLoading: tasksLoading } = useQuery({
    queryKey: queryKeys.tasks.list(),
    queryFn: () => getTasks(),
    enabled: isLoaded,
    retry: 1,
    staleTime: 30000,
  });

  const { data: timeEntries = [], refetch: refetchTimeEntries, error: timeEntriesError, isLoading: timeEntriesLoading } = useQuery({
    queryKey: queryKeys.timeEntries.list(),
    queryFn: () => getTimeEntries(),
    enabled: isLoaded,
    retry: 1,
    staleTime: 30000,
  });

  const { data: documents = [], refetch: refetchDocuments, error: documentsError, isLoading: documentsLoading } = useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: () => getDocuments(),
    enabled: isLoaded,
    retry: 1,
    staleTime: 30000,
  });

  const isLoading = tasksLoading || timeEntriesLoading || documentsLoading;
  const hasError = tasksError || timeEntriesError || documentsError;

  // Berechne KPIs aus echten Daten
  const kpiCards = useMemo(() => {
    const weekAgo = getDateDaysAgo(7);
    const twoWeeksAgo = getDateDaysAgo(14);

    // Erledigte Tasks diese Woche
    const completedThisWeek = tasks.filter(task => {
      if (!task.completed || !task.updated_at) return false;
      return isInLastWeek(task.updated_at);
    }).length;

    const completedLastWeek = tasks.filter(task => {
      if (!task.completed || !task.updated_at) return false;
      const completedDate = new Date(task.updated_at);
      return completedDate >= twoWeeksAgo && completedDate < weekAgo;
    }).length;

    const tasksChange = completedLastWeek > 0 
      ? Math.round(((completedThisWeek - completedLastWeek) / completedLastWeek) * 100)
      : completedThisWeek > 0 ? 100 : 0;

    // Durchschnittliche Zeit pro Task (basierend auf TimeEntries)
    const durations = timeEntries.map(entry => entry.duration);
    const totalHours = calculateTotalDuration(durations) / 60;
    const avgTime = tasks.length > 0 ? (totalHours / tasks.length).toFixed(1) : '0.0';
    
    // Berechne Änderung der durchschnittlichen Zeit (Vergleich letzte 2 Wochen)
    const thisWeekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekAgo;
    });
    const lastWeekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= twoWeeksAgo && entryDate < weekAgo;
    });
    
    const thisWeekHours = calculateTotalDuration(thisWeekEntries.map(e => e.duration)) / 60;
    const lastWeekHours = calculateTotalDuration(lastWeekEntries.map(e => e.duration)) / 60;
    const thisWeekAvg = thisWeekEntries.length > 0 ? thisWeekHours / thisWeekEntries.length : 0;
    const lastWeekAvg = lastWeekEntries.length > 0 ? lastWeekHours / lastWeekEntries.length : 0;
    const avgTimeChange = lastWeekAvg > 0 
      ? Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100)
      : thisWeekAvg > 0 ? 100 : 0;

    // Dokumente Status
    const totalDocs = documents.length;
    const completedDocs = documents.filter(doc => doc.status === 'Fertig').length;
    const openDocsRate = totalDocs > 0 ? ((totalDocs - completedDocs) / totalDocs * 100).toFixed(1) : '0.0';
    
    // Berechne Änderung der Dokumente-Status
    const thisWeekDocs = documents.filter(doc => {
      if (!doc.created_at) return false;
      return isInLastWeek(doc.created_at);
    });
    const lastWeekDocs = documents.filter(doc => {
      if (!doc.created_at) return false;
      const docDate = new Date(doc.created_at);
      return docDate >= twoWeeksAgo && docDate < weekAgo;
    });
    
    const thisWeekOpenRate = thisWeekDocs.length > 0 
      ? ((thisWeekDocs.filter(d => d.status !== 'Fertig').length / thisWeekDocs.length) * 100).toFixed(1)
      : '0.0';
    const lastWeekOpenRate = lastWeekDocs.length > 0
      ? ((lastWeekDocs.filter(d => d.status !== 'Fertig').length / lastWeekDocs.length) * 100).toFixed(1)
      : '0.0';
    const openDocsChange = parseFloat(lastWeekOpenRate) > 0
      ? Math.round(((parseFloat(thisWeekOpenRate) - parseFloat(lastWeekOpenRate)) / parseFloat(lastWeekOpenRate)) * 100)
      : parseFloat(thisWeekOpenRate) > 0 ? 100 : 0;

    // Produktivität (basierend auf erledigten Tasks)
    const productivity = tasks.length > 0
      ? Math.min(100, Math.round((completedThisWeek / Math.max(1, tasks.length)) * 100))
      : 0;
    
    const lastWeekProductivity = tasks.length > 0 && completedLastWeek > 0
      ? Math.min(100, Math.round((completedLastWeek / Math.max(1, tasks.length)) * 100))
      : 0;
    const productivityChange = lastWeekProductivity > 0
      ? Math.round(((productivity - lastWeekProductivity) / lastWeekProductivity) * 100)
      : productivity > 0 ? 100 : 0;

    return [
      {
        id: '1',
        title: 'Erledigte Tasks',
        value: completedThisWeek.toString(),
        change: tasksChange,
        isPositive: tasksChange >= 0,
        period: 'Diese Woche',
      },
      {
        id: '2',
        title: 'Durchschnittliche Zeit',
        value: `${avgTime}h`,
        change: avgTimeChange,
        isPositive: avgTimeChange <= 0, // Weniger Zeit = besser
        period: 'Pro Task',
      },
      {
        id: '3',
        title: 'Offene Dokumente',
        value: `${openDocsRate}%`,
        change: Math.abs(openDocsChange),
        isPositive: openDocsChange < 0, // Weniger offene Docs = besser
        period: 'Gesamt',
      },
      {
        id: '4',
        title: 'Produktivität',
        value: `${productivity}%`,
        change: productivityChange,
        isPositive: productivityChange >= 0,
        period: 'Durchschnitt',
      },
    ];
  }, [tasks, timeEntries, documents]);

  // Bereite Chart-Daten vor (letzte 7 Tage)
  const chartData = useMemo(() => {
    const last7Days = getLast7Days();
    
    return last7Days.map(({ date, dayShort }) => {
      const dayTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        return task.due_date === date;
      }).length;

      const dayCompleted = tasks.filter(task => {
        if (!task.completed || !task.updated_at) return false;
        const taskDate = new Date(task.updated_at).toISOString().split('T')[0];
        return taskDate === date;
      }).length;

      const dayTimeEntries = timeEntries.filter(entry => entry.date === date).length;

      return {
        day: dayShort,
        tasks: dayTasks,
        completed: dayCompleted,
        timeEntries: dayTimeEntries,
      };
    });
  }, [tasks, timeEntries]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchTasks(),
        refetchTimeEntries(),
        refetchDocuments(),
      ]);
      toast({
        title: 'Aktualisiert',
        description: 'Dashboard-Daten wurden aktualisiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Daten konnten nicht aktualisiert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Prepare export data
  const exportData = kpiCards.map(kpi => ({
    Titel: kpi.title,
    Wert: kpi.value,
    Änderung: `${kpi.change}%`,
    Trend: kpi.isPositive ? 'Positiv' : 'Negativ',
    Zeitraum: kpi.period,
  }));

  if (isLoading && !tasks.length && !timeEntries.length && !documents.length) {
    return (
      <div className="space-y-6 animate-fade-in pt-4 pb-20">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pt-4 pb-20">
      {hasError && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">
            Einige Daten konnten nicht geladen werden. Bitte versuche es später erneut.
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboards</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Deine wichtigsten Kennzahlen
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Aktualisieren"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
          <ExportButton
            data={exportData}
            filename="dashboard-kpis"
            variant="outline"
            size="default"
          />
          <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 md:p-6 rounded-xl bg-card border border-border"
          >
            <p className="text-xs text-muted-foreground">{kpi.title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.isPositive ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={cn(
                'text-xs font-medium',
                kpi.isPositive ? 'text-green-500' : 'text-red-500'
              )}>
                {kpi.change}%
              </span>
              <span className="text-xs text-muted-foreground">{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Activity Chart */}
      <div className="p-4 md:p-6 rounded-xl bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-base md:text-lg">Aktivität</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Letzte 7 Tage</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="day" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="tasks" fill="hsl(var(--primary))" name="Tasks" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="hsl(var(--green-500))" name="Erledigt" radius={[4, 4, 0, 0]} />
            <Bar dataKey="timeEntries" fill="hsl(var(--blue-500))" name="Zeitbuchungen" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Additional Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasks Trend */}
        <div className="p-4 md:p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base md:text-lg">Tasks Trend</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Letzte 7 Tage</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="tasks" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.2}
                name="Tasks"
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--green-500))" 
                fill="hsl(var(--green-500))" 
                fillOpacity={0.2}
                name="Erledigt"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Time Entries Trend */}
        <div className="p-4 md:p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base md:text-lg">Zeitbuchungen</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Letzte 7 Tage</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="timeEntries" 
                stroke="hsl(var(--blue-500))" 
                strokeWidth={2}
                name="Zeitbuchungen"
                dot={{ fill: 'hsl(var(--blue-500))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardsPage;
