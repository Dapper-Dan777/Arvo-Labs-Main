import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: ReactNode;
  icon?: LucideIcon;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  tip?: string;
}

export function EmptyState({
  title,
  description,
  illustration,
  icon: Icon,
  action,
  tip,
}: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center p-12 text-center min-h-[400px] animate-fade-in">
      {/* Illustration mit Animation */}
      <div className="mb-6 animate-pulse-slow">
        {illustration ? (
          <div className="w-64 h-64 opacity-50 flex items-center justify-center animate-bounce-subtle">
            {illustration}
          </div>
        ) : Icon ? (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shadow-lg animate-scale-in">
            <Icon className="w-16 h-16 text-primary animate-pulse" />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-muted-foreground/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* Content mit Fade-in */}
      <h3 className="text-2xl font-semibold mb-2 text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>{description}</p>

      {/* Action */}
      {action && (
        <Button
          size="lg"
          onClick={action.onClick}
          className="mt-4"
          style={{ background: "var(--gradient-dashboard)" }}
        >
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}

      {/* Optional: Quick Tips */}
      {tip && (
        <div className="mt-8 p-4 bg-muted rounded-lg max-w-md">
          <h4 className="font-medium mb-2 text-foreground">💡 Tipp:</h4>
          <p className="text-sm text-muted-foreground">{tip}</p>
        </div>
      )}
    </div>
  );
}

