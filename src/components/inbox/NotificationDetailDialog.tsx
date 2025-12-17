import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Bot, Bell, ArrowLeft, Reply, Forward, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/supabase-queries';

interface NotificationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: Notification | null;
}

export function NotificationDetailDialog({ open, onOpenChange, notification }: NotificationDetailDialogProps) {
  if (!notification) return null;

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
    return time.toLocaleString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Icon = getNotificationIcon(notification.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
              notification.type === 'document' && 'bg-blue-500/10 text-blue-500',
              notification.type === 'workflow' && 'bg-green-500/10 text-green-500',
              notification.type === 'ai' && 'bg-purple-500/10 text-purple-500',
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <DialogTitle>{notification.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {formatTime(notification.time)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Content */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {notification.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Typ</p>
              <p className="font-medium capitalize">{notification.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">
                {notification.unread ? 'Ungelesen' : 'Gelesen'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1">
              <Reply className="w-4 h-4 mr-2" />
              Antworten
            </Button>
            <Button variant="outline" className="flex-1">
              <Forward className="w-4 h-4 mr-2" />
              Weiterleiten
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}





