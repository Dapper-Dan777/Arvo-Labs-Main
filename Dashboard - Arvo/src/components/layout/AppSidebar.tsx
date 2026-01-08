import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Workflow,
  Clock,
  BarChart3,
  Plug,
  Users,
  Bot,
  MessageSquare,
  ChevronDown,
  Settings,
  HelpCircle,
  Inbox,
  FileText,
  LayoutDashboard,
  Square,
  FileEdit,
  Mail,
  Target,
  Timer,
  MoreHorizontal,
  Zap,
  Building2,
  Search,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSectionGradient } from "@/lib/sectionGradients";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Zap, label: "Automations", href: "/automations" },
  {
    icon: Workflow,
    label: "Workflows",
    href: "/workflows/marketing",
    subItems: [
      { label: "Marketing", href: "/workflows/marketing" },
      { label: "Invoicing", href: "/workflows/invoicing" },
      { label: "Custom", href: "/workflows/custom" },
    ],
  },
  { icon: Clock, label: "Triggers", href: "/triggers" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Plug, label: "Integrations", href: "/integrations" },
  { icon: Inbox, label: "Posteingang", href: "/inbox" },
  { icon: FileText, label: "Dokumente", href: "/documents" },
  { icon: Square, label: "Whiteboard", href: "/whiteboard" },
  { icon: FileEdit, label: "Formulare", href: "/forms" },
  { icon: Building2, label: "Kunden", href: "/customers" },
  { icon: Mail, label: "Mail", href: "/mail" },
  { icon: Target, label: "Ziele", href: "/goals" },
  { icon: Timer, label: "Zeiterfassung", href: "/timesheets" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: MessageSquare, label: "Chatbots", href: "/chatbots" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
  { icon: Palette, label: "Hintergrund-Demo", href: "/background-demo" },
];

interface AppSidebarProps {
  collapsed: boolean;
  hovered?: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function AppSidebar({ collapsed, hovered = false, onToggle, onNavigate }: AppSidebarProps) {
  // Wenn hovered, zeige die Sidebar als erweitert an (aber collapsed bleibt true für die Breite)
  const isExpanded = !collapsed || hovered;
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["Workflows"]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data für Badges (kann später durch echte Daten ersetzt werden)
  const badgeCounts: Record<string, number> = {
    "Posteingang": 3,
    "Integrations": 1,
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    if (href === "/workflows/marketing") {
      return location.pathname === "/workflows/marketing" || 
             (location.pathname.startsWith("/workflows") && !location.pathname.includes("/edit"));
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const isParentActive = (item: (typeof navItems)[0]) => {
    if (isActive(item.href)) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.href);
    }
    return false;
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen glass-panel shrink-0 fixed left-0 top-0 transition-all duration-300 ease-in-out z-50",
        collapsed && !hovered ? "w-16" : "w-64"
      )}
      style={{ zIndex: 50 }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-12 border-b shrink-0",
        "border-[color:var(--color-border-glass)]",
        !isExpanded ? "justify-center px-0" : "justify-start px-3"
      )}>
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            !isExpanded ? "justify-center" : "gap-2"
          )} 
          onClick={handleNavClick}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xs">A</span>
          </div>
          {isExpanded && (
            <span className="font-bold text-sm gradient-text">Arvo Labs</span>
          )}
        </Link>
      </div>

      {/* Search (nur wenn expanded) */}
      {isExpanded && (
        <div className="px-2 py-2 border-b border-[color:var(--color-border-glass)]">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-xs bg-muted/50 border-muted"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto py-2 space-y-0.5",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        !isExpanded ? "px-0" : "px-2"
      )}>
        {navItems
          .filter((item) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
              item.label.toLowerCase().includes(query) ||
              item.subItems?.some((sub) => sub.label.toLowerCase().includes(query))
            );
          })
          .map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenus.includes(item.label);
          const active = isParentActive(item);
          const gradient = getSectionGradient(item.href);

          if (hasSubItems && isExpanded) {
            return (
              <Collapsible
                key={item.label}
                open={isOpen}
                onOpenChange={() => toggleMenu(item.label)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "nav-item w-full justify-between text-sm h-9",
                      active && "nav-item-active"
                    )}
                    style={active ? { background: gradient } : undefined}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{item.label}</span>
                      {badgeCounts[item.label] && (
                        <Badge variant="secondary" className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] shrink-0">
                          {badgeCounts[item.label] > 9 ? "9+" : badgeCounts[item.label]}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200 shrink-0",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 space-y-0.5 pt-0.5">
                  {item.subItems?.map((subItem) => {
                    const subActive = location.pathname === subItem.href;
                    const subGradient = getSectionGradient(subItem.href);
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={handleNavClick}
                        className={cn(
                          "nav-item text-sm h-8",
                          subActive && "nav-item-active"
                        )}
                        style={subActive ? { background: subGradient } : undefined}
                      >
                        <span className="truncate text-xs">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          // Wenn collapsed, nur Icon ohne Submenu
          if (hasSubItems && !isExpanded) {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center justify-center h-8 rounded-full text-xs font-medium transition-colors mx-1",
                      active ? "text-white" : "text-foreground hover:bg-accent hover:text-accent-foreground",
                      !isExpanded && active && "w-[calc(100%-0.5rem)]"
                    )}
                    style={active ? { background: gradient } : undefined}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          const linkContent = (
            <Link
              key={item.label}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "nav-item text-sm h-9",
                active && "nav-item-active",
                !isExpanded && "justify-center gap-0 mx-1",
                !isExpanded && active && "w-[calc(100%-0.5rem)]"
              )}
              style={active ? { background: gradient } : undefined}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {isExpanded && (
                <>
                  <span className="truncate text-sm flex-1">{item.label}</span>
                  {badgeCounts[item.label] && (
                    <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-[10px] shrink-0" aria-label={`${badgeCounts[item.label]} Benachrichtigungen`}>
                      {badgeCounts[item.label] > 9 ? "9+" : badgeCounts[item.label]}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );

          // Wenn collapsed, Tooltip hinzufügen
          if (!isExpanded) {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className={cn(
        "border-t space-y-0.5 shrink-0",
        "border-[color:var(--color-border-glass)]",
        !isExpanded ? "px-0 py-2" : "py-2 px-2"
      )}>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const gradient = getSectionGradient(item.href);
          
          if (!isExpanded) {
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center justify-center h-8 rounded-full text-xs font-medium transition-colors mx-1",
                  isActive ? "text-white" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  !isExpanded && isActive && "w-[calc(100%-0.5rem)]"
                )}
                style={isActive ? { background: gradient } : undefined}
                title={item.label}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </Link>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "nav-item text-muted-foreground text-sm h-9",
                isActive && "nav-item-active"
              )}
              style={isActive ? { background: gradient } : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
