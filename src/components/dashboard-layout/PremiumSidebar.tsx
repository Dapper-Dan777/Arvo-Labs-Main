"use client";

import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  Globe,
  Lock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useUser } from '@/contexts/AuthContext';
import { UserButton } from '@/components/Auth/UserButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { FeatureId } from '@/config/access';

interface NavItem {
  id: string;
  label: { de: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number | null;
  feature?: FeatureId;
}

const getNavigationItems = (basePath: string, t: any): NavItem[] => [
  { id: 'home', label: { de: t.nav.home, en: t.nav.home }, icon: Home, path: basePath, badge: null },
  { id: 'inbox', label: { de: t.nav.inbox, en: t.nav.inbox }, icon: Inbox, path: `${basePath}/inbox`, badge: 3, feature: 'inbox' },
  { id: 'chat', label: { de: t.nav.chat, en: t.nav.chat }, icon: MessageCircle, path: `${basePath}/chat`, badge: null, feature: 'chat' },
  { id: 'teams', label: { de: t.nav.teams, en: t.nav.teams }, icon: Users, path: `${basePath}/teams`, badge: null, feature: 'teamManagement' },
  { id: 'documents', label: { de: t.nav.documents, en: t.nav.documents }, icon: FileText, path: `${basePath}/documents`, badge: null, feature: 'documents' },
  { id: 'dashboards', label: { de: t.nav.dashboards, en: t.nav.dashboards }, icon: LayoutDashboard, path: `${basePath}/dashboards`, badge: null, feature: 'dashboard' },
  { id: 'design-showcase', label: { de: 'Design Showcase', en: 'Design Showcase' }, icon: Sparkles, path: `${basePath}/design-showcase`, badge: null },
  { id: 'whiteboards', label: { de: t.nav.whiteboards, en: t.nav.whiteboards }, icon: PenTool, path: `${basePath}/whiteboards`, badge: null, feature: 'whiteboards' },
  { id: 'forms', label: { de: t.nav.forms, en: t.nav.forms }, icon: ClipboardList, path: `${basePath}/forms`, badge: null, feature: 'forms' },
  { id: 'mail', label: { de: t.nav.mail, en: t.nav.mail }, icon: Mail, path: `${basePath}/mail`, badge: null, feature: 'mail' },
  { id: 'goals', label: { de: t.nav.goals, en: t.nav.goals }, icon: Target, path: `${basePath}/goals`, badge: null, feature: 'goals' },
  { id: 'timesheets', label: { de: t.nav.timesheets, en: t.nav.timesheets }, icon: Clock, path: `${basePath}/timesheets`, badge: null, feature: 'timesheets' },
  { id: 'more', label: { de: t.nav.more, en: t.nav.more }, icon: MoreHorizontal, path: `${basePath}/more`, badge: null },
];

interface PremiumSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  plan: string;
}

const ArvoLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="32" height="32" rx="6" className="fill-indigo-600 dark:fill-indigo-500" />
    <path
      d="M10 10h12M10 16h12M10 22h8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PremiumSidebar({ isOpen, onClose, isMobile, plan }: PremiumSidebarProps) {
  const location = useLocation();
  const { user } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const { canAccess, getRequiredPlan } = useAccessControl();
  const [isHovered, setIsHovered] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{ name: string; requiredPlan: string | 'team' | null } | null>(null);
  
  const getBasePath = () => '/dashboard';
  
  const getDashboardHomePath = () => {
    if (location.pathname.startsWith('/dashboard/starter')) return '/dashboard/starter';
    if (location.pathname.startsWith('/dashboard/pro')) return '/dashboard/pro';
    if (location.pathname.startsWith('/dashboard/enterprise')) return '/dashboard/enterprise';
    if (location.pathname.startsWith('/dashboard/individual')) return '/dashboard/individual';
    return '/dashboard';
  };
  
  const basePath = getBasePath();
  const dashboardHomePath = getDashboardHomePath();
  const navigationItems = getNavigationItems(basePath, t).map(item => 
    item.id === 'home' ? { ...item, path: dashboardHomePath } : item
  );
  
  const getPlanName = () => {
    if (plan === 'starter') return t.dashboard.plans.starter;
    if (plan === 'pro') return t.dashboard.plans.pro;
    if (plan === 'enterprise') return t.dashboard.plans.enterprise;
    return t.dashboard.plans.individual;
  };
  
  const handleFeatureClick = (feature: FeatureId | undefined, e: React.MouseEvent) => {
    if (!feature) return;
    
    if (!canAccess(feature)) {
      e.preventDefault();
      const requiredPlan = getRequiredPlan(feature);
      const featureName = t.dashboard.features[feature] || feature;
      setSelectedFeature({ name: featureName, requiredPlan });
      setUpgradeModalOpen(true);
    }
  };

  const sidebarExpanded = isMobile ? isOpen : isHovered;
  const sidebarWidth = sidebarExpanded ? 'w-64' : 'w-20';

  const sidebarContent = (
    <div 
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-out',
        'bg-background/95 backdrop-blur-xl',
        'border-r border-border/50',
        sidebarWidth
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Logo Section - Premium */}
      <div className={cn(
        'flex items-center px-6 py-8 border-b border-border/50',
        'transition-all duration-300'
      )}>
        <Link 
          to={getBasePath()} 
          className={cn(
            'flex items-center gap-4 transition-all duration-300',
            sidebarExpanded ? 'w-full' : 'w-full justify-center'
          )}
        >
          <div className="flex-shrink-0">
            <ArvoLogo className="w-9 h-9" />
          </div>
          {sidebarExpanded && (
            <span className="text-xl font-semibold tracking-tight text-foreground whitespace-nowrap">
              Arvo Labs
            </span>
          )}
        </Link>
        {isMobile && (
          <button 
            onClick={onClose}
            className="ml-auto p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <span className="text-muted-foreground text-xl">×</span>
          </button>
        )}
      </div>

      {/* Navigation - Premium Styling */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== basePath && location.pathname.startsWith(item.path));
            const hasAccess = item.feature ? canAccess(item.feature) : true;
            const Icon = item.icon;
            const label = item.label[language];

            return (
              <li key={item.id}>
                <Link
                  to={hasAccess ? item.path : '#'}
                  onClick={(e) => {
                    handleFeatureClick(item.feature, e);
                    if (isMobile && hasAccess) onClose();
                  }}
                  className={cn(
                    'group relative flex items-center gap-4 px-4 py-3 rounded-xl',
                    'transition-all duration-200 ease-out',
                    'text-sm font-medium',
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    !hasAccess && 'opacity-50 cursor-not-allowed',
                    sidebarExpanded ? 'justify-start' : 'justify-center'
                  )}
                  title={!hasAccess ? t.dashboard.upgrade.featureLocked : undefined}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                  
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-all duration-200',
                    isActive && 'scale-110'
                  )} />
                  
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1 whitespace-nowrap">{label}</span>
                      
                      {item.badge && item.badge > 0 && (
                        <Badge 
                          variant="default" 
                          className="bg-primary text-primary-foreground border-0 text-xs px-2 py-0.5 h-5 min-w-[20px] flex items-center justify-center font-semibold"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}

                      {!hasAccess && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section - Premium */}
      <div className={cn(
        'p-4 border-t border-border/50 space-y-3',
        'transition-all duration-300',
        isMobile && 'hidden'
      )}>
        {/* Language Toggle */}
        <div className={cn(
          'flex items-center',
          sidebarExpanded ? 'justify-start' : 'justify-center'
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
            className={cn(
              'rounded-lg transition-all duration-200',
              'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              sidebarExpanded ? 'h-9 px-3 gap-2' : 'h-9 w-9'
            )}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            {sidebarExpanded && (
              <span className="text-sm font-medium">
                {language === 'de' ? t.dashboard.language.en : t.dashboard.language.de}
              </span>
            )}
          </Button>
        </div>

        {/* UserButton */}
        <div className={cn(
          'flex items-center gap-3',
          sidebarExpanded ? 'justify-start' : 'justify-center'
        )}>
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
          {sidebarExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.publicMetadata?.full_name || user?.emailAddresses?.[0]?.emailAddress || t.dashboard.user}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getPlanName()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {selectedFeature && (
        <UpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          feature={selectedFeature.name}
          requiredPlan={selectedFeature.requiredPlan}
        />
      )}
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
            isOpen ? 'translate-x-0 w-72' : '-translate-x-full'
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
      'transition-all duration-300 ease-out',
      sidebarWidth
    )}>
      {sidebarContent}
    </aside>
  );
}
