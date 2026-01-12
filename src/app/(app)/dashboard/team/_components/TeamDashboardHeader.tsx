"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Moon, Sun, PanelLeft, PanelLeftClose, LayoutDashboard, Zap, Workflow, Clock, BarChart3, Plug, Inbox, FileText, Square, FileEdit, Building2, Mail, Target, Timer, Users, Bot, MessageSquare, Settings, HelpCircle, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  "/dashboard/team": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/team/enterprise": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/team/workflows": { title: "Workflows", subtitle: "Manage your automation workflows" },
  "/dashboard/team/workflows/marketing": { title: "Marketing Workflows", subtitle: "Automate your marketing campaigns" },
  "/dashboard/team/workflows/invoicing": { title: "Invoicing Workflows", subtitle: "Automate invoice processes" },
  "/dashboard/team/workflows/custom": { title: "Custom Workflows", subtitle: "Create custom automations" },
  "/dashboard/team/triggers": { title: "Triggers", subtitle: "Schedule and event triggers" },
  "/dashboard/team/analytics": { title: "Analytics", subtitle: "Performance insights" },
  "/dashboard/team/integrations": { title: "Integrations", subtitle: "Connected services" },
  "/dashboard/team/inbox": { title: "Posteingang", subtitle: "E-Mails verwalten" },
  "/dashboard/team/documents": { title: "Dokumente", subtitle: "Dokumente verwalten und organisieren" },
  "/dashboard/team/whiteboards": { title: "Whiteboard", subtitle: "Kollaboratives Zeichenbrett" },
  "/dashboard/team/forms": { title: "Formulare", subtitle: "Formulare erstellen und verwalten" },
  "/dashboard/team/customers": { title: "Kunden", subtitle: "Kunden-Datenbank verwalten" },
  "/dashboard/team/mail": { title: "Mail", subtitle: "E-Mails senden und verwalten" },
  "/dashboard/team/goals": { title: "Ziele", subtitle: "Ziele verfolgen und Meilensteine erreichen" },
  "/dashboard/team/timesheets": { title: "Zeiterfassung", subtitle: "Arbeitszeit verfolgen" },
  "/dashboard/team/teams": { title: "Team", subtitle: "Team management" },
  "/dashboard/team/ai-assistant": { title: "AI Assistant", subtitle: "Your AI helper" },
  "/dashboard/team/chatbots": { title: "Chatbots", subtitle: "KI-Chatbots verwalten" },
  "/dashboard/team/background-demo": { title: "Hintergrund-Demo", subtitle: "Teste verschiedene Hintergrund-Stile" },
  "/dashboard/team/settings": { title: "Settings", subtitle: "Account preferences" },
  "/dashboard/team/automations": { title: "Automations", subtitle: "Create and manage automations" },
};

interface TeamDashboardHeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
  plan: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  sidebarWidth?: number;
}

