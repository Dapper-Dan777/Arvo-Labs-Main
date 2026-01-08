"use client";

import React from 'react';
import { Menu, Bell, Search, Command } from 'lucide-react';
import { useUser } from '@/contexts/AuthContext';
import { UserButton } from '@/components/Auth/UserButton';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumHeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function PremiumHeader({ onMenuClick, isMobile }: PremiumHeaderProps) {
  const { user } = useUser();
  const { plan } = useUserPlan();
  const { t } = useLanguage();
  
  const getPlanName = () => {
    if (plan === 'starter') return t.dashboard.plans.starter;
    if (plan === 'pro') return t.dashboard.plans.pro;
    if (plan === 'enterprise') return t.dashboard.plans.enterprise;
    return t.dashboard.plans.individual;
  };

  return (
    <header className={cn(
      'sticky top-0 z-40',
      'h-16',
      'flex items-center gap-6',
      'border-b border-border/50',
      'bg-background/80 backdrop-blur-xl',
      'px-6 lg:px-8',
      'transition-all duration-200'
    )}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}

      {/* Search Bar - Premium */}
      <div className="hidden md:flex flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input
            type="search"
            placeholder="Suchen..."
            className={cn(
              'w-full h-10 pl-11 pr-20',
              'rounded-xl',
              'bg-muted/30 border border-border/50',
              'text-sm placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
              'transition-all duration-200',
              'backdrop-blur-sm'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-background/50 border border-border/50 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-background/50 border border-border/50 font-mono">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications - Premium */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            <span className="sr-only">Benachrichtigungen</span>
          </Button>
        )}

        {/* User Button */}
        {!isMobile && (
          <div className="flex items-center gap-3 pl-3 border-l border-border/50">
            <UserButton
              appearance={{
                variables: {
                  colorPrimary: '#4f46e5',
                },
                elements: {
                  avatarBox: 'w-9 h-9',
                  userButtonPopoverCard: 'shadow-xl border border-border/50',
                },
              }}
            />
            <div className="hidden xl:flex flex-col min-w-0">
              <p className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                {user?.publicMetadata?.full_name || user?.emailAddresses?.[0]?.emailAddress || t.dashboard.user}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                {getPlanName()}
              </p>
            </div>
          </div>
        )}

        {/* Mobile User Button */}
        {isMobile && (
          <UserButton
            appearance={{
              variables: {
                colorPrimary: '#4f46e5',
              },
              elements: {
                avatarBox: 'w-9 h-9',
                userButtonPopoverCard: 'shadow-xl',
              },
            }}
          />
        )}
      </div>
    </header>
  );
}
