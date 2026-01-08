"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useUser, useClerk } from "@clerk/nextjs";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard/user": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/user/starter": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/user/pro": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/user/enterprise": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/user/analytics": { title: "Analytics", subtitle: "Performance insights" },
  "/dashboard/user/whiteboards": { title: "Whiteboard", subtitle: "Kollaboratives Zeichenbrett" },
  "/dashboard/user/goals": { title: "Ziele", subtitle: "Ziele verfolgen und Meilensteine erreichen" },
  "/dashboard/user/timesheets": { title: "Zeiterfassung", subtitle: "Arbeitszeit verfolgen" },
  "/dashboard/user/ai-assistant": { title: "AI Assistant", subtitle: "Your AI helper" },
  "/dashboard/user/automations": { title: "Automations", subtitle: "Create and manage automations" },
  "/dashboard/user/integrations": { title: "Integrations", subtitle: "Connected services" },
  "/dashboard/user/documents": { title: "Dokumente", subtitle: "Dokumente verwalten und organisieren" },
  "/dashboard/user/chatbots": { title: "Chatbots", subtitle: "KI-Chatbots verwalten" },
  "/dashboard/user/workflows": { title: "Workflows", subtitle: "Manage your automation workflows" },
  "/dashboard/user/triggers": { title: "Triggers", subtitle: "Schedule and event triggers" },
  "/dashboard/user/inbox": { title: "Posteingang", subtitle: "E-Mails verwalten" },
  "/dashboard/user/forms": { title: "Formulare", subtitle: "Formulare erstellen und verwalten" },
  "/dashboard/user/customers": { title: "Kunden", subtitle: "Kunden-Datenbank verwalten" },
  "/dashboard/user/mail": { title: "Mail", subtitle: "E-Mails senden und verwalten" },
  "/dashboard/user/settings": { title: "Settings", subtitle: "Account preferences" },
  "/dashboard/user/more": { title: "Mehr", subtitle: "Additional features" },
  "/dashboard/design-showcase": { title: "Design Showcase", subtitle: "Premium Design System" },
};

interface UserDashboardHeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
  plan: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  sidebarWidth?: number;
}

