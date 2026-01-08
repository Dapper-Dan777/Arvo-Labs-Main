import { ReactNode } from "react";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TimeRangeFilter, TimeRange, type TimeRangeFilterProps } from "./TimeRangeFilter";

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  badge?: {
    label: string;
    variant?: "default" | "success" | "warning" | "destructive";
  };
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onRefresh?: () => void;
  showTimeRangeFilter?: boolean;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

const badgeStyles = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
};

export function WidgetCard({
  title,
  icon,
  badge,
  children,
  footer,
  className,
  onRefresh,
  showTimeRangeFilter = false,
  timeRange = "week",
  onTimeRangeChange,
}: WidgetCardProps) {
  const { toast } = useToast();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Aktualisiert",
        description: `${title} wurde aktualisiert.`,
      });
    }
  };

  return (
    <div
      className={cn(
        "widget-card glass-card card-hover-effect flex flex-col h-full group animate-fade-in",
        "rounded-xl border shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-muted-foreground">{icon}</div>
          )}
          <h3 className="font-semibold text-sm">{title}</h3>
          {badge && (
            <Badge
              variant="outline"
              className={cn("text-xs", badgeStyles[badge.variant || "default"])}
            >
              {badge.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showTimeRangeFilter && onTimeRangeChange && (
            <TimeRangeFilter
              value={timeRange}
              onChange={onTimeRangeChange}
              variant="compact"
            />
          )}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
            onClick={handleRefresh}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRefresh}>
                  Aktualisieren
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  toast({
                    title: "Widget konfigurieren",
                    description: `${title} Konfiguration wird geöffnet...`,
                  });
                }}>
                  Konfigurieren
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    toast({
                      title: "Widget entfernt",
                      description: `${title} wurde entfernt.`,
                    });
                  }}
                  className="text-destructive"
                >
                  Entfernen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border/50 px-4 py-3 bg-muted/30">
          {footer}
        </div>
      )}
    </div>
  );
}
