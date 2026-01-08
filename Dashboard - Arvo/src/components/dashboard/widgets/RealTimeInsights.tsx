import { TrendingUp, Clock, Activity, Zap } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { useMemo } from "react";
import { EmptyState } from "../EmptyState";
import { WidgetSkeleton } from "../WidgetSkeleton";
import { Button } from "@/components/ui/button";

// Hilfsfunktion zur Berechnung der gesparten Zeit basierend auf Workflows
function calculateTimeSaved(workflows: any[], timeRange: string): { hours: number; trend: "up" | "down" | "stable" } {
  // Vereinfachte Berechnung: Jeder laufende Workflow spart geschätzt 0.5h pro Tag
  const runningWorkflows = workflows.filter(w => w.status === "running" && !w.isTutorial);
  const baseHours = runningWorkflows.length * 0.5;
  
  // Multiplizieren basierend auf Zeitraum
  const multipliers: Record<string, number> = {
    today: 1,
    week: 7,
    month: 30,
    year: 365,
    all: 365,
  };
  
  const hours = baseHours * (multipliers[timeRange] || 1);
  return { hours, trend: "up" };
}

// Hilfsfunktion zur Berechnung der Workflow-Runs
function calculateRuns(workflows: any[], timeRange: string): { count: number; trend: "up" | "down" | "stable" } {
  const runningWorkflows = workflows.filter(w => w.status === "running" && !w.isTutorial);
  // Schätze: Jeder Workflow läuft durchschnittlich 5x pro Tag
  const baseRuns = runningWorkflows.length * 5;
  
  const multipliers: Record<string, number> = {
    today: 1,
    week: 7,
    month: 30,
    year: 365,
    all: 365,
  };
  
  const count = Math.round(baseRuns * (multipliers[timeRange] || 1));
  return { count, trend: "up" };
}

// Hilfsfunktion zur Berechnung der Uptime
function calculateUptime(workflows: any[]): { percentage: number; trend: "up" | "down" | "stable" } {
  const visibleWorkflows = workflows.filter(w => !w.isTutorial);
  if (visibleWorkflows.length === 0) return { percentage: 100, trend: "stable" };
  
  const runningWorkflows = visibleWorkflows.filter(w => w.status === "running");
  const errorWorkflows = visibleWorkflows.filter(w => w.status === "error");
  
  // Uptime = (Running + Paused) / Total (Paused zählt als verfügbar, aber nicht aktiv)
  const availableWorkflows = visibleWorkflows.length - errorWorkflows.length;
  const percentage = Math.round((availableWorkflows / visibleWorkflows.length) * 100);
  
  return { percentage, trend: percentage >= 95 ? "stable" : percentage >= 80 ? "up" : "down" };
}

// Hilfsfunktion zur Berechnung der Effizienz
function calculateEfficiency(workflows: any[]): { percentage: number; trend: "up" | "down" | "stable" } {
  const visibleWorkflows = workflows.filter(w => !w.isTutorial);
  if (visibleWorkflows.length === 0) return { percentage: 100, trend: "stable" };
  
  // Durchschnittlicher Progress aller Workflows
  const avgProgress = visibleWorkflows.reduce((sum, w) => sum + (w.progress || 0), 0) / visibleWorkflows.length;
  const percentage = Math.round(avgProgress);
  
  return { percentage, trend: percentage >= 90 ? "up" : percentage >= 70 ? "stable" : "down" };
}

// Mini sparkline component
function Sparkline({ trend }: { trend: string }) {
  const points =
    trend === "up"
      ? [40, 35, 45, 30, 50, 35, 55, 45, 60]
      : trend === "down"
      ? [60, 55, 50, 55, 45, 50, 40, 45, 35]
      : [45, 50, 45, 50, 45, 50, 45, 50, 45];

  const width = 80;
  const height = 24;
  const path = points
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * width} ${
          height - (point / 100) * height
        }`
    )
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          trend === "up"
            ? "text-primary"
            : trend === "down"
            ? "text-destructive"
            : "text-muted-foreground"
        )}
      />
    </svg>
  );
}

export function RealTimeInsights() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const { timeRange } = useDashboard();
  const isLoading = false; // TODO: Replace with actual loading state
  
  const metrics = useMemo(() => {
    const timeSaved = calculateTimeSaved(workflows, timeRange);
    const runs = calculateRuns(workflows, timeRange);
    const uptime = calculateUptime(workflows);
    const efficiency = calculateEfficiency(workflows);
    
    const formatHours = (hours: number) => {
      if (hours < 1) return `${Math.round(hours * 60)}m`;
      if (hours < 24) return `${hours.toFixed(1)}h`;
      return `${(hours / 24).toFixed(1)}d`;
    };
    
    return [
      {
        label: timeRange === "today" ? "Time Saved Today" : `Time Saved (${timeRange})`,
        value: formatHours(timeSaved.hours),
        change: "+18%",
        trend: timeSaved.trend,
        icon: Clock,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        label: timeRange === "today" ? "Runs Today" : `Runs (${timeRange})`,
        value: runs.count.toString(),
        change: "+12%",
        trend: runs.trend,
        icon: Activity,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        label: "Uptime",
        value: `${uptime.percentage}%`,
        change: "0%",
        trend: uptime.trend,
        icon: Zap,
        color: "text-warning",
        bg: "bg-warning/10",
      },
      {
        label: "Efficiency",
        value: `${efficiency.percentage}%`,
        change: "+5%",
        trend: efficiency.trend,
        icon: TrendingUp,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
    ];
  }, [workflows, timeRange]);
  
  if (isLoading) {
    return <WidgetSkeleton rows={4} />;
  }
  
  const visibleWorkflows = workflows.filter(w => !w.isTutorial);
  
  return (
    <WidgetCard
      title="Real-Time Insights"
      icon={<TrendingUp className="h-5 w-5" />}
      badge={{ label: timeRange, variant: "default" }}
      footer={
        visibleWorkflows.length > 0 ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Last updated: Just now
            </span>
            <button 
              className="text-primary hover:underline font-medium"
              onClick={() => navigate("/analytics")}
            >
              View Analytics →
            </button>
          </div>
        ) : null
      }
    >
      {visibleWorkflows.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-lg", metric.bg)}>
                  <Icon className={cn("h-4 w-4", metric.color)} />
                </div>
                <Sparkline trend={metric.trend} />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {metric.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        <EmptyState
          icon={TrendingUp}
          title="No Insights Available"
          description="Create workflows to start seeing real-time insights and metrics."
          callToAction={
            <Button size="sm" onClick={() => navigate("/automations")}>
              Create Workflow
            </Button>
          }
        />
      )}
    </WidgetCard>
  );
}