export function UserDashboardHeader({ 
  onMenuClick, 
  isMobile, 
  plan,
  sidebarCollapsed = false,
  onToggleSidebar,
  sidebarWidth = 256
}: UserDashboardHeaderProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isDark, setIsDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const checkDarkMode = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme) {
          setIsDark(currentTheme === 'dark');
          setIsDarkMode(currentTheme === 'dark');
        } else {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDark(isDark);
          setIsDarkMode(isDark);
        }
      };
      
      checkDarkMode();
      
      const observer = new MutationObserver(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme) {
          setIsDark(theme === 'dark');
          setIsDarkMode(theme === 'dark');
        } else {
          checkDarkMode();
        }
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
      
      return () => observer.disconnect();
    }
  }, [mounted]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 
      (root.classList.contains('dark') ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('arvo-theme', newTheme);
    setIsDark(newTheme === 'dark');
    setIsDarkMode(newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Abmelden ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
    setNotificationsOpen(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    if (days < 7) return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
    return date.toLocaleDateString('de-DE');
  };

  const badgeText = unreadCount > 9 ? '9+' : unreadCount.toString();

  const currentPage = pageTitles[pathname || ''] || { title: "Dashboard", subtitle: "Welcome back" };

  // Glassmorphism styles based on theme - ursprüngliche Farben
  const headerStyles = isDarkMode ? {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(255, 255, 255, 0.1)',
  } : {
    backgroundColor: 'rgba(241, 240, 238, 0.8)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(241, 240, 238, 0.8), inset 0 -1px 0 rgba(241, 240, 238, 0.2)',
  };

  return (
    <header
      className="min-h-[4rem] flex items-center justify-between px-6 shrink-0 gap-6 fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] py-3 relative overflow-visible rounded-2xl"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: `calc(100% - ${sidebarWidth}px - 80px)`,
        maxWidth: '1400px',
        top: '20px',
        ...headerStyles,
      }}
    >
      {/* Äußerer Glow-Effekt um die Box herum - reduziert */}
      <div 
        className="absolute -inset-[6px] rounded-2xl opacity-100 transition-opacity duration-700 blur-[40px] -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
          opacity: '0.3',
        }}
      />
      
      {/* Zusätzlicher äußerer Glow-Layer */}
      <div 
        className="absolute -inset-[4px] rounded-2xl opacity-100 transition-opacity duration-700 blur-[25px] -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
          opacity: '0.25',
        }}
      />
      
      {/* Weicherer äußerer Glow */}
      <div 
        className="absolute -inset-[3px] rounded-2xl opacity-100 transition-opacity duration-700 blur-xl -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
          opacity: '0.2',
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.04) 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(236, 72, 153, 0.03) 100%)',
        }}
      />
      
      {/* Inner highlight for glass effect */}
      <div 
        className="absolute inset-0 opacity-100 pointer-events-none rounded-2xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Additional glass reflection */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 opacity-50 pointer-events-none rounded-t-2xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)',
        }}
      />
      
      <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="shrink-0 rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-secondary)',
            }}
          >
            <Menu className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <div className="min-w-0 flex flex-col justify-center space-y-0.5">
          <h1 
            className="text-base md:text-lg font-semibold truncate leading-tight m-0 p-0 tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {currentPage.title}
          </h1>
          <p 
            className="text-xs truncate hidden md:block leading-tight m-0 p-0 font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md hidden md:block relative z-10">
        <form className="relative">
          <Search 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300" 
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <Input
            placeholder="Search..."
            className="pl-11 pr-4 h-10 text-sm transition-all duration-300 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)]/20 focus:border-[var(--color-primary-start)]/30"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'var(--color-bg-secondary)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0 relative z-10">
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl transition-all duration-300 hover:scale-110"
                onClick={toggleTheme}
                aria-label={isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-secondary)',
                }}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }} />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {mounted ? (
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-xl transition-all duration-300 hover:scale-110"
                    aria-label={`Benachrichtigungen${unreadCount > 0 ? ` (${unreadCount} ungelesen)` : ''}`}
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-secondary)',
                    }}
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }} />
                    {unreadCount > 0 && (
                      <span 
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
                        }}
                      />
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Benachrichtigungen{unreadCount > 0 ? ` (${unreadCount})` : ''}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <span>Benachrichtigungen</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">{badgeText}</Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Keine Benachrichtigungen
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex flex-col items-start p-3 cursor-pointer transition-all",
                        notification.read
                          ? "opacity-60 bg-muted/30 hover:bg-muted/50"
                          : "bg-primary/5 dark:bg-primary/10 border-l-2 border-primary hover:bg-primary/10"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between w-full gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-[0.9375rem] font-semibold",
                            notification.read ? "text-muted-foreground" : "text-foreground"
                          )}>
                            {notification.title}
                          </p>
                          <p className={cn(
                            "text-sm mt-1",
                            notification.read ? "text-muted-foreground/80" : "text-muted-foreground"
                          )}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/80 mt-1">{formatTime(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center cursor-pointer"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Alle als gelesen markieren
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl" disabled>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}

        {mounted ? (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-xl p-0 overflow-hidden transition-all duration-300 hover:scale-110"
                    aria-label={`Benutzer-Menü für ${user?.fullName || "Benutzer"}`}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 opacity-50 blur-lg transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                      }}
                    />
                    <Avatar className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--color-primary-start)] via-[var(--color-primary-middle)] to-[var(--color-primary-end)] shadow-lg">
                      <AvatarImage src={user?.imageUrl || undefined} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-transparent text-white font-semibold text-xs">
                        {user?.fullName
                          ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.fullName || "Benutzer"}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/user/settings")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/user/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0" disabled>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">U</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </header>
  );
}
