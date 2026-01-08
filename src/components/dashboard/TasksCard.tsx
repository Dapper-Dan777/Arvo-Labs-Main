import React, { useMemo } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, updateTask, type Task } from '@/lib/supabase-queries';
import { useUser } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/query-keys';
import { getTodayISO } from '@/lib/date-utils';

export function TasksCard() {
  const { isLoaded } = useUser();
  const queryClient = useQueryClient();

  // Lade Tasks aus Supabase
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: queryKeys.tasks.list(),
    queryFn: () => getTasks(),
    enabled: isLoaded,
    staleTime: 30000,
  });

  // Mutation zum Aktualisieren von Tasks mit Optimistic Update
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.list() });

      // Snapshot des vorherigen Werts
      const previousTasks = queryClient.getQueryData<Task[]>(queryKeys.tasks.list());

      // Optimistic Update
      queryClient.setQueryData<Task[]>(queryKeys.tasks.list(), (old) => {
        if (!old) return old;
        return old.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      });

      // Return context mit Snapshot
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback bei Fehler
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.list(), context.previousTasks);
      }
    },
    onSettled: () => {
      // Immer refetch nach Mutation (für Konsistenz)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list() });
    },
  });

  // Filtere Tasks für heute (memoized)
  const todayTasks = useMemo(() => {
    const today = getTodayISO();
    return tasks.filter(task => {
      if (task.completed) return false;
      if (!task.due_date) return false;
      return task.due_date === today;
    }).slice(0, 5); // Zeige max. 5 Tasks
  }, [tasks]);

  const handleToggleComplete = (task: Task) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      updates: { completed: !task.completed },
    });
  };

  if (isLoading) {
    return (
      <Card className="arvo-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Heute fällige Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Circle className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="arvo-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Heute fällige Tasks</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {todayTasks.length} offen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <Circle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Keine Tasks für heute</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todayTasks.map((task) => (
              <li 
                key={task.id}
                onClick={() => handleToggleComplete(task)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border border-border',
                  'transition-all duration-200 hover:border-primary/30 cursor-pointer',
                  task.completed && 'opacity-60'
                )}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className={cn(
                    'w-5 h-5 flex-shrink-0',
                    task.priority === 'high' && 'text-destructive',
                    task.priority === 'medium' && 'text-yellow-500',
                    task.priority === 'low' && 'text-muted-foreground'
                  )} />
                )}
                <span className={cn(
                  'flex-1 text-sm',
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                )}>
                  {task.title}
                </span>
                {task.due_time && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{task.due_time}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
