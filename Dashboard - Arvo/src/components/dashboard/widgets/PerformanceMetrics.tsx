import { Gauge, Zap, Server } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { useMemo } from "react";
import { EmptyState } from "../EmptyState";
import { WidgetSkeleton } from "../WidgetSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function PerformanceMetrics() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const { integrations } = useIntegrations();
  const isLoading = false; // TODO: Replace with actual loading state
  
  // Berechne Uptime basierend auf Workflow-Status
  const uptime = useMemo(() => {
    const visibleWorkflows = workflows.filter(w => !w.isTutorial);
    if (visibleWorkflows.length === 0) return 100;
    
    const errorWorkflows = visibleWorkflows.filter(w => w.status === "error");
    const availableWorkflows = visibleWorkflows.length - errorWorkflows.length;
    return Math.round((availableWorkflows / visibleWorkflows.length) * 1000) / 10;
  }, [workflows]);
  
  // Berechne Response Time basierend auf Integrations-Status
  // Annahme: Mehr verbundene Integrationen = bessere Performance
  const responseTime = useMemo(() => {
    const connectedIntegrations = integrations.filter(i => i.status === "connected").length;
    const totalIntegrations = integrations.length;
    
    if (totalIntegrations === 0) return 300;
    
    // Basis-Response-Time wird basierend auf Integrations-Health berechnet
    const healthRatio = connectedIntegrations / totalIntegrations;
    return Math.round(150 + (1 - healthRatio) * 150); // 150-300ms
  }, [integrations]);
  
  const visibleWorkflows = workflows.filter(w => !w.isTutorial);
  
  if (isLoading) {
    return <WidgetSkeleton rows={2} />;
  }

  return (
    <WidgetCard
      title="Performance"
      icon={<Gauge className="h-5 w-5" />}
      badge={{ label: "Healthy", variant: "success" }}
    >
      {visibleWorkflows.length > 0 || integrations.length > 0 ? (
      <div className="space-y-4">
        {/* Uptime */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Uptime</span>
            </div>
            <span className="text-lg font-bold text-primary">{uptime}%</span>
          </div>
          <Progress value={uptime} className="h-2" />
        </div>

        {/* Response Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Response</span>
            </div>
            <span className="text-lg font-bold text-primary">
              {responseTime}ms
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all",
                  i < 7 ? "bg-primary" : i < 9 ? "bg-warning" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Excellent (&lt;300ms)
          </p>
        </div>
      </div>
      ) : (
        <EmptyState
          icon={Gauge}
          title="No Performance Data"
          description="Create workflows and connect integrations to see performance metrics."
          callToAction={
            <Button size="sm" onClick={() => navigate("/automations")}>
              Get Started
            </Button>
          }
        />
      )}
    </WidgetCard>
  );
}
