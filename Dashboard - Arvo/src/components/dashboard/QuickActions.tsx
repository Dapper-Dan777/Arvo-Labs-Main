import { Plus, FileText, Download, Settings, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useSectionGradient } from "@/lib/sectionGradients";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant?: "default" | "outline";
  gradient?: boolean;
}

interface QuickActionsProps {
  onExport?: () => void;
  onCreateWorkflow?: () => void;
}

export function QuickActions({ onExport, onCreateWorkflow }: QuickActionsProps) {
  const navigate = useNavigate();
  const sectionGradient = useSectionGradient();

  const actions: QuickAction[] = [
    {
      id: "create-workflow",
      label: "Workflow erstellen",
      icon: Plus,
      action: () => {
        if (onCreateWorkflow) {
          onCreateWorkflow();
        } else {
          navigate("/workflows/marketing");
        }
      },
      gradient: true,
    },
    {
      id: "view-analytics",
      label: "Analytics",
      icon: BarChart3,
      action: () => navigate("/analytics"),
      variant: "outline",
    },
    {
      id: "export-data",
      label: "Daten exportieren",
      icon: Download,
      action: () => {
        if (onExport) {
          onExport();
        }
      },
      variant: "outline",
    },
    {
      id: "settings",
      label: "Einstellungen",
      icon: Settings,
      action: () => navigate("/settings"),
      variant: "outline",
    },
  ];

  return (
    <Card className="p-3 md:p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground shrink-0 mr-2">
          Schnellzugriff:
        </span>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.variant || "default"}
              size="sm"
              onClick={action.action}
              className={cn(
                "gap-2",
                action.gradient && "text-white border-0"
              )}
              style={action.gradient ? { background: sectionGradient } : undefined}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}

