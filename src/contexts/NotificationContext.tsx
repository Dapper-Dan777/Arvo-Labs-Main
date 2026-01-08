"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type NotificationType = "info" | "success" | "warning" | "error" | "workflow" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  category?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getNotificationsByCategory: (category: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = "notifications";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Lade gespeicherte Notifications
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, []);

  // Speichere Notifications bei Änderungen
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  }, [notifications]);

  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notificationData,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Zeige auch Toast-Notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant:
          newNotification.type === "error"
            ? "destructive"
            : newNotification.type === "success"
            ? "default"
            : "default",
      });

      // Browser-Notification (wenn erlaubt)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: "/favicon.ico",
        });
      }
    },
    [toast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  const getNotificationsByCategory = useCallback(
    (category: string) => {
      return notifications.filter((n) => n.category === category);
    },
    [notifications]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Request Browser Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      // Optional: Automatisch anfragen (kann auch manuell gemacht werden)
      // Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getNotificationsByType,
        getNotificationsByCategory,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

