import { Clock, TrendingUp, DollarSign } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflows } from "@/contexts/WorkflowContext";
import { useMemo } from "react";
import { EmptyState } from "../EmptyState";
import { WidgetSkeleton } from "../WidgetSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Berechnet gesparte Zeit basierend auf Workflows
function calculateTimeSavedForPeriod(workflows: any[], days: number): number {
  // Schätzung: Jeder laufende Workflow spart 0.5h pro Tag
  const runningWorkflows = workflows.filter(w => w.status === "running" && !w.isTutorial);
  return runningWorkflows.length * 0.5 * days;
}

// Berechnet gespartes Geld (angenommener Stundenlohn: €50/h)
function calculateMoneySaved(hours: number): number {
  const hourlyRate = 50;
  return hours * hourlyRate;
}

export function TimeSaved() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const isLoading = false; // TODO: Replace with actual loading state
  
  const visibleWorkflows = workflows.filter(w => !w.isTutorial && w.status === "running");
  
  const weekHours = useMemo(() => calculateTimeSavedForPeriod(workflows, 7), [workflows]);
  const monthHours = useMemo(() => calculateTimeSavedForPeriod(workflows, 30), [workflows]);
  
  const weekMoney = useMemo(() => calculateMoneySaved(weekHours), [weekHours]);
  const monthMoney = useMemo(() => calculateMoneySaved(monthHours), [monthHours]);
  
  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };
  
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (isLoading) {
    return <WidgetSkeleton rows={3} />;
  }
  
  return (
    <WidgetCard
      title="Time Saved"
      icon={<Clock className="h-5 w-5" />}
    >
      {visibleWorkflows.length > 0 ? (
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="week">Diese Woche</TabsTrigger>
          <TabsTrigger value="month">Dieser Monat</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <div className="text-center py-2">
            <p className="text-4xl font-bold gradient-text">{formatHours(weekHours)}</p>
            <p className="text-sm text-muted-foreground mt-1">Stunden gespart</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 rounded-lg py-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">{formatMoney(weekMoney)}</span>
            <span className="text-sm text-muted-foreground">gespart</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">+23%</span>
            <span>vs letzte Woche</span>
          </div>
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          <div className="text-center py-2">
            <p className="text-4xl font-bold gradient-text">{formatHours(monthHours)}</p>
            <p className="text-sm text-muted-foreground mt-1">Stunden gespart</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 rounded-lg py-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">{formatMoney(monthMoney)}</span>
            <span className="text-sm text-muted-foreground">gespart</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">+18%</span>
            <span>vs letzter Monat</span>
          </div>
        </TabsContent>
      </Tabs>
      ) : (
        <EmptyState
          icon={Clock}
          title="No Time Saved Yet"
          description="Start running workflows to see how much time and money you're saving."
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
