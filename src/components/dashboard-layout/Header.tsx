import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}

      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Suchen..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2">
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            <span className="sr-only">Benachrichtigungen</span>
          </Button>
        )}


        {/* User Button - nur in mobiler Ansicht */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <UserButton
              appearance={{
                variables: {
                  colorPrimary: '#4f46e5',
                },
                elements: {
                  avatarBox: 'w-8 h-8',
                  userButtonPopoverCard: 'shadow-lg',
                },
              }}
            />
            <div className="hidden sm:flex flex-col min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {user?.fullName || user?.emailAddresses?.[0]?.emailAddress || t.dashboard.user}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                {getPlanName()}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

