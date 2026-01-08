import React from 'react';
import { MessageCircle, FileText, Users, Mail, Bot, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getNotifications, type Notification } from '@/lib/supabase-queries';
import { useUser } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/query-keys';
import { formatTimeAgo } from '@/lib/time-utils';

export function ActivityCard() {
  const { isLoaded } = useUser();

  // Lade Notifications aus Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => getNotifications(),
    enabled: isLoaded,
    staleTime: 30000,
  });

  // Zeige die letzten 4 Notifications
  const recentNotifications = notifications.slice(0, 4);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'workflow':
        return CheckCircle2;
      case 'ai':
        return Bot;
      case 'task':
        return CheckCircle2;
      default:
        return MessageCircle;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return 'bg-blue-500/10 text-blue-500';
      case 'workflow':
        return 'bg-green-500/10 text-green-500';
      case 'ai':
        return 'bg-purple-500/10 text-purple-500';
      case 'task':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };


  if (isLoading) {
    return (
      <Card className="arvo-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <MessageCircle className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="arvo-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Keine Aktivitäten</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const color = getNotificationColor(notification.type);
              return (
                <li 
                  key={notification.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border border-border',
                    'transition-all duration-200 hover:border-primary/30 cursor-pointer',
                    notification.unread && 'border-l-2 border-l-primary'
                  )}
                >
                  <div className={cn('p-2 rounded-lg flex-shrink-0', color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.time)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
