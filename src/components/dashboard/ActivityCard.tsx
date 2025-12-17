import React from 'react';
import { MessageCircle, FileText, Users, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ANPASSEN: Aktivitäten hier anpassen oder aus API laden
const mockActivities = [
  { 
    id: 1, 
    type: 'message', 
    icon: MessageCircle, 
    title: 'Neue Nachricht von Anna', 
    time: 'vor 5 Min.', 
    color: 'bg-blue-500/10 text-blue-500' 
  },
  { 
    id: 2, 
    type: 'document', 
    icon: FileText, 
    title: 'Dokument "Q4 Report" wurde geteilt', 
    time: 'vor 15 Min.', 
    color: 'bg-green-500/10 text-green-500' 
  },
  { 
    id: 3, 
    type: 'team', 
    icon: Users, 
    title: 'Einladung zu Team "Marketing"', 
    time: 'vor 1 Std.', 
    color: 'bg-purple-500/10 text-purple-500' 
  },
  { 
    id: 4, 
    type: 'mail', 
    icon: Mail, 
    title: 'E-Mail von support@example.com', 
    time: 'vor 2 Std.', 
    color: 'bg-orange-500/10 text-orange-500' 
  },
];

export function ActivityCard() {
  return (
    <Card className="arvo-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <li 
                key={activity.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border border-border',
                  'transition-all duration-200 hover:border-primary/30 cursor-pointer'
                )}
              >
                <div className={cn('p-2 rounded-lg flex-shrink-0', activity.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
