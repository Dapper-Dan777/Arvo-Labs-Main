"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3,
  PenTool,
  Target,
  Clock,
  Bot,
  MoreHorizontal,
  Settings,
  Zap,
  Plug,
  FileText,
  MessageCircle,
  Workflow,
  Timer,
  Inbox,
  ClipboardList,
  Building2,
  Mail,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number | null;
}

const getNavigationItems = (basePath: string, plan: string): NavItem[] => {
  const dashboardHomePath = plan === 'enterprise' 
    ? '/dashboard/user/enterprise'
    : plan === 'pro'
    ? '/dashboard/user/pro'
    : plan === 'starter'
    ? '/dashboard/user/starter'
    : '/dashboard/user';
  
  const baseItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: Home, path: dashboardHomePath, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/user/analytics', badge: null },
    { id: 'design-showcase', label: 'Design Showcase', icon: Sparkles, path: '/dashboard/design-showcase', badge: null },
    { id: 'whiteboards', label: 'Whiteboards', icon: PenTool, path: '/dashboard/user/whiteboards', badge: null },
    { id: 'goals', label: 'Ziele', icon: Target, path: '/dashboard/user/goals', badge: null },
    { id: 'timesheets', label: 'Zeiterfassung', icon: Clock, path: '/dashboard/user/timesheets', badge: null },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, path: '/dashboard/user/ai-assistant', badge: null },
  ];

  // Pro features
  if (plan === 'pro' || plan === 'enterprise') {
    baseItems.splice(2, 0, 
      { id: 'automations', label: 'Automations', icon: Zap, path: '/dashboard/user/automations', badge: null },
      { id: 'integrations', label: 'Integrations', icon: Plug, path: '/dashboard/user/integrations', badge: null },
      { id: 'documents', label: 'Dokumente', icon: FileText, path: '/dashboard/user/documents', badge: null },
      { id: 'chatbots', label: 'Chatbots', icon: MessageCircle, path: '/dashboard/user/chatbots', badge: null },
    );
  }

  // Enterprise features
  if (plan === 'enterprise') {
    baseItems.splice(2, 0,
      { id: 'workflows', label: 'Workflows', icon: Workflow, path: '/dashboard/user/workflows', badge: null },
      { id: 'triggers', label: 'Triggers', icon: Timer, path: '/dashboard/user/triggers', badge: null },
    );
    baseItems.splice(7, 0,
      { id: 'inbox', label: 'Posteingang', icon: Inbox, path: '/dashboard/user/inbox', badge: null },
      { id: 'forms', label: 'Formulare', icon: ClipboardList, path: '/dashboard/user/forms', badge: null },
      { id: 'customers', label: 'Kunden', icon: Building2, path: '/dashboard/user/customers', badge: null },
      { id: 'mail', label: 'Mail', icon: Mail, path: '/dashboard/user/mail', badge: null },
    );
  }

  // Add "More" and "Settings" at the end
  baseItems.push(
    { id: 'more', label: 'Mehr', icon: MoreHorizontal, path: '/dashboard/user/more', badge: null },
    { id: 'settings', label: 'Einstellungen', icon: Settings, path: '/dashboard/user/settings', badge: null },
  );

  return baseItems;
};

interface UserDashboardSidebarProps {
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

export function UserDashboardSidebar({ isOpen, onClose, isMobile, plan, setIsHovered }: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHoveredInternal] = useState(false);
  
  const handleSetHovered = (hovered: boolean) => {
    setIsHoveredInternal(hovered);
    if (setIsHovered) {
      setIsHovered(hovered);
    }
  };
  
  const getBasePath = () => {
    if (pathname?.startsWith('/dashboard/user/enterprise')) return '/dashboard/user/enterprise';
    if (pathname?.startsWith('/dashboard/user/pro')) return '/dashboard/user/pro';
    if (pathname?.startsWith('/dashboard/user/starter')) return '/dashboard/user/starter';
    if (pathname?.startsWith('/dashboard/user')) return '/dashboard/user';
    return '/dashboard/user';
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
          href={getBasePath()} 
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
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar relative z-10">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path || 
              (item.path !== basePath && pathname?.startsWith(item.path));
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={() => isMobile && onClose()}
                  className={cn(
                    'group relative flex items-center gap-3 px-3.5 py-3 rounded-xl',
                    'text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'relative overflow-hidden',
                    isActive 
                      ? 'shadow-sm' 
                      : '',
                    sidebarExpanded ? 'justify-start' : 'justify-center',
                    'hover:scale-[1.02]'
                  )}
                  style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive 
                      ? 'var(--color-bg-secondary)' 
                      : 'transparent',
                  }}
                >
                  {/* Active Indicator - Verfeinert */}
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
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
                        {item.label}
                      </span>
                      
                      {item.badge && item.badge > 0 && (
                        <Badge 
                          variant="default" 
                          className="relative z-10 border-0 text-[10px] px-2 py-0.5 h-5 min-w-[20px] flex items-center justify-center font-semibold shadow-lg transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-end) 100%)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
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
            'fixed left-0 top-0 h-full z-[55] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isOpen ? 'translate-x-0 w-64' : '-translate-x-full'
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
      'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      sidebarWidth
    )}>
      {sidebarContent}
    </aside>
  );
}