export function TeamDashboardHeader({ 
  onMenuClick, 
  isMobile, 
  plan,
  sidebarCollapsed = false,
  onToggleSidebar,
  sidebarWidth = 256
}: TeamDashboardHeaderProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isDark, setIsDark] = useState(false); // Initial state, will be synced after mount
  const [mounted, setMounted] = useState(false); // Track if component is mounted
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Quick Search (Cmd+K / Ctrl+K)
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }
      
      // Escape to close modals/dialogs
      if (e.key === "Escape") {
        if (commandOpen) {
          setCommandOpen(false);
        }
        if (notificationsOpen) {
          setNotificationsOpen(false);
        }
        return;
      }
      
      // Navigation shortcuts (only when not in input/textarea)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      
      // Ctrl+G+D = Dashboard
      if (e.key === "d" && e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        router.push("/dashboard/team/enterprise");
        return;
      }
      
      // Ctrl+G+W = Workflows
      if (e.key === "w" && e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        router.push("/dashboard/team/workflows/marketing");
        return;
      }
      
      // Ctrl+G+I = Integrations
      if (e.key === "i" && e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        router.push("/dashboard/team/integrations");
        return;
      }
      
      // Ctrl+G+S = Settings
      if (e.key === "s" && e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        router.push("/dashboard/team/settings");
        return;
      }
    };
    
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () => document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [commandOpen, notificationsOpen, router]);
  
  // Synchronisiere State mit dark class (nur nach dem Mount)
  useEffect(() => {
    if (!mounted) return;
    
    const checkDarkMode = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme) {
        setIsDark(currentTheme === 'dark');
      } else {
        const savedTheme = localStorage.getItem('arvo-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        setIsDark(theme === 'dark');
      }
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme) {
        setIsDark(theme === 'dark');
      } else {
        checkDarkMode();
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    return () => observer.disconnect();
  }, [mounted]);
  
  const getCurrentPage = () => {
    // Prüfe auf exakte Routes
    if (pathname && pageTitles[pathname]) {
      return pageTitles[pathname];
    }
    
    // Prüfe auf Route-Patterns
    if (pathname?.startsWith("/dashboard/team/workflows/marketing")) {
      return pageTitles["/dashboard/team/workflows/marketing"];
    }
    if (pathname?.startsWith("/dashboard/team/workflows/invoicing")) {
      return pageTitles["/dashboard/team/workflows/invoicing"];
    }
    if (pathname?.startsWith("/dashboard/team/workflows/custom")) {
      return pageTitles["/dashboard/team/workflows/custom"];
    }
    if (pathname?.startsWith("/dashboard/team/workflows")) {
      return pageTitles["/dashboard/team/workflows"];
    }
    if (pathname?.startsWith("/dashboard/team/enterprise")) {
      return pageTitles["/dashboard/team/enterprise"];
    }
    
    // Fallback auf Dashboard
    return pageTitles["/dashboard/team/enterprise"] || { title: "Dashboard", subtitle: "Welcome back" };
  };
  
  const currentPage = getCurrentPage();

  const toggleTheme = () => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || localStorage.getItem('arvo-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const newIsDark = newTheme === 'dark';
    
    root.setAttribute('data-theme', newTheme);
    root.classList.remove('dark', 'light');
    root.classList.add(newTheme);
    localStorage.setItem('arvo-theme', newTheme);
    
    setIsDark(newIsDark);
    
    toast({
      title: "Theme geändert",
      description: `${newIsDark ? 'Dark' : 'Light'} Mode aktiviert`,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Suche",
        description: `Suche nach: ${searchQuery}`,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Format time from Date
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Gerade eben";
    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    if (days < 7) return `vor ${days} Tagen`;
    return date.toLocaleDateString("de-DE");
  };

  // Handler für Klick auf einzelne Benachrichtigung
  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setNotificationsOpen(false);
    }
  };

  const badgeText = unreadCount > 9 ? "9+" : unreadCount.toString();

  // Glassmorphism styles based on theme - wie UserDashboardHeader
  const isDarkMode = mounted && isDark;
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

  // Wenn Sidebar collapsed ist, zeige zwei separate Header
  if (sidebarCollapsed && !isMobile) {
    return (
      <>
        {/* Linker Header: Dashboard + Searchbar */}
        <header 
          className="min-h-[4rem] flex items-center gap-8 px-5 shrink-0 fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] py-3 relative overflow-visible rounded-2xl"
          style={{
            left: `${sidebarWidth + 20}px`,
            width: `calc(100vw - ${sidebarWidth + 20}px - 160px - 40px - 37.8px)`,
            maxWidth: '780px',
            minWidth: '400px',
            top: '20px',
            height: '64px',
            paddingTop: '12px',
            paddingBottom: '12px',
            ...headerStyles,
          }}
        >
          {/* Glow-Effekte */}
          <div 
            className="absolute -inset-[6px] rounded-2xl opacity-100 transition-opacity duration-700 blur-[40px] -z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
              opacity: '0.3',
            }}
          />
          <div 
            className="absolute inset-0 opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.04) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(236, 72, 153, 0.03) 100%)',
            }}
          />
          
          <div className="flex items-center gap-2 min-w-0 relative z-10 shrink-0">
            <div className="min-w-0 flex flex-col justify-center shrink-0">
              <h1 
                className="text-lg md:text-xl font-semibold truncate leading-tight m-0 p-0"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {currentPage.title}
              </h1>
              <p 
                className="text-xs md:text-sm truncate hidden md:block leading-tight m-0 p-0 mt-0.5 font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {currentPage.subtitle}
              </p>
            </div>
          </div>

          {/* Searchbar */}
          <div className="relative z-10 shrink-0" style={{ width: '360px', minWidth: '360px', maxWidth: '360px' }}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
              <Input
                placeholder="Search workflows, triggers..."
                className="pl-10 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-default)',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setCommandOpen(true)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-default)' }}>
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </form>
          </div>
        </header>

        {/* Rechter Header: Theme + Benachrichtigungen + Profil */}
        <header 
          className="min-h-[4rem] flex items-center justify-end gap-2 px-3 shrink-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] py-3 rounded-2xl"
          style={{
            position: 'fixed',
            right: '40px',
            top: '20px',
            left: 'auto',
            bottom: 'auto',
            width: 'auto',
            maxWidth: '160px',
            height: '64px',
            paddingTop: '12px',
            paddingBottom: '12px',
            margin: 0,
            transform: 'none',
            boxSizing: 'border-box',
            ...headerStyles,
          }}
        >
          {/* Glow-Effekte */}
          <div 
            className="absolute -inset-[6px] rounded-2xl opacity-100 transition-opacity duration-700 blur-[40px] -z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
              opacity: '0.3',
            }}
          />
          <div 
            className="absolute inset-0 opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.04) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(236, 72, 153, 0.03) 100%)',
            }}
          />
          
          <div className="flex items-center gap-2 shrink-0 relative z-10" style={{ width: 'auto', flexShrink: 0 }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-[#f8fafc]/90 dark:hover:bg-[#1e293b]/90 transition-all duration-300"
              onClick={toggleTheme}
              aria-label={mounted && isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
            >
              {mounted && isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{mounted && isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}</p>
          </TooltipContent>
        </Tooltip>

        {mounted ? (
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative h-9 w-9 rounded-xl hover:bg-[#f8fafc]/90 dark:hover:bg-[#1e293b]/90 transition-all duration-300"
                    aria-label={`Benachrichtigungen${unreadCount > 0 ? ` (${unreadCount} ungelesen)` : ''}`}
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <div 
                        className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                        }}
                        aria-label={`${unreadCount} ungelesene Benachrichtigungen`}
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9"
            aria-label="Benachrichtigungen"
            disabled
          >
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
                    className="relative h-9 w-9 rounded-full p-0 transition-all duration-300 hover:scale-110"
                    aria-label={`Benutzer-Menü für ${user?.fullName || "Benutzer"}`}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#ec4899] blur-md opacity-50" />
                      <Avatar className="h-9 w-9 relative ring-2 ring-white/20 dark:ring-white/10">
                        <AvatarImage src={user?.imageUrl || undefined} alt={user?.fullName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#ec4899] text-white font-medium">
                          {user?.fullName 
                            ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
                            : user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
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
            <DropdownMenuItem onClick={() => router.push("/dashboard/team/settings")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Billing",
                description: "Billing-Seite wird geöffnet...",
              });
            }}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/team/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        ) : (
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full p-0"
            aria-label="Benutzer-Menü"
            disabled
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">U</AvatarFallback>
            </Avatar>
          </Button>
        )}
          </div>
        </header>

        {/* Quick Search Command Dialog */}
        {mounted && (
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Suchen Sie nach Seiten, Workflows, Integrationen..." />
            <CommandList>
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
              
              <CommandGroup heading="Seiten">
                <CommandItem onSelect={() => { router.push("/dashboard/team/enterprise"); setCommandOpen(false); }}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/automations"); setCommandOpen(false); }}>
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Automations</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/workflows/marketing"); setCommandOpen(false); }}>
                  <Workflow className="mr-2 h-4 w-4" />
                  <span>Workflows</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/triggers"); setCommandOpen(false); }}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Triggers</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/analytics"); setCommandOpen(false); }}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/integrations"); setCommandOpen(false); }}>
                  <Plug className="mr-2 h-4 w-4" />
                  <span>Integrations</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/customers"); setCommandOpen(false); }}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Kunden</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/teams"); setCommandOpen(false); }}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/chatbots"); setCommandOpen(false); }}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Chatbots</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/ai-assistant"); setCommandOpen(false); }}>
                  <Bot className="mr-2 h-4 w-4" />
                  <span>AI Assistant</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/background-demo"); setCommandOpen(false); }}>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Hintergrund-Demo</span>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Weitere">
                <CommandItem onSelect={() => { router.push("/dashboard/team/inbox"); setCommandOpen(false); }}>
                  <Inbox className="mr-2 h-4 w-4" />
                  <span>Posteingang</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/documents"); setCommandOpen(false); }}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Dokumente</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/whiteboards"); setCommandOpen(false); }}>
                  <Square className="mr-2 h-4 w-4" />
                  <span>Whiteboard</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/forms"); setCommandOpen(false); }}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Formulare</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/mail"); setCommandOpen(false); }}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Mail</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/goals"); setCommandOpen(false); }}>
                  <Target className="mr-2 h-4 w-4" />
                  <span>Ziele</span>
                </CommandItem>
                <CommandItem onSelect={() => { router.push("/dashboard/team/timesheets"); setCommandOpen(false); }}>
                  <Timer className="mr-2 h-4 w-4" />
                  <span>Zeiterfassung</span>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Einstellungen">
                <CommandItem onSelect={() => { router.push("/dashboard/team/settings"); setCommandOpen(false); }}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => {
                  toast({
                    title: "Help & Support",
                    description: "Hilfe-Seite wird geöffnet...",
                  });
                  setCommandOpen(false);
                }}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        )}
      </>
    );
  }

  // Normale zusammengeführte Header-Bar (wenn Sidebar nicht collapsed ist)
  return (
    <>
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
        {/* Left Section */}
        <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl hover:bg-[#f8fafc]/90 dark:hover:bg-[#1e293b]/90"
              onClick={onMenuClick}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0 flex flex-col justify-center">
            {/* Titel */}
            <h1 
              className="text-lg md:text-xl font-semibold truncate leading-tight m-0 p-0"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {currentPage.title}
            </h1>
            {/* Subtitle */}
            <p 
              className="text-xs md:text-sm truncate hidden md:block leading-tight m-0 p-0 mt-0.5 font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block relative z-10">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
            <Input
              placeholder="Search workflows, triggers..."
              className="pl-10 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-default)',
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setCommandOpen(true)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-default)' }}>
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0 relative z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-[#f8fafc]/90 dark:hover:bg-[#1e293b]/90 transition-all duration-300"
                onClick={toggleTheme}
                aria-label={mounted && isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
              >
                {mounted && isDark ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mounted && isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}</p>
            </TooltipContent>
          </Tooltip>

          {mounted ? (
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative h-9 w-9 rounded-xl hover:bg-[#f8fafc]/90 dark:hover:bg-[#1e293b]/90 transition-all duration-300"
                      aria-label={`Benachrichtigungen${unreadCount > 0 ? ` (${unreadCount} ungelesen)` : ''}`}
                    >
                      <Bell className="h-5 w-5" aria-hidden="true" />
                      {unreadCount > 0 && (
                        <div 
                          className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                          }}
                          aria-label={`${unreadCount} ungelesene Benachrichtigungen`}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9"
              aria-label="Benachrichtigungen"
              disabled
            >
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
                      className="relative h-9 w-9 rounded-full p-0 transition-all duration-300 hover:scale-110"
                      aria-label={`Benutzer-Menü für ${user?.fullName || "Benutzer"}`}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#ec4899] blur-md opacity-50" />
                        <Avatar className="h-9 w-9 relative ring-2 ring-white/20 dark:ring-white/10">
                          <AvatarImage src={user?.imageUrl || undefined} alt={user?.fullName || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#ec4899] text-white font-medium">
                            {user?.fullName 
                              ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
                              : user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
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
                <DropdownMenuItem onClick={() => router.push("/dashboard/team/settings")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  toast({
                    title: "Billing",
                    description: "Billing-Seite wird geöffnet...",
                  });
                }}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/team/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              className="relative h-9 w-9 rounded-full p-0"
              aria-label="Benutzer-Menü"
              disabled
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">U</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </header>

      {/* Quick Search Command Dialog */}
      {mounted && (
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Suchen Sie nach Seiten, Workflows, Integrationen..." />
          <CommandList>
            <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
            
            <CommandGroup heading="Seiten">
              <CommandItem onSelect={() => { router.push("/dashboard/team/enterprise"); setCommandOpen(false); }}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/automations"); setCommandOpen(false); }}>
                <Zap className="mr-2 h-4 w-4" />
                <span>Automations</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/workflows/marketing"); setCommandOpen(false); }}>
                <Workflow className="mr-2 h-4 w-4" />
                <span>Workflows</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/triggers"); setCommandOpen(false); }}>
                <Clock className="mr-2 h-4 w-4" />
                <span>Triggers</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/analytics"); setCommandOpen(false); }}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/integrations"); setCommandOpen(false); }}>
                <Plug className="mr-2 h-4 w-4" />
                <span>Integrations</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/customers"); setCommandOpen(false); }}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Kunden</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/teams"); setCommandOpen(false); }}>
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/chatbots"); setCommandOpen(false); }}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chatbots</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/ai-assistant"); setCommandOpen(false); }}>
                <Bot className="mr-2 h-4 w-4" />
                <span>AI Assistant</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/background-demo"); setCommandOpen(false); }}>
                <Palette className="mr-2 h-4 w-4" />
                <span>Hintergrund-Demo</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Weitere">
              <CommandItem onSelect={() => { router.push("/dashboard/team/inbox"); setCommandOpen(false); }}>
                <Inbox className="mr-2 h-4 w-4" />
                <span>Posteingang</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/documents"); setCommandOpen(false); }}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Dokumente</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/whiteboards"); setCommandOpen(false); }}>
                <Square className="mr-2 h-4 w-4" />
                <span>Whiteboard</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/forms"); setCommandOpen(false); }}>
                <FileEdit className="mr-2 h-4 w-4" />
                <span>Formulare</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/mail"); setCommandOpen(false); }}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Mail</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/goals"); setCommandOpen(false); }}>
                <Target className="mr-2 h-4 w-4" />
                <span>Ziele</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/dashboard/team/timesheets"); setCommandOpen(false); }}>
                <Timer className="mr-2 h-4 w-4" />
                <span>Zeiterfassung</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Einstellungen">
              <CommandItem onSelect={() => { router.push("/dashboard/team/settings"); setCommandOpen(false); }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => {
                toast({
                  title: "Help & Support",
                  description: "Hilfe-Seite wird geöffnet...",
                });
                setCommandOpen(false);
              }}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      )}
    </>
  );
}
