import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, CheckCheck, Trash2, Settings, X } from "lucide-react";
import { useNotifications, type NotificationType } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
  } = useNotifications();

  const [selectedTab, setSelectedTab] = useState<"all" | NotificationType>("all");

  const filteredNotifications =
    selectedTab === "all"
      ? notifications
      : getNotificationsByType(selectedTab);

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: de });
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "error":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "workflow":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Benachrichtigungen</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} ungelesene Benachrichtigungen
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Alle gelesen
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Alle löschen
            </Button>
          )}
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">Alle ({notifications.length})</TabsTrigger>
          <TabsTrigger value="workflow">Workflows ({getNotificationsByType("workflow").length})</TabsTrigger>
          <TabsTrigger value="system">System ({getNotificationsByType("system").length})</TabsTrigger>
          <TabsTrigger value="error">Fehler ({getNotificationsByType("error").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Keine Benachrichtigungen</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-md",
                    !notification.read && "border-primary/20 bg-primary/5"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "h-2 w-2 rounded-full mt-2 shrink-0",
                        notification.read ? "bg-transparent" : "bg-primary"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            <Badge variant="outline" className={cn("text-xs", getTypeColor(notification.type))}>
                              {notification.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {notification.actionLabel && notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 h-auto p-0 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            {notification.actionLabel} →
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

