import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ANPASSEN: Tasks hier anpassen oder aus API laden
const mockTasks = [
  { id: 1, title: 'Projektplanung abschließen', dueTime: '10:00', completed: false, priority: 'high' },
  { id: 2, title: 'Meeting mit Team', dueTime: '14:00', completed: false, priority: 'medium' },
  { id: 3, title: 'Dokumentation aktualisieren', dueTime: '16:00', completed: true, priority: 'low' },
];

export function TasksCard() {
  return (
    <Card className="arvo-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Heute fällige Tasks</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {mockTasks.filter(t => !t.completed).length} offen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockTasks.map((task) => (
            <li 
              key={task.id}
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{task.dueTime}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
