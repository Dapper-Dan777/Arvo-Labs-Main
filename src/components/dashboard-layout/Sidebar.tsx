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
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { FeatureId } from '@/config/access';

interface NavItem {
  id: string;
  label: { de: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number | null;
  feature?: FeatureId; // Feature-ID für Zugriffskontrolle
}

const getNavigationItems = (basePath: string, t: any): NavItem[] => [
  { id: 'home', label: { de: t.nav.home, en: t.nav.home }, icon: Home, path: basePath, badge: null },
  { id: 'inbox', label: { de: t.nav.inbox, en: t.nav.inbox }, icon: Inbox, path: `${basePath}/inbox`, badge: 3, feature: 'inbox' },
  { id: 'chat', label: { de: t.nav.chat, en: t.nav.chat }, icon: MessageCircle, path: `${basePath}/chat`, badge: null, feature: 'chat' },
  { id: 'teams', label: { de: t.nav.teams, en: t.nav.teams }, icon: Users, path: `${basePath}/teams`, badge: null, feature: 'teamManagement' },
  { id: 'documents', label: { de: t.nav.documents, en: t.nav.documents }, icon: FileText, path: `${basePath}/documents`, badge: null, feature: 'documents' },
  { id: 'dashboards', label: { de: t.nav.dashboards, en: t.nav.dashboards }, icon: LayoutDashboard, path: `${basePath}/dashboards`, badge: null, feature: 'dashboard' },
  { id: 'whiteboards', label: { de: t.nav.whiteboards, en: t.nav.whiteboards }, icon: PenTool, path: `${basePath}/whiteboards`, badge: null, feature: 'whiteboards' },
  { id: 'forms', label: { de: t.nav.forms, en: t.nav.forms }, icon: ClipboardList, path: `${basePath}/forms`, badge: null, feature: 'forms' },
  { id: 'mail', label: { de: t.nav.mail, en: t.nav.mail }, icon: Mail, path: `${basePath}/mail`, badge: null, feature: 'mail' },
  { id: 'goals', label: { de: t.nav.goals, en: t.nav.goals }, icon: Target, path: `${basePath}/goals`, badge: null, feature: 'goals' },
  { id: 'timesheets', label: { de: t.nav.timesheets, en: t.nav.timesheets }, icon: Clock, path: `${basePath}/timesheets`, badge: null, feature: 'timesheets' },
  { id: 'more', label: { de: t.nav.more, en: t.nav.more }, icon: MoreHorizontal, path: `${basePath}/more`, badge: null },
];

interface SidebarProps {
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

export function Sidebar({ isOpen, onClose, isMobile, plan }: SidebarProps) {
  const location = useLocation();
  const { user } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const { canAccess, getRequiredPlan } = useAccessControl();
  const [isHovered, setIsHovered] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{ name: string; requiredPlan: string | 'team' | null } | null>(null);
  
  const getBasePath = () => {
    return '/dashboard';
  };
  
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
  const sidebarWidth = sidebarExpanded ? 'w-56' : 'w-16';

  const sidebarContent = (
    <div 
      className={cn(
        'flex flex-col h-full transition-all duration-200 ease-out',
        'bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800',
        sidebarWidth
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Logo + Text */}
      <div className={cn(
        'flex items-center px-4 py-6 border-b border-slate-200 dark:border-slate-800',
        'transition-all duration-200'
      )}>
        <Link 
          to={getBasePath()} 
          className={cn(
            'flex items-center gap-3 transition-all duration-200',
            sidebarExpanded ? 'w-full' : 'w-full justify-center'
          )}
        >
          <div className={cn(
            'flex-shrink-0 transition-all duration-200',
            sidebarExpanded ? 'ml-1' : 'ml-0'
          )}>
            <ArvoLogo className="w-8 h-8" />
          </div>
          {sidebarExpanded && (
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Arvo Labs
            </span>
          )}
        </Link>
        {isMobile && (
          <button 
            onClick={onClose}
            className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="text-slate-500 dark:text-slate-400">×</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'transition-all duration-200 ease-out',
                    'text-slate-500 dark:text-slate-400',
                    'hover:bg-indigo-50 dark:hover:bg-indigo-950',
                    'hover:text-indigo-500 dark:hover:text-indigo-400',
                    isActive && 'bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400',
                    !hasAccess && 'opacity-60 cursor-not-allowed',
                    sidebarExpanded ? 'justify-start' : 'justify-center'
                  )}
                  title={!hasAccess ? t.dashboard.upgrade.featureLocked : undefined}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-all duration-200',
                    'group-hover:scale-105',
                    isActive && 'scale-105'
                  )} />
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1 text-sm font-medium whitespace-nowrap">
                        {label}
                      </span>
                      
                      {item.badge && item.badge > 0 && (
                        <Badge 
                          variant="default" 
                          className="bg-indigo-500 text-white border-0 text-xs px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}

                      {!hasAccess && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-indigo-500/50 text-indigo-500 dark:text-indigo-400"
                        >
                          <Lock className="w-3 h-3 mr-1" />
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

      {/* Bottom: Language + UserButton (nur Desktop) */}
      <div className={cn(
        'p-4 border-t border-slate-200 dark:border-slate-800 space-y-3',
        'transition-all duration-200',
        isMobile && 'hidden' // In mobiler Ansicht ausblenden
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
              'rounded-lg flex items-center justify-center transition-all duration-200',
              'text-slate-500 dark:text-slate-400',
              'hover:bg-indigo-50 dark:hover:bg-indigo-950',
              'hover:text-indigo-500 dark:hover:text-indigo-400',
              'bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400',
              sidebarExpanded ? 'h-9 px-3 gap-2' : 'h-9 w-9'
            )}
            title={language === 'de' ? t.dashboard.language.switchTo.replace('{lang}', 'English') : t.dashboard.language.switchTo.replace('{lang}', 'Deutsch')}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            {sidebarExpanded && (
              <span className="text-sm font-medium">
                {language === 'de' ? t.dashboard.language.en : t.dashboard.language.de}
              </span>
            )}
          </Button>
        </div>

        {/* UserButton - nur Desktop */}
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
                avatarBox: 'w-8 h-8',
                userButtonPopoverCard: 'shadow-lg',
              },
            }}
          />
          {sidebarExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {user?.fullName || user?.emailAddresses?.[0]?.emailAddress || t.dashboard.user}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {getPlanName()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile: Keine zusätzlichen Buttons - alles bleibt in der Sidebar für Desktop */}
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
    <>
      <aside className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30',
        'transition-all duration-200 ease-out',
        sidebarWidth
      )}>
        {sidebarContent}
      </aside>
      
      {selectedFeature && (
        <UpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          feature={selectedFeature.name}
          requiredPlan={selectedFeature.requiredPlan}
        />
      )}
    </>
  );
}
