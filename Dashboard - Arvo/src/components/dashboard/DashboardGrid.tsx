import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, X, Settings2, Eye, EyeOff, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setEncryptedObject, getEncryptedObject } from "@/lib/crypto";
import { ActiveWorkflows } from "./widgets/ActiveWorkflows";
import { RealTimeInsights } from "./widgets/RealTimeInsights";
import { NextTriggers } from "./widgets/NextTriggers";
import { IntegrationsHealth } from "./widgets/IntegrationsHealth";
import { TeamActivity } from "./widgets/TeamActivity";
import { PerformanceMetrics } from "./widgets/PerformanceMetrics";
import { TimeSaved } from "./widgets/TimeSaved";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimeRangeFilter, TimeRange } from "./TimeRangeFilter";
import { cn } from "@/lib/utils";

type WidgetId = 
  | "activeWorkflows"
  | "realTimeInsights"
  | "nextTriggers"
  | "integrationsHealth"
  | "performanceMetrics"
  | "teamActivity"
  | "timeSaved";

interface WidgetConfig {
  id: WidgetId;
  label: string;
  visible: boolean;
  className: string; // Tailwind classes for grid layout
  minHeight: string;
}

interface DashboardLayout {
  widgets: Record<WidgetId, boolean>;
  savedAt?: string;
}

const defaultWidgetConfigs: WidgetConfig[] = [
  {
    id: "activeWorkflows",
    label: "Aktive Workflows",
    visible: true,
    className: "sm:col-span-2 lg:col-span-6 xl:col-span-5",
    minHeight: "320px",
  },
  {
    id: "realTimeInsights",
    label: "Real-Time Insights",
    visible: true,
    className: "sm:col-span-2 lg:col-span-6 xl:col-span-7",
    minHeight: "320px",
  },
  {
    id: "nextTriggers",
    label: "Nächste Trigger",
    visible: true,
    className: "sm:col-span-1 lg:col-span-4",
    minHeight: "240px",
  },
  {
    id: "integrationsHealth",
    label: "Integrations-Status",
    visible: true,
    className: "sm:col-span-1 lg:col-span-4",
    minHeight: "240px",
  },
  {
    id: "performanceMetrics",
    label: "Performance-Metriken",
    visible: true,
    className: "sm:col-span-2 lg:col-span-4",
    minHeight: "240px",
  },
  {
    id: "teamActivity",
    label: "Team-Aktivität",
    visible: true,
    className: "sm:col-span-2 lg:col-span-8",
    minHeight: "260px",
  },
  {
    id: "timeSaved",
    label: "Zeit gespart",
    visible: true,
    className: "sm:col-span-2 lg:col-span-4",
    minHeight: "260px",
  },
];

const widgetComponents: Record<WidgetId, React.ComponentType> = {
  activeWorkflows: ActiveWorkflows,
  realTimeInsights: RealTimeInsights,
  nextTriggers: NextTriggers,
  integrationsHealth: IntegrationsHealth,
  performanceMetrics: PerformanceMetrics,
  teamActivity: TeamActivity,
  timeSaved: TimeSaved,
};

function DashboardGridContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { timeRange, setTimeRange } = useDashboard();
  const [isEditMode, setIsEditMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(defaultWidgetConfigs);

  // Lade gespeichertes Layout
  useEffect(() => {
    try {
      const saved = getEncryptedObject<DashboardLayout>("dashboard_grid_layout");
      if (saved?.widgets) {
        setWidgetConfigs(prevConfigs =>
          prevConfigs.map(config => ({
            ...config,
            visible: saved.widgets[config.id] ?? config.visible,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading dashboard layout:", error);
    }
  }, []);

  // Speichere Layout
  const saveLayout = useCallback(() => {
    try {
      const layout: DashboardLayout = {
        widgets: widgetConfigs.reduce((acc, config) => {
          acc[config.id] = config.visible;
          return acc;
        }, {} as Record<WidgetId, boolean>),
        savedAt: new Date().toISOString(),
      };
      setEncryptedObject("dashboard_grid_layout", layout);
      toast({
        title: "Layout gespeichert",
        description: "Ihr Dashboard-Layout wurde erfolgreich gespeichert.",
      });
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      toast({
        title: "Fehler",
        description: "Layout konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  }, [widgetConfigs, toast]);

  const toggleWidgetVisibility = (widgetId: WidgetId) => {
    setWidgetConfigs(prevConfigs =>
      prevConfigs.map(config =>
        config.id === widgetId ? { ...config, visible: !config.visible } : config
      )
    );
  };

  const handleSaveSettings = () => {
    saveLayout();
    setSettingsOpen(false);
    setIsEditMode(false);
  };

  const handleResetLayout = () => {
    setWidgetConfigs(defaultWidgetConfigs);
    toast({
      title: "Layout zurückgesetzt",
      description: "Das Standard-Layout wurde wiederhergestellt.",
    });
  };

  const renderWidget = (config: WidgetConfig) => {
    const WidgetComponent = widgetComponents[config.id];
    if (!config.visible || !WidgetComponent) return null;

    return (
      <div
        key={config.id}
        className={cn(
          config.className,
          `min-h-[${config.minHeight}]`,
          "relative"
        )}
      >
        {isEditMode && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
              onClick={() => toggleWidgetVisibility(config.id)}
              title={config.visible ? "Ausblenden" : "Einblenden"}
            >
              {config.visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        <WidgetComponent />
      </div>
    );
  };

  const handleExportData = () => {
    toast({
      title: "Export gestartet",
      description: "Ihre Dashboard-Daten werden vorbereitet...",
    });
    // TODO: Implementiere Export-Funktionalität
  };

  const handleCreateWorkflow = () => {
    navigate("/workflows/marketing");
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-6 min-h-full w-full">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Quick Actions */}
        <QuickActions 
          onExport={handleExportData}
          onCreateWorkflow={handleCreateWorkflow}
        />

        {/* Header mit Edit-Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Übersicht über Ihre Workflows und Metriken
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TimeRangeFilter
              value={timeRange}
              onChange={setTimeRange}
            />
            {isEditMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetLayout}
                >
                  Zurücksetzen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Einstellungen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveSettings}
                >
                  Speichern
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditMode(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
              </>
            )}
            {!isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            )}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-min">
          {widgetConfigs.map(config => renderWidget(config))}
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Widget-Einstellungen</DialogTitle>
            <DialogDescription>
              Wählen Sie aus, welche Widgets auf dem Dashboard angezeigt werden sollen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {widgetConfigs.map(config => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Label htmlFor={config.id} className="font-medium cursor-pointer">
                    {config.label}
                  </Label>
                </div>
                <Switch
                  id={config.id}
                  checked={config.visible}
                  onCheckedChange={() => toggleWidgetVisibility(config.id)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveSettings}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DashboardGrid() {
  return (
    <DashboardProvider>
      <DashboardGridContent />
    </DashboardProvider>
  );
}
