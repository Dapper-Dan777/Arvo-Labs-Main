import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BOTTOM_NAV_TABS } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useUserPlan } from '@/hooks/useUserPlan';

export function BottomNavigation() {
  const location = useLocation();
  const { plan } = useUserPlan();
  
  const getDashboardHomePath = () => {
    if (plan === 'starter') return '/dashboard/starter';
    if (plan === 'pro') return '/dashboard/pro';
    if (plan === 'enterprise') return '/dashboard/enterprise';
    if (plan === 'individual') return '/dashboard/individual';
    return '/dashboard';
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      <div className="bg-background/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {BOTTOM_NAV_TABS.map((tab) => {
            const dashboardHomePath = getDashboardHomePath();
            const tabPath = tab.id === 'dashboard' ? dashboardHomePath : tab.path;
            const isActive = tab.id === 'dashboard'
              ? (location.pathname === '/dashboard/starter' || 
                 location.pathname === '/dashboard/pro' || 
                 location.pathname === '/dashboard/enterprise' || 
                 location.pathname === '/dashboard/individual')
              : location.pathname.startsWith(tab.path);
            
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.id}
                to={tabPath}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-xl min-w-[64px] transition-all duration-200',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    'w-6 h-6 transition-transform',
                    isActive && 'scale-110'
                  )} />
                  
                  {tab.badgeCount && tab.badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                    </span>
                  )}
                </div>
                
                <span className={cn(
                  'text-[10px] mt-1 font-medium',
                  isActive && 'text-primary'
                )}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

