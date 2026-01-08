import { Workflow, Play, Pause, AlertCircle, Plus } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { EmptyState } from "../EmptyState";

const statusConfig = {
  running: {
    icon: Play,
    color: "text-primary",
    bg: "bg-primary/10",
    dotClass: "status-dot-success",
  },
  paused: {
    icon: Pause,
    color: "text-warning",
    bg: "bg-warning/10",
    dotClass: "status-dot-warning",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    dotClass: "status-dot-error",
  },
};

export function ActiveWorkflows() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  
  // Filtere Tutorial-Workflows aus
  const visibleWorkflows = workflows.filter(w => !w.isTutorial);
  
  // Zeige nur die ersten 5 Workflows im Widget
  const displayedWorkflows = visibleWorkflows.slice(0, 5);
  
  const statusCounts = {
    running: visibleWorkflows.filter((w) => w.status === "running").length,
    paused: visibleWorkflows.filter((w) => w.status === "paused").length,
    error: visibleWorkflows.filter((w) => w.status === "error").length,
  };

  return (
    <WidgetCard
      title="Active Workflows"
      icon={<Workflow className="h-5 w-5" />}
      badge={{ label: "Live", variant: "success" }}
      footer={
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="status-dot status-dot-success" />
              {statusCounts.running} Running
            </span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot status-dot-warning" />
              {statusCounts.paused} Paused
            </span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot status-dot-error" />
              {statusCounts.error} Error
            </span>
          </div>
          <button 
            className="text-primary hover:underline font-medium"
            onClick={() => navigate("/workflows")}
          >
            View All →
          </button>
        </div>
      }
    >
      {displayedWorkflows.length === 0 ? (
        <EmptyState
          icon={Workflow}
          title="Keine aktiven Workflows"
          description="Erstellen Sie einen neuen Workflow, um mit der Automatisierung zu beginnen."
          action={{
            label: "Workflow erstellen",
            onClick: () => navigate("/workflows/marketing"),
          }}
        />
      ) : (
        <div className="space-y-3">
          {displayedWorkflows.map((workflow, index) => {
            const config = statusConfig[workflow.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <div
                key={workflow.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={cn("p-1.5 rounded-md", config.bg)}>
                  <StatusIcon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">
                      {workflow.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {workflow.lastRun}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={workflow.progress}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {workflow.duration}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
