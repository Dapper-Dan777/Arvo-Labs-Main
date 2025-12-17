import React, { useState, useMemo } from 'react';
import { Bell, FileText, CheckCircle2, Bot, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getNotifications, markNotificationAsRead, type Notification } from '@/lib/supabase-queries';
import { NotificationDetailDialog } from '@/components/inbox/NotificationDetailDialog';

// ============================================================
// INBOX PAGE
// Benachrichtigungen und Aktivitäten mit Filter-Funktionalität
// ============================================================

type FilterType = 'Alle' | 'Ungelesen' | 'Dokumente' | 'Workflows' | 'KI';

// Fallback-Daten, falls Supabase noch nicht konfiguriert ist
const FALLBACK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'document',
    title: 'Neues Dokument geteilt',
    description: 'Anna hat "Q4 Report" mit dir geteilt. Das Dokument enthält wichtige Informationen für das Q4-Review-Meeting nächste Woche. Bitte überprüfe die Daten und gib Feedback bis Freitag.',
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unread: true,
    user_id: 'demo-user-123',
  },
  {
    id: '2',
    type: 'workflow',
    title: 'Workflow abgeschlossen',
    description: 'Automatisierung "E-Mail zu Task" erfolgreich ausgeführt. 3 neue Tasks wurden aus E-Mails erstellt und deinem Dashboard hinzugefügt.',
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unread: true,
    user_id: 'demo-user-123',
  },
  {
    id: '3',
    type: 'ai',
    title: 'KI-Assistent Hinweis',
    description: 'Ich habe 3 ähnliche Aufgaben gefunden, die zusammengefasst werden könnten: "Meeting vorbereiten", "Meeting-Agenda erstellen" und "Meeting-Notizen". Soll ich diese zusammenführen?',
    time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unread: true,
    user_id: 'demo-user-123',
  },
  {
    id: '4',
    type: 'document',
    title: 'Dokument aktualisiert',
    description: 'Max hat Änderungen an "Projektplan" vorgenommen. Die Änderungen betreffen die Timeline für Q1 2025.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: false,
    user_id: 'demo-user-123',
  },
  {
    id: '5',
    type: 'workflow',
    title: 'Neuer Task erstellt',
    description: 'Automatisch aus E-Mail: "Meeting Vorbereitung". Der Task wurde deiner Aufgabenliste hinzugefügt.',
    time: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    unread: false,
    user_id: 'demo-user-123',
  },
];

const InboxPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Alle');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    retry: false,
  });

  // Use fallback data if no data from Supabase
  const allNotifications = notifications.length > 0 ? notifications : FALLBACK_NOTIFICATIONS;

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    let result = [...allNotifications];

    switch (activeFilter) {
      case 'Ungelesen':
        result = result.filter(n => n.unread);
        break;
      case 'Dokumente':
        result = result.filter(n => n.type === 'document');
        break;
      case 'Workflows':
        result = result.filter(n => n.type === 'workflow');
        break;
      case 'KI':
        result = result.filter(n => n.type === 'ai');
        break;
      case 'Alle':
      default:
        break;
    }

    return result;
  }, [allNotifications, activeFilter]);

  const unreadCount = allNotifications.filter(n => n.unread).length;

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
    
    if (notification.unread) {
      await markNotificationAsRead(notification.id);
      // Optimistic update
      const index = allNotifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        allNotifications[index].unread = false;
      }
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'workflow':
        return CheckCircle2;
      case 'ai':
        return Bot;
      default:
        return Bell;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `Vor ${diffMins} Minuten`;
    if (diffHours < 24) return `Vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    return time.toLocaleDateString('de-DE');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex items-center justify-center py-12">
          <Bell className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Posteingang</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount} ungelesene Benachrichtigung{unreadCount !== 1 ? 'en' : ''}
            </p>
          </div>
          <Bell className="w-6 h-6 text-muted-foreground" />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['Alle', 'Ungelesen', 'Dokumente', 'Workflows', 'KI'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                'transition-colors duration-200',
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
              aria-label={`Filter: ${filter}`}
            >
              {filter}
              {filter === 'Ungelesen' && unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Keine Benachrichtigungen</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilter !== 'Alle' 
                ? `Keine ${activeFilter.toLowerCase()} Benachrichtigungen`
                : 'Du hast keine Benachrichtigungen'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-xl',
                    'bg-card border border-border',
                    'transition-all duration-200 cursor-pointer',
                    'hover:border-primary/30',
                    notification.unread && 'border-l-2 border-l-primary'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    notification.type === 'document' && 'bg-blue-500/10 text-blue-500',
                    notification.type === 'workflow' && 'bg-green-500/10 text-green-500',
                    notification.type === 'ai' && 'bg-purple-500/10 text-purple-500',
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        'font-medium text-foreground',
                        notification.unread && 'font-semibold'
                      )}>
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.time)}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Detail Dialog */}
      <NotificationDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        notification={selectedNotification}
      />
    </>
  );
};

export default InboxPage;
