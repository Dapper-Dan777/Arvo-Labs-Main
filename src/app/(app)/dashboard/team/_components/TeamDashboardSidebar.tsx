"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Inbox, 
  MessageCircle, 
  Users, 
  FileText, 
  LayoutDashboard, 
  PenTool, 
  ClipboardList, 
  Mail, 
  Target, 
  Clock, 
  MoreHorizontal,
  Settings,
  Workflow,
  Zap,
  BarChart3,
  Plug,
  Bot,
  Building2,
  Timer,
  Palette,
  ChevronDown,
  Activity,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavSubItem {
  id: string;
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number | null;
  subItems?: NavSubItem[];
}

const getNavigationItems = (basePath: string, plan: string): NavItem[] => {
  // Determine the dashboard home path based on plan
  const dashboardHomePath = plan === 'enterprise' 
    ? '/dashboard/team/enterprise'
    : plan === 'pro'
    ? '/dashboard/team/pro'
    : plan === 'starter'
    ? '/dashboard/team/starter'
    : '/dashboard/team';
  
  return [
    { id: 'home', label: 'Dashboard', icon: Home, path: dashboardHomePath, badge: null },
    { id: 'workflows', label: 'Workflows', icon: Workflow, path: '/dashboard/team/workflows', badge: null },
    { id: 'design-showcase', label: 'Design Showcase', icon: Sparkles, path: '/dashboard/design-showcase', badge: null },
    { 
      id: 'automations', 
      label: 'Automations', 
      icon: Zap, 
      path: '/dashboard/team/automations', 
      badge: null,
      subItems: [
        { id: 'automations-editor', label: 'Editor', path: '/dashboard/team/automations' },
        { id: 'automations-monitoring', label: 'Monitoring', path: '/dashboard/team/automations/monitoring' },
        { id: 'automations-implementation', label: 'Implementierung', path: '/dashboard/team/automations/monitoring/implementation' },
      ],
    },
    { id: 'triggers', label: 'Triggers', icon: Timer, path: '/dashboard/team/triggers', badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/team/analytics', badge: null },
    { id: 'integrations', label: 'Integrations', icon: Plug, path: '/dashboard/team/integrations', badge: null },
    { id: 'inbox', label: 'Posteingang', icon: Inbox, path: '/dashboard/team/inbox', badge: 3 },
    { id: 'documents', label: 'Dokumente', icon: FileText, path: '/dashboard/team/documents', badge: null },
    { id: 'whiteboards', label: 'Whiteboards', icon: PenTool, path: '/dashboard/team/whiteboards', badge: null },
    { id: 'forms', label: 'Formulare', icon: ClipboardList, path: '/dashboard/team/forms', badge: null },
    { id: 'customers', label: 'Kunden', icon: Building2, path: '/dashboard/team/customers', badge: null },
    { id: 'mail', label: 'Mail', icon: Mail, path: '/dashboard/team/mail', badge: null },
    { id: 'goals', label: 'Ziele', icon: Target, path: '/dashboard/team/goals', badge: null },
    { id: 'timesheets', label: 'Zeiterfassung', icon: Clock, path: '/dashboard/team/timesheets', badge: null },
    { id: 'teams', label: 'Teams', icon: Users, path: '/dashboard/team/teams', badge: null },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, path: '/dashboard/team/ai-assistant', badge: null },
    { id: 'chatbots', label: 'Chatbots', icon: MessageCircle, path: '/dashboard/team/chatbots', badge: null },
    { id: 'background-demo', label: 'Hintergrund-Demo', icon: Palette, path: '/dashboard/team/background-demo', badge: null },
    { id: 'settings', label: 'Team-Einstellungen', icon: Settings, path: '/dashboard/team/settings', badge: null },
    { id: 'more', label: 'Mehr', icon: MoreHorizontal, path: '/dashboard/team/more', badge: null },
  ];
};

interface TeamDashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  plan: string;
  setIsHovered?: (hovered: boolean) => void;
}

const ArvoLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 10h12M10 16h12M10 22h8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function TeamDashboardSidebar({ isOpen, onClose, isMobile, plan, setIsHovered: setExternalHovered }: TeamDashboardSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['automations']);
  
  // Update external hover state when internal state changes
  const handleSetHovered = (hovered: boolean) => {
    setIsHovered(hovered);
    if (setExternalHovered) {
      setExternalHovered(hovered);
    }
  };
  
  const getBasePath = () => {
    // Determine base path based on current route
    if (pathname?.startsWith('/dashboard/team/enterprise')) return '/dashboard/team/enterprise';
    if (pathname?.startsWith('/dashboard/team/pro')) return '/dashboard/team/pro';
    if (pathname?.startsWith('/dashboard/team/starter')) return '/dashboard/team/starter';
    if (pathname?.startsWith('/dashboard/team')) return '/dashboard/team';
    return '/dashboard/team';
  };
  
  const basePath = getBasePath();
  const navigationItems = getNavigationItems(basePath, plan);

  const sidebarExpanded = isMobile ? isOpen : isHovered;
  const sidebarWidth = sidebarExpanded ? 'w-56' : 'w-16';

  const sidebarContent = (
    <div 
      className={cn(
        'flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'glass-premium',
        'border-r',
        sidebarWidth,
        'relative overflow-hidden'
      )}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-default)',
        borderWidth: '0 1px 0 0',
        borderStyle: 'solid',
      }}
      onMouseEnter={() => !isMobile && handleSetHovered(true)}
      onMouseLeave={() => !isMobile && handleSetHovered(false)}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(236, 72, 153, 0.02) 100%)',
        }}
      />
      
      {/* Logo Section - Premium */}
      <div className={cn(
        'relative flex items-center px-6 pt-8 pb-6 border-b',
        'transition-all duration-500',
        'z-10'
      )}
      style={{
        borderColor: 'var(--color-border-default)',
        borderWidth: '0 0 1px 0',
        borderStyle: 'solid',
      }}>
        <Link 
          href={basePath} 
          className={cn(
            'group flex items-center gap-3 transition-all duration-500',
            sidebarExpanded ? 'w-full' : 'w-full justify-center'
          )}
        >
          <div className="relative flex-shrink-0">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#ec4899] blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            {/* Logo container */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-lg shadow-[#6366f1]/30 group-hover:scale-110 transition-transform duration-500">
              <ArvoLogo className="w-6 h-6" />
            </div>
          </div>
          {sidebarExpanded && (
            <span 
              className="text-lg font-semibold tracking-tight whitespace-nowrap transition-all duration-500 group-hover:translate-x-0.5"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Arvo Labs
            </span>
          )}
        </Link>
        {isMobile && (
          <button 
            onClick={onClose}
            className="ml-auto p-2 rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
            }}
          >
            <span 
              className="text-xl font-light"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ×
            </span>
          </button>
        )}
      </div>

      {/* Navigation - Premium Styling */}
      <nav className="flex-1 px-3.5 py-4 overflow-y-auto scrollbar-thin [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path || 
              (item.path !== basePath && pathname?.startsWith(item.path));
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isMenuOpen = openMenus.includes(item.id);
            const Icon = item.icon;
            const label = item.label;

            // Check if any sub-item is active
            const isSubItemActive = hasSubItems && item.subItems?.some(
              subItem => pathname === subItem.path || pathname?.startsWith(subItem.path + '/')
            );
            const isParentActive = isActive || isSubItemActive;

            if (hasSubItems && sidebarExpanded) {
              return (
                <li key={item.id}>
                  <Collapsible
                    open={isMenuOpen}
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenMenus([...openMenus, item.id]);
                      } else {
                        setOpenMenus(openMenus.filter(id => id !== item.id));
                      }
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          'group relative flex items-center gap-3 px-3.5 py-3 rounded-xl w-full',
                          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          isParentActive 
                            ? 'text-[var(--color-text-primary)]' 
                            : 'text-[var(--color-text-secondary)]'
                        )}
                        style={{
                          backgroundColor: isParentActive ? 'var(--color-bg-card-hover)' : 'transparent',
                        }}
                      >
                        {/* Active indicator */}
                        {isParentActive && (
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full shadow-lg"
                            style={{
                              background: 'linear-gradient(to bottom, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
                              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                            }}
                          />
                        )}
                        <Icon className={cn(
                          'w-5 h-5 flex-shrink-0 transition-all duration-500',
                          'group-hover:scale-110 group-hover:rotate-3',
                          isParentActive && 'scale-105'
                        )} />
                        <span className="flex-1 text-sm font-medium whitespace-nowrap text-left transition-all duration-500 group-hover:translate-x-0.5">
                          {label}
                        </span>
                        {item.badge && item.badge > 0 && (
                          <Badge 
                            className="text-xs px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                              color: 'white',
                            }}
                          >
                            {item.badge > 9 ? '9+' : item.badge}
                          </Badge>
                        )}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-all duration-500 shrink-0',
                            isMenuOpen && 'rotate-180'
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-8 space-y-0.5 pt-0.5">
                      {item.subItems?.map((subItem) => {
                        const isSubActive = pathname === subItem.path || pathname?.startsWith(subItem.path + '/');
                        return (
                          <Link
                            key={subItem.id}
                            href={subItem.path}
                            onClick={() => {
                              if (isMobile) onClose();
                            }}
                            className={cn(
                              'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                              'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                              'relative overflow-hidden'
                            )}
                            style={{
                              color: isSubActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                              backgroundColor: isSubActive 
                                ? 'var(--color-bg-card-hover)' 
                                : 'transparent',
                            }}
                          >
                            {/* Active indicator for sub-items */}
                            {isSubActive && (
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                style={{
                                  background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                                }}
                              />
                            )}
                            
                            {/* Hover background glow */}
                            <div 
                              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(236, 72, 153, 0.03) 100%)',
                              }}
                            />
                            
                            <span className="relative z-10 text-xs font-medium">{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={() => {
                    if (isMobile) onClose();
                  }}
                  className={cn(
                    'group relative flex items-center gap-3 px-3.5 py-3 rounded-xl',
                    'text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'relative overflow-hidden',
                    sidebarExpanded ? 'justify-start' : 'justify-center',
                    'hover:scale-[1.02]'
                  )}
                  style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive 
                      ? 'var(--color-bg-card-hover)' 
                      : 'transparent',
                  }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full shadow-lg"
                      style={{
                        background: 'linear-gradient(to bottom, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
                        boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                      }}
                    />
                  )}
                  
                  {/* Hover gradient indicator */}
                  <div 
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r-full transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:h-6',
                      isActive && 'hidden'
                    )}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                    }}
                  />
                  
                  {/* Hover background glow */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
                    }}
                  />
                  
                  <Icon 
                    className={cn(
                      'w-4 h-4 flex-shrink-0 relative z-10 transition-all duration-500',
                      isActive && 'scale-110',
                      'group-hover:scale-110 group-hover:rotate-3'
                    )}
                    style={{
                      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}
                  />
                  
                  {sidebarExpanded && (
                    <>
                      <span 
                        className="flex-1 whitespace-nowrap relative z-10 transition-all duration-500 group-hover:translate-x-0.5"
                        style={{
                          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        }}
                      >
                        {label}
                      </span>
                      
                      {item.badge && item.badge > 0 && (
                        <Badge 
                          className="text-xs px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 relative z-10"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                            color: 'white',
                          }}
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[54] animate-fade-in"
            onClick={onClose}
          />
        )}
        
        <aside
          className={cn(
            'fixed left-0 top-0 h-full z-[55] transition-transform duration-300 ease-out',
            isOpen ? 'translate-x-0 animate-slide-in-left w-72' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside className={cn(
      'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30',
      'transition-all duration-200 ease-out',
      sidebarWidth
    )}>
      {sidebarContent}
    </aside>
  );
}

