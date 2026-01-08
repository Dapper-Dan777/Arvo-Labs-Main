import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks, getTimeEntries, getDocuments, type Task, type TimeEntry, type Document } from '@/lib/supabase-queries';
import { queryKeys } from '@/lib/query-keys';
import { getDateDaysAgo, isInLastWeek, getTodayISO } from '@/lib/date-utils';
import { parseDurationToHours, calculateTotalDuration } from '@/lib/time-utils';
import { useUser } from '@/contexts/AuthContext';

interface DashboardStats {
  completedTasksThisWeek: number;
  completedTasksLastWeek: number;
  tasksChange: number;
  pendingTasksToday: number;
  totalTimeEntries: number;
  totalHours: number;
  avgTimePerTask: number;
  completedDocuments: number;
  totalDocuments: number;
  productivity: number;
}

export function useDashboardStats() {
  const { isLoaded } = useUser();

  const { data: tasks = [] } = useQuery({
    queryKey: queryKeys.tasks.list(),
    queryFn: () => getTasks(),
    enabled: isLoaded,
    staleTime: 30000,
  });

  const { data: timeEntries = [] } = useQuery({
    queryKey: queryKeys.timeEntries.list(),
    queryFn: () => getTimeEntries(),
    enabled: isLoaded,
    staleTime: 30000,
  });

  const { data: documents = [] } = useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: () => getDocuments(),
    enabled: isLoaded,
    staleTime: 30000,
  });

  const stats = useMemo((): DashboardStats => {
    const now = new Date();
    const weekAgo = getDateDaysAgo(7);
    const twoWeeksAgo = getDateDaysAgo(14);

    // Tasks-Berechnungen
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

    const pendingTasksToday = tasks.filter(task => {
      if (task.completed) return false;
      if (!task.due_date) return false;
      return task.due_date === getTodayISO();
    }).length;

    // Time Entries Berechnungen
    const durations = timeEntries.map(entry => entry.duration);
    const totalMinutes = calculateTotalDuration(durations);
    const totalHours = totalMinutes / 60;
    const avgTimePerTask = tasks.length > 0 ? totalHours / tasks.length : 0;

    // Documents Berechnungen
    const completedDocuments = documents.filter(doc => doc.status === 'Fertig').length;
    const totalDocuments = documents.length;

    // Produktivität (basierend auf erledigten Tasks und Gesamt-Tasks)
    const productivity = tasks.length > 0
      ? Math.min(100, Math.round((completedThisWeek / Math.max(1, tasks.length)) * 100))
      : 0;

    return {
      completedTasksThisWeek,
      completedTasksLastWeek,
      tasksChange,
      pendingTasksToday,
      totalTimeEntries: timeEntries.length,
      totalHours,
      avgTimePerTask,
      completedDocuments,
      totalDocuments,
      productivity,
    };
  }, [tasks, timeEntries, documents]);

  return {
    stats,
    isLoading: !isLoaded,
    tasks,
    timeEntries,
    documents,
  };
}
