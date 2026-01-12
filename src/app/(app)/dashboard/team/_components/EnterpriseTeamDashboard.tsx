"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Download,
  Save,
  Upload,
  Maximize2,
  Star,
  StarOff,
  FileSpreadsheet,
  FileText,
  LayoutTemplate,
  GitCompare,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { useSectionGradient } from "@/lib/sectionGradients";
import { useLiveUpdates } from "@/hooks/use-live-updates";
// import { CalendarWidget } from "@/components/dashboard/widgets/CalendarWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumStatCard } from "@/components/dashboard/PremiumStatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { dashboardTemplates } from "@/lib/dashboardTemplates";
import {
  exportDashboardAsPDF,
  exportDashboardToExcel,
  type ExportDashboardData,
} from "@/lib/dashboardExport";
import type { DashboardData } from "@/lib/dashboardTypes";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { setEncryptedObject, getEncryptedObject } from "@/lib/crypto";
import { useUser } from "@clerk/nextjs";
import { useTeamDashboard } from "./TeamDashboardProvider";

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "zap" | "activity" | "users" | "clock";
}

interface ChartDataPoint {
  name: string;
  workflows: number;
  executions: number;
}

interface Activity {
  id: string;
  workflow: string;
  status: "success" | "running" | "error";
  time: string;
}

interface TopWorkflow {
  id: string;
  name: string;
  executions: number;
  success: number;
}

// DashboardData is imported from @/lib/dashboardTypes

type WidgetType = "stat" | "chart" | "activity" | "workflow";

interface Widget {
  id: string;
  type: WidgetType;
  data: StatCard | ChartDataPoint | Activity | TopWorkflow;
}

// Animated Value Component
function AnimatedValue({
  value,
  isHighlight,
}: {
  value: string;
  isHighlight: boolean;
}) {
  // Extract numeric value and format
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, "")) || 0;
  const hasPercent = value.includes("%");
  const hasK = value.includes("K");
  const hasM = value.includes("M");

  const { displayValue } = useCountUp(value, {
    duration: 1500,
    decimals: hasPercent || hasK || hasM ? 1 : 0,
  });

  return (
    <p
      className={cn(
        "text-2xl font-bold transition-all duration-300",
        isHighlight && "text-white",
      )}
    >
      {displayValue}
    </p>
  );
}

// Sortable Stat Card Component
function SortableStatCard({
  stat,
  isEditing,
  onEdit,
  onDelete,
  sectionGradient,
}: {
  stat: StatCard;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  sectionGradient: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stat.id });
  const Icon = iconMap[stat.icon];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isHighlight = stat.id === "1"; // Erste Stat-Card als Highlight

  const cardStyle = isHighlight ? { ...style, background: sectionGradient } : style;

  return (
    <Card ref={setNodeRef} style={cardStyle} className={isHighlight ? "border-2 border-transparent" : ""}>
      <CardContent className="p-6 relative">
        {isEditing && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center justify-between mb-4">
            {isHighlight ? (
              <div
                className="p-2 rounded-lg"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div
                  className={cn(
                  "p-2 rounded-lg",
                  stat.icon === "zap" && "bg-primary/10 dark:bg-primary/20",
                  stat.icon === "activity" && "bg-primary/10 dark:bg-primary/20",
                  stat.icon === "users" && "bg-blue-500/10 dark:bg-blue-500/20",
                  stat.icon === "clock" && "bg-purple-500/10 dark:bg-purple-500/20",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    stat.icon === "zap" && "text-primary",
                    stat.icon === "activity" && "text-primary",
                    stat.icon === "users" && "text-blue-500 dark:text-blue-400",
                    stat.icon === "clock" && "text-purple-500 dark:text-purple-400",
                  )}
                />
              </div>
            )}
            {stat.trend === "up" ? (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  isHighlight ? "text-white" : "text-green-600",
                )}
              >
                <ArrowUpRight className="h-4 w-4" />
                {stat.change}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <ArrowDownRight className="h-4 w-4" />
                {stat.change}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <AnimatedValue value={stat.value} isHighlight={isHighlight} />
            <p
              className={cn(
                "text-sm",
                isHighlight ? "text-white/90" : "text-muted-foreground",
              )}
            >
              {stat.title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sortable Widget Section Component (für große Widgets)
function SortableWidgetSection({
  id,
  isEditing,
  children,
  onDelete,
}: {
  id: string;
  isEditing: boolean;
  children: React.ReactNode;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "shadow-lg ring-2 ring-primary z-50",
      )}
    >
      {isEditing && onDelete && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          isEditing && "cursor-grab active:cursor-grabbing",
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Sortable Activity Item Component
function SortableActivityItem({
  activity,
  isEditing,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between group relative",
        isDragging && "shadow-lg ring-2 ring-primary z-50",
      )}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing",
          isEditing && "pr-10",
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            activity.status === "success" && "bg-primary",
            activity.status === "running" && "bg-blue-500 animate-pulse",
            activity.status === "error" && "bg-red-500",
          )}
        />
        <div>
          <p className="text-sm font-medium">{activity.workflow}</p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={
            activity.status === "success"
              ? "default"
              : activity.status === "running"
              ? "secondary"
              : "destructive"
          }
        >
          {activity.status === "success"
            ? "Erfolg"
            : activity.status === "running"
            ? "Läuft"
            : "Fehler"}
        </Badge>
        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onEdit}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Sortable Workflow Item Component
function SortableWorkflowItem({
  workflow,
  isEditing,
  onEdit,
  onDelete,
}: {
  workflow: TopWorkflow;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: workflow.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "space-y-2 group relative",
        isDragging && "shadow-lg ring-2 ring-primary z-50",
      )}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "cursor-grab active:cursor-grabbing",
          isEditing && "pr-10",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{workflow.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {workflow.executions} Ausführungen
            </span>
            {!isEditing && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onEdit}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <Progress value={workflow.success} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {workflow.success}% Erfolgsrate
        </p>
      </div>
    </div>
  );
}

const defaultStats: StatCard[] = [
  { id: "1", title: "Aktive Workflows", value: "0", change: "0%", trend: "up", icon: "zap" },
  { id: "2", title: "Ausführungen heute", value: "0", change: "0%", trend: "up", icon: "activity" },
  { id: "3", title: "Team-Mitglieder", value: "0", change: "0", trend: "up", icon: "users" },
  { id: "4", title: "Durchschnittliche Laufzeit", value: "0s", change: "0%", trend: "down", icon: "clock" },
];

const iconMap = {
  zap: Zap,
  activity: Activity,
  users: Users,
  clock: Clock,
};

// Beispiel-Daten für Admin
const adminExampleStats: StatCard[] = [
  { id: "1", title: "Aktive Workflows", value: "24", change: "+12%", trend: "up", icon: "zap" },
  { id: "2", title: "Ausführungen heute", value: "1,247", change: "+8%", trend: "up", icon: "activity" },
  { id: "3", title: "Team-Mitglieder", value: "12", change: "+2", trend: "up", icon: "users" },
  { id: "4", title: "Durchschnittliche Laufzeit", value: "2.4s", change: "-15%", trend: "down", icon: "clock" },
];

const adminExampleChartData: ChartDataPoint[] = [
  { name: "Mo", workflows: 120, executions: 800 },
  { name: "Di", workflows: 190, executions: 1200 },
  { name: "Mi", workflows: 300, executions: 1500 },
  { name: "Do", workflows: 280, executions: 1400 },
  { name: "Fr", workflows: 350, executions: 1800 },
  { name: "Sa", workflows: 240, executions: 1100 },
  { name: "So", workflows: 180, executions: 900 },
];

const adminExampleActivities: Activity[] = [
  { id: "1", workflow: "Email Campaign", status: "success", time: "vor 5 Min" },
  { id: "2", workflow: "Data Sync", status: "success", time: "vor 12 Min" },
  { id: "3", workflow: "Invoice Generation", status: "running", time: "Läuft" },
  { id: "4", workflow: "Lead Scoring", status: "success", time: "vor 1 Std" },
  { id: "5", workflow: "Report Export", status: "error", time: "vor 2 Std" },
];

const adminExampleWorkflows: TopWorkflow[] = [
  { id: "1", name: "Marketing Automation", executions: 1247, success: 98 },
  { id: "2", name: "Data Synchronization", executions: 892, success: 95 },
  { id: "3", name: "Invoice Processing", executions: 654, success: 99 },
  { id: "4", name: "Lead Management", executions: 432, success: 97 },
];

export function EnterpriseTeamDashboard() {
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  // Check if user is admin from publicMetadata (optional, can be set in Clerk Dashboard)
  const isAdmin = (user?.publicMetadata?.isAdmin as boolean) || false;
  const sectionGradient = useSectionGradient(); // Dashboard-Gradient: var(--gradient-dashboard)
  
  // Prevent hydration mismatch by only rendering DropdownMenu after mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("[EnterpriseTeamDashboard] Component mounted", { isLoaded, isAdmin, user: user?.id });
  }, [isLoaded, isAdmin, user]);
  
  const isLoading = !isLoaded;
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [stats, setStats] = useState<StatCard[]>(defaultStats);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topWorkflows, setTopWorkflows] = useState<TopWorkflow[]>([]);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(["stats", "charts", "activities-workflows"]);
  const [visibleWidgets, setVisibleWidgets] = useState<{
    chartWorkflowActivity: boolean;
    chartExecutions: boolean;
    activities: boolean;
    workflows: boolean;
    calendar: boolean;
  }>({
    chartWorkflowActivity: true,
    chartExecutions: true,
    activities: true,
    workflows: true,
    calendar: true,
  });
  
  const [editingStat, setEditingStat] = useState<StatCard | null>(null);
  const [editingChart, setEditingChart] = useState<ChartDataPoint | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<TopWorkflow | null>(null);
  
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  const [fullscreenWidget, setFullscreenWidget] = useState<{type: string; data: any} | null>(null);
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Initialisiere Sensoren für Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Lade gespeicherte Daten (nur für normale User, Admin behält Beispiel-Daten)
  useEffect(() => {
    if (isLoading) return; // Warte bis Auth geladen ist
    
    if (isAdmin) {
      // Admin behält Beispiel-Daten
      setStats(adminExampleStats);
      setChartData(adminExampleChartData);
      setActivities(adminExampleActivities);
      setTopWorkflows(adminExampleWorkflows);
      return;
    }
    
    // Normale User: Lade gespeicherte Daten oder verwende Default
    if (user) {
      try {
        // Prüfe ob Daten im localStorage vorhanden sind
        const saved = getEncryptedObject<DashboardData>("dashboard_data");
        console.log("[Dashboard] Loading saved data:", saved ? "Found" : "Not found");
        
        if (saved) {
          console.log("[Dashboard] Restoring saved dashboard data");
          if (saved.stats && saved.stats.length > 0) {
            setStats(saved.stats);
            console.log("[Dashboard] Restored stats:", saved.stats.length);
          }
          if (saved.chartData && saved.chartData.length > 0) {
            setChartData(saved.chartData);
            console.log("[Dashboard] Restored chart data:", saved.chartData.length);
          }
          if (saved.activities && saved.activities.length > 0) {
            setActivities(saved.activities);
            console.log("[Dashboard] Restored activities:", saved.activities.length);
          }
          if (saved.topWorkflows && saved.topWorkflows.length > 0) {
            setTopWorkflows(saved.topWorkflows);
            console.log("[Dashboard] Restored workflows:", saved.topWorkflows.length);
          }
          if (saved.visibleWidgets) {
            setVisibleWidgets({
              chartWorkflowActivity: saved.visibleWidgets.chartWorkflowActivity ?? true,
              chartExecutions: saved.visibleWidgets.chartExecutions ?? true,
              activities: saved.visibleWidgets.activities ?? true,
              workflows: saved.visibleWidgets.workflows ?? true,
              calendar: (saved.visibleWidgets as any).calendar ?? true,
            });
            console.log("[Dashboard] Restored visible widgets");
          }
        } else {
          console.log("[Dashboard] No saved data found, using default data");
          // Verwende Default-Daten, wenn keine gespeicherten Daten vorhanden sind
          setStats(defaultStats);
          // Setze leere Arrays für Charts, Activities und Workflows
          // Diese können später vom User befüllt werden
          setChartData([]);
          setActivities([]);
          setTopWorkflows([]);
        }
      } catch (error) {
        console.error("[Dashboard] Error loading dashboard data:", error);
        // Bei Fehler, verwende Default-Daten
        setStats(defaultStats);
      }
    }
  }, [isAdmin, user, isLoading]);

  // Drag & Drop Handler für Stats
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStats((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Drag & Drop Handler für Activities
  const handleActivityDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActivities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Drag & Drop Handler für Workflows
  const handleWorkflowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTopWorkflows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Drag & Drop Handler für große Widgets (Chart Cards, Activities/Workflows Cards)
  const handleWidgetDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Hier können wir später die Reihenfolge der großen Widgets ändern
      // Aktuell werden Chart Cards, Activities und Workflows vertauscht
      toast({ 
        title: "Widget verschoben", 
        description: `${active.id} wurde verschoben` 
      });
    }
  };

  // Chart Widget IDs
  const chartWidgetIds = ["chart-workflow-activity", "chart-executions"];

  // Speichere Daten (nur für normale User, nicht für Admin)
  const saveData = () => {
    if (isAdmin) return; // Admin-Daten werden nicht gespeichert
    
    try {
      const data: DashboardData = {
        stats,
        chartData,
        activities,
        topWorkflows,
        visibleWidgets,
      };
      setEncryptedObject("dashboard_data", data);
    } catch (error) {
      console.error("Error saving dashboard data:", error);
    }
  };

  useEffect(() => {
    saveData();
  }, [stats, chartData, activities, topWorkflows, visibleWidgets, isAdmin]);

  // Live Updates - Simuliere Datenaktualisierungen
  const refreshDashboardData = useCallback(() => {
    if (isAdmin) return; // Admin-Daten werden nicht aktualisiert
    
    // Simuliere leichte Änderungen an den Stats
    setStats(prevStats => 
      prevStats.map(stat => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const currentValue = parseFloat(stat.value.replace(/[^0-9.-]/g, '')) || 0;
        const newValue = Math.max(0, currentValue + change * Math.floor(Math.random() * 5));
        
        return {
          ...stat,
          value: stat.value.includes('%') 
            ? `${newValue.toFixed(1)}%`
            : stat.value.includes('K')
            ? `${(newValue / 1000).toFixed(1)}K`
            : Math.floor(newValue).toString(),
          change: change > 0 
            ? `+${Math.floor(Math.random() * 5)}%`
            : `-${Math.floor(Math.random() * 5)}%`,
          trend: change > 0 ? "up" : "down",
        };
      })
    );
  }, [isAdmin]);

  // Live Updates Hook - Aktualisiert Dashboard-Daten alle 30 Sekunden
  useLiveUpdates({
    interval: 30000, // 30 Sekunden
    enabled: !isAdmin && !isEditMode,
    onUpdate: refreshDashboardData,
  });

  const handleAddStat = () => {
    const newStat: StatCard = {
      id: Date.now().toString(),
      title: "Neue Statistik",
      value: "0",
      change: "0%",
      trend: "up",
      icon: "zap",
    };
    setEditingStat(newStat);
    setStatDialogOpen(true);
  };

  const handleEditStat = (stat: StatCard) => {
    setEditingStat(stat);
    setStatDialogOpen(true);
  };

  const handleSaveStat = () => {
    if (!editingStat) return;
    
    const updated = editingStat.id 
      ? stats.map(s => s.id === editingStat.id ? editingStat : s)
      : [...stats, editingStat];
    
    setStats(updated);
    setStatDialogOpen(false);
    setEditingStat(null);
    toast({ title: "Statistik gespeichert" });
  };

  const handleDeleteStat = (id: string) => {
    setStats(stats.filter(s => s.id !== id));
    toast({ title: "Statistik gelöscht" });
  };

  // Vordefinierte Chart-Daten-Optionen
  const predefinedChartOptions: ChartDataPoint[] = [
    { name: "Mo", workflows: 120, executions: 800 },
    { name: "Di", workflows: 190, executions: 1200 },
    { name: "Mi", workflows: 300, executions: 1500 },
    { name: "Do", workflows: 280, executions: 1400 },
    { name: "Fr", workflows: 350, executions: 1800 },
    { name: "Sa", workflows: 240, executions: 1100 },
    { name: "So", workflows: 180, executions: 900 },
  ];

  const handleAddChartData = (option?: ChartDataPoint) => {
    if (option) {
      // Prüfe ob bereits vorhanden
      if (chartData.find(d => d.name === option.name)) {
        toast({ title: "Fehler", description: "Ein Eintrag mit diesem Namen existiert bereits", variant: "destructive" });
        return;
      }
      setChartData([...chartData, option]);
      toast({ title: "Chart-Daten hinzugefügt" });
    } else {
      const newData: ChartDataPoint = {
        name: "",
        workflows: 0,
        executions: 0,
      };
      setEditingChart(newData);
      setChartDialogOpen(true);
    }
  };

  const handleEditChartData = (data: ChartDataPoint, index: number) => {
    setEditingChart({ ...data, name: data.name || `Tag ${index + 1}` });
    setChartDialogOpen(true);
  };

  const handleSaveChartData = () => {
    if (!editingChart) return;
    
    if (editingChart.name && chartData.find(d => d.name === editingChart!.name && d !== editingChart)) {
      toast({ title: "Fehler", description: "Ein Eintrag mit diesem Namen existiert bereits", variant: "destructive" });
      return;
    }
    
    const existingIndex = chartData.findIndex(d => d.name === editingChart!.name);
    if (existingIndex >= 0) {
      const updated = [...chartData];
      updated[existingIndex] = editingChart;
      setChartData(updated);
    } else {
      setChartData([...chartData, editingChart]);
    }
    
    setChartDialogOpen(false);
    setEditingChart(null);
    toast({ title: "Chart-Daten gespeichert" });
  };

  const handleDeleteChartData = (name: string) => {
    setChartData(chartData.filter(d => d.name !== name));
    toast({ title: "Chart-Daten gelöscht" });
  };

  const handleAddActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      workflow: "",
      status: "success",
      time: "gerade eben",
    };
    setEditingActivity(newActivity);
    setActivityDialogOpen(true);
  };

  const handleSaveActivity = () => {
    if (!editingActivity) return;
    
    const updated = editingActivity.id && activities.find(a => a.id === editingActivity!.id)
      ? activities.map(a => a.id === editingActivity!.id ? editingActivity : a)
      : [...activities, editingActivity];
    
    setActivities(updated);
    setActivityDialogOpen(false);
    setEditingActivity(null);
    toast({ title: "Aktivität gespeichert" });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    toast({ title: "Aktivität gelöscht" });
  };

  const handleAddWorkflow = () => {
    const newWorkflow: TopWorkflow = {
      id: Date.now().toString(),
      name: "",
      executions: 0,
      success: 0,
    };
    setEditingWorkflow(newWorkflow);
    setWorkflowDialogOpen(true);
  };

  const handleSaveWorkflow = () => {
    if (!editingWorkflow) return;
    
    const updated = editingWorkflow.id && topWorkflows.find(w => w.id === editingWorkflow!.id)
      ? topWorkflows.map(w => w.id === editingWorkflow!.id ? editingWorkflow : w)
      : [...topWorkflows, editingWorkflow];
    
    setTopWorkflows(updated);
    setWorkflowDialogOpen(false);
    setEditingWorkflow(null);
    toast({ title: "Workflow gespeichert" });
  };

  const handleDeleteWorkflow = (id: string) => {
    setTopWorkflows(topWorkflows.filter(w => w.id !== id));
    toast({ title: "Workflow gelöscht" });
  };

  // Export Dashboard als JSON
  const handleExportDashboard = () => {
    const data: DashboardData = {
      stats,
      chartData,
      activities,
      topWorkflows,
      visibleWidgets,
      widgetOrder,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Dashboard exportiert", description: "Die Daten wurden als JSON heruntergeladen." });
  };

  // Import Dashboard aus JSON
  const handleImportDashboard = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as DashboardData;
          
          if (data.stats) setStats(data.stats);
          if (data.chartData) setChartData(data.chartData);
          if (data.activities) setActivities(data.activities);
          if (data.topWorkflows) setTopWorkflows(data.topWorkflows);
          if (data.visibleWidgets) setVisibleWidgets({
            ...visibleWidgets,
            ...data.visibleWidgets,
            calendar: data.visibleWidgets.calendar ?? visibleWidgets.calendar,
          });
          if (data.widgetOrder) setWidgetOrder(data.widgetOrder);
          
          toast({ title: "Dashboard importiert", description: "Die Daten wurden erfolgreich geladen." });
        } catch (error) {
          toast({ 
            title: "Import fehlgeschlagen", 
            description: "Die Datei konnte nicht gelesen werden.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Export Dashboard als Image (Screenshot)
  const dashboardRef = useRef<HTMLDivElement>(null);
  const handleExportAsImage = async () => {
    if (!dashboardRef.current) {
      toast({
        title: "Fehler",
        description: "Dashboard-Container nicht gefunden",
        variant: "destructive"
      });
      return;
    }

    try {
      // @ts-ignore - html2canvas is optional and dynamically imported
      const html2canvas = (await import("html2canvas")).default;
      toast({
        title: "Export gestartet",
        description: "Dashboard wird als Bild exportiert...",
      });

      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor || '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          throw new Error("Konnte Bild nicht erstellen");
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dashboard-${new Date().toISOString().split("T")[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Export erfolgreich",
          description: "Dashboard wurde als Bild exportiert.",
        });
      }, "image/png");
    } catch (error) {
      console.error("Fehler beim Export:", error);
      toast({
        title: "Export fehlgeschlagen",
        description: "Fehler beim Erstellen des Screenshots",
        variant: "destructive"
      });
    }
  };

  // Speichere Layout-Konfiguration
  const handleSaveLayout = () => {
    const layoutConfig = {
      stats,
      chartData,
      activities,
      topWorkflows,
      visibleWidgets,
      widgetOrder,
      savedAt: new Date().toISOString(),
    };
    
    try {
      setEncryptedObject("dashboard_layout", layoutConfig);
      toast({ title: "Layout gespeichert", description: "Ihr Dashboard-Layout wurde gespeichert." });
    } catch (error) {
      toast({ 
        title: "Fehler", 
        description: "Layout konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  // Lade Layout-Konfiguration
  const handleLoadLayout = () => {
    try {
      const layout = getEncryptedObject<DashboardData & { savedAt?: string; widgetOrder?: string[] }>("dashboard_layout");
      if (!layout) {
        toast({ 
          title: "Kein Layout gefunden", 
          description: "Es wurde kein gespeichertes Layout gefunden.",
        });
        return;
      }
      
      if (layout.stats) setStats(layout.stats);
      if (layout.chartData) setChartData(layout.chartData);
      if (layout.activities) setActivities(layout.activities);
      if (layout.topWorkflows) setTopWorkflows(layout.topWorkflows);
      if (layout.visibleWidgets) setVisibleWidgets({
        ...visibleWidgets,
        ...layout.visibleWidgets,
        calendar: layout.visibleWidgets.calendar ?? visibleWidgets.calendar,
      });
      if (layout.widgetOrder) setWidgetOrder(layout.widgetOrder);
      
      toast({ title: "Layout geladen", description: "Ihr Dashboard-Layout wurde wiederhergestellt." });
    } catch (error) {
      toast({ 
        title: "Fehler", 
        description: "Layout konnte nicht geladen werden.",
        variant: "destructive"
      });
    }
  };

  // Template Handler
  const handleApplyTemplate = (template: typeof dashboardTemplates[0]) => {
    setStats(template.stats.map((s, i) => ({ ...s, id: (i + 1).toString() })));
    setChartData(template.chartData);
    setActivities(template.activities.map((a, i) => ({ ...a, id: (i + 1).toString() })));
    setTopWorkflows(template.topWorkflows.map((w, i) => ({ ...w, id: (i + 1).toString() })));
    setVisibleWidgets(template.visibleWidgets);
    setTemplateDialogOpen(false);
    toast({ title: "Template angewendet", description: `Template "${template.name}" wurde erfolgreich angewendet.` });
  };

  // Export Handler - PDF
  const handleExportAsPDF = async () => {
    if (!dashboardRef.current) {
      toast({ title: "Fehler", description: "Dashboard-Container nicht gefunden", variant: "destructive" });
      return;
    }
    try {
      await exportDashboardAsPDF(dashboardRef.current, "dashboard");
      toast({ title: "Export erfolgreich", description: "Dashboard wurde als PDF exportiert." });
    } catch (error: any) {
      if (error.message?.includes("jsPDF")) {
        toast({ title: "PDF-Export nicht verfügbar", description: "jsPDF wird benötigt. Bitte installieren Sie jspdf.", variant: "destructive" });
      } else {
        toast({ title: "Export fehlgeschlagen", description: error.message || "Fehler beim PDF-Export", variant: "destructive" });
      }
    }
  };

  // Export Handler - Excel
  const handleExportAsExcel = () => {
    const data: ExportDashboardData = {
      stats,
      chartData,
      activities,
      topWorkflows,
      visibleWidgets,
      widgetOrder,
    };
    exportDashboardToExcel(data, "dashboard");
    toast({ title: "Export erfolgreich", description: "Dashboard wurde als Excel (CSV) exportiert." });
  };

  // Favoriten/Pinned Items Handler
  const togglePin = (itemId: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        toast({ title: "Entfernt", description: "Item wurde von Favoriten entfernt." });
      } else {
        newSet.add(itemId);
        toast({ title: "Hinzugefügt", description: "Item wurde zu Favoriten hinzugefügt." });
      }
      // Speichere Favoriten
      try {
        setEncryptedObject("dashboard_pinned_items", Array.from(newSet));
      } catch (error) {
        console.error("Error saving pinned items:", error);
      }
      return newSet;
    });
  };

  // Lade gespeicherte Favoriten
  useEffect(() => {
    try {
      const saved = getEncryptedObject<string[]>("dashboard_pinned_items");
      if (saved && Array.isArray(saved)) {
        setPinnedItems(new Set(saved));
      }
    } catch (error) {
      console.error("Error loading pinned items:", error);
    }
  }, []);

  // Widget Vollbild Handler
  const handleFullscreenWidget = (type: string, data: any) => {
    setFullscreenWidget({ type, data });
  };

  // Vergleichs-Modus Handler
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    toast({
      title: comparisonMode ? "Vergleichsmodus deaktiviert" : "Vergleichsmodus aktiviert",
      description: comparisonMode ? "Vergleichsansicht wurde geschlossen." : "Zeigen Sie Daten im Vergleich an.",
    });
  };

  // Loading state - zeige Loading, wenn noch geladen wird
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 min-h-full w-full">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="space-y-16 lg:space-y-24 w-full" style={{ backgroundColor: 'transparent' }}>
      {/* Header Section - Design Showcase Style */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 blur-2xl rounded-3xl" />
            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-[#6366f1]/10 to-[#ec4899]/10 border border-[#6366f1]/20 backdrop-blur-xl">
              <LayoutDashboard className="w-7 h-7 text-[#6366f1]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-[#0f172a] dark:text-[#f8fafc] tracking-[-0.05em] leading-none mb-3">
              Dashboard
            </h1>
            <div className="h-[2px] w-24 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] rounded-full" />
          </div>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-[#64748b] dark:text-[#94a3b8] leading-relaxed max-w-3xl font-medium">
          Verwalten Sie Ihre eigenen Daten. Enterprise Plan mit vollständigem Zugang zu allen Features.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {!isEditMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveLayout}
                title="Layout speichern"
              >
                <Save className="h-4 w-4 mr-2" />
                Layout speichern
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadLayout}
                title="Layout laden"
              >
                <Upload className="h-4 w-4 mr-2" />
                Layout laden
              </Button>
              {mounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportDashboard}>
                      <FileText className="h-4 w-4 mr-2" />
                      Als JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportAsImage}>
                      <Download className="h-4 w-4 mr-2" />
                      Als Bild (PNG)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportAsPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Als PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportAsExcel}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Als Excel (CSV)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplateDialogOpen(true)}
                title="Template auswählen"
              >
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                title="Team-Einstellungen"
              >
                <Link href="/dashboard/team/settings">
                  <Users className="h-4 w-4 mr-2" />
                  Team-Einstellungen
                </Link>
              </Button>
            </>
          )}
          <Button
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditMode ? "Bearbeitung beenden" : "Bearbeiten"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={stats.map(s => s.id)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <SortableStatCard
                  key={stat.id}
                  stat={stat}
                  isEditing={isEditMode}
                  onEdit={() => handleEditStat(stat)}
                  onDelete={() => handleDeleteStat(stat.id)}
                  sectionGradient={sectionGradient}
                />
              ))}
              {isEditMode && (
                <Card 
                  className="border-dashed border-2 cursor-pointer hover:border-primary/50 transition-colors min-h-[120px] border-muted-foreground/30"
                  style={{ borderColor: "transparent", background: sectionGradient }}
                  onClick={() => {
                    if (isAdmin) {
                      setAddWidgetDialogOpen(true);
                    } else {
                      toast({ title: "Berechtigung erforderlich", description: "Nur Admins können Widgets hinzufügen" });
                    }
                  }}
                >
                  <CardContent className="p-6 flex items-center justify-center h-full min-h-[120px]">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Plus className="h-8 w-8" />
                      <span className="text-sm font-medium">Widget hinzufügen</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            const trendValue = stat.change ? parseInt(stat.change.replace(/\D/g, '')) || 0 : 0;
            const isPositive = stat.trend === "up";
            return (
              <div key={stat.id} className="relative group">
                <PremiumStatCard
                  title={stat.title}
                  value={stat.value}
                  description={stat.change || undefined}
                  icon={Icon}
                  trend={stat.change ? { value: trendValue, isPositive } : undefined}
                  delay={index * 100}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:bg-accent" 
                    onClick={(e) => { e.stopPropagation(); togglePin(`stat-${stat.id}`); }}
                    title={pinnedItems.has(`stat-${stat.id}`) ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                  >
                    {pinnedItems.has(`stat-${stat.id}`) ? (
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 transition-transform duration-200" />
                    ) : (
                      <StarOff className="h-3 w-3 transition-transform duration-200" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:bg-accent" 
                    onClick={(e) => { e.stopPropagation(); handleFullscreenWidget("stat", stat); }}
                    title="Vollbild anzeigen"
                  >
                    <Maximize2 className="h-3 w-3 transition-transform duration-200" />
                  </Button>
                  {!isAdmin && (
                    <>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditStat(stat)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteStat(stat.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleWidgetDragEnd}
        >
          <SortableContext items={chartWidgetIds}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleWidgets.chartWorkflowActivity && (
              <SortableWidgetSection id="chart-workflow-activity" isEditing={isEditMode} onDelete={() => {
                setVisibleWidgets({ ...visibleWidgets, chartWorkflowActivity: false });
                toast({ title: "Widget entfernt", description: "Chart-Widget wurde ausgeblendet" });
              }}>
                <Card className="relative">
                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => {
                        toast({ title: "Chart kann nicht gelöscht werden", description: "Chart-Widgets werden derzeit nicht gelöscht" });
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Workflow-Aktivität</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <p>Keine Daten vorhanden</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4facfe" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: "#9ca3b4", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                          />
                          <YAxis 
                            tick={{ fill: "#9ca3b4", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: "#161821", 
                              border: "1px solid rgba(96, 165, 250, 0.3)",
                              borderRadius: "8px",
                              color: "#f8fafc"
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="workflows" 
                            stroke="#4facfe" 
                            strokeWidth={3}
                            fill="url(#colorWorkflows)" 
                            fillOpacity={1}
                            animationDuration={800}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </SortableWidgetSection>
              )}

              {visibleWidgets.chartExecutions && (
              <SortableWidgetSection id="chart-executions" isEditing={isEditMode} onDelete={() => {
                setVisibleWidgets({ ...visibleWidgets, chartExecutions: false });
                toast({ title: "Widget entfernt", description: "Chart-Widget wurde ausgeblendet" });
              }}>
                <Card className="relative">
                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => {
                        toast({ title: "Chart kann nicht gelöscht werden", description: "Chart-Widgets werden derzeit nicht gelöscht" });
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ausführungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <p>Keine Daten vorhanden</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: "#9ca3b4", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                          />
                          <YAxis 
                            tick={{ fill: "#9ca3b4", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: "#161821", 
                              border: "1px solid rgba(96, 165, 250, 0.3)",
                              borderRadius: "8px",
                              color: "#f8fafc"
                            }} 
                          />
                          <Bar dataKey="executions" fill="#4facfe" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </SortableWidgetSection>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleWidgets.chartWorkflowActivity && (
          <Card>
            <CardHeader>
              <CardTitle>Workflow-Aktivität</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p>Keine Daten vorhanden</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorWorkflows2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="workflows" 
                      stroke="#4facfe" 
                      strokeWidth={3}
                      fill="url(#colorWorkflows2)" 
                      fillOpacity={1} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          )}

          {visibleWidgets.chartExecutions && (
          <Card>
            <CardHeader>
              <CardTitle>Ausführungen</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p>Keine Daten vorhanden</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }} 
                    />
                    <Bar dataKey="executions" fill="#4facfe" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          )}
        </div>
      )}

      {/* Calendar Widget */}
      {/* Calendar Widget temporarily disabled */}
      {/* {visibleWidgets.calendar && !isEditMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CalendarWidget />
          </div>
        </div>
      )} */}

      {/* Bottom Grid */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleWidgetDragEnd}
        >
          <SortableContext items={["activities", "workflows"]}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Widget temporarily disabled */}
              {/* {visibleWidgets.calendar && (
                <SortableWidgetSection id="calendar" isEditing={isEditMode} onDelete={() => {
                  setVisibleWidgets({ ...visibleWidgets, calendar: false });
                  toast({ title: "Widget entfernt", description: "Kalender-Widget wurde ausgeblendet" });
                }}>
                  <CalendarWidget />
                </SortableWidgetSection>
              )} */}
              {visibleWidgets.activities && (
              <SortableWidgetSection id="activities" isEditing={isEditMode} onDelete={() => {
                setVisibleWidgets({ ...visibleWidgets, activities: false });
                toast({ title: "Widget entfernt", description: "Aktivitäten-Widget wurde ausgeblendet" });
              }}>
                {/* Recent Activity */}
                <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Keine Aktivitäten vorhanden</p>
              </div>
            ) : isEditMode ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleActivityDragEnd}
              >
                <SortableContext items={activities.map(a => a.id)}>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <SortableActivityItem
                        key={activity.id}
                        activity={activity}
                        isEditing={isEditMode}
                        onEdit={() => { setEditingActivity(activity); setActivityDialogOpen(true); }}
                        onDelete={() => handleDeleteActivity(activity.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          activity.status === "success" && "bg-primary",
                          activity.status === "running" && "bg-blue-500 animate-pulse",
                          activity.status === "error" && "bg-red-500"
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">{activity.workflow}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "running"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {activity.status === "success" ? "Erfolg" : activity.status === "running" ? "Läuft" : "Fehler"}
                      </Badge>
                      {!isAdmin && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingActivity(activity); setActivityDialogOpen(true); }}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteActivity(activity.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
                </Card>
              </SortableWidgetSection>
              )}

              {visibleWidgets.workflows && (
              <SortableWidgetSection id="workflows" isEditing={isEditMode} onDelete={() => {
                setVisibleWidgets({ ...visibleWidgets, workflows: false });
                toast({ title: "Widget entfernt", description: "Workflows-Widget wurde ausgeblendet" });
              }}>
                {/* Top Workflows */}
                <Card>
          <CardHeader>
            <CardTitle>Top Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            {topWorkflows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Keine Workflows vorhanden</p>
              </div>
            ) : isEditMode ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleWorkflowDragEnd}
              >
                <SortableContext items={topWorkflows.map(w => w.id)}>
                  <div className="space-y-4">
                    {topWorkflows.map((workflow) => (
                      <SortableWorkflowItem
                        key={workflow.id}
                        workflow={workflow}
                        isEditing={isEditMode}
                        onEdit={() => { setEditingWorkflow(workflow); setWorkflowDialogOpen(true); }}
                        onDelete={() => handleDeleteWorkflow(workflow.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="space-y-4">
                {topWorkflows.map((workflow) => (
                  <div key={workflow.id} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{workflow.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{workflow.executions} Ausführungen</span>
                        {!isAdmin && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingWorkflow(workflow); setWorkflowDialogOpen(true); }}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteWorkflow(workflow.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        )}
                      </div>
                    </div>
                    <Progress value={workflow.success} className="h-2" />
                    <p className="text-xs text-muted-foreground">{workflow.success}% Erfolgsrate</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
                </Card>
              </SortableWidgetSection>
              )}
              
              {/* "+ Box" immer am Ende */}
              {isEditMode && (
                <div>
                  <Card 
                    className="border-dashed border-2 cursor-pointer hover:border-primary/50 transition-colors border-muted-foreground/30"
                    onClick={() => setAddWidgetDialogOpen(true)}
                  >
                    <CardContent className="p-6 flex items-center justify-center h-[300px]">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Plus className="h-8 w-8" />
                        <span className="text-sm">Widget hinzufügen</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Linke Spalte: Activities */}
          {visibleWidgets.activities && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Letzte Aktivitäten</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Keine Aktivitäten vorhanden</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              activity.status === "success" && "bg-primary",
                              activity.status === "running" && "bg-blue-500 animate-pulse",
                              activity.status === "error" && "bg-red-500"
                            )}
                          />
                          <div>
                            <p className="text-sm font-medium">{activity.workflow}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              activity.status === "success"
                                ? "default"
                                : activity.status === "running"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {activity.status === "success" ? "Erfolg" : activity.status === "running" ? "Läuft" : "Fehler"}
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingActivity(activity); setActivityDialogOpen(true); }}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteActivity(activity.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          )}

          {/* Rechte Spalte: Workflows */}
          {visibleWidgets.workflows && (
          /* Top Workflows */
          <Card>
            <CardHeader>
              <CardTitle>Top Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              {topWorkflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Keine Workflows vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topWorkflows.map((workflow) => (
                    <div key={workflow.id} className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{workflow.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{workflow.executions} Ausführungen</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingWorkflow(workflow); setWorkflowDialogOpen(true); }}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteWorkflow(workflow.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Progress value={workflow.success} className="h-2" />
                      <p className="text-xs text-muted-foreground">{workflow.success}% Erfolgsrate</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>
      )}

      {/* Stat Dialog */}
      <Dialog open={statDialogOpen} onOpenChange={setStatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStat?.id ? "Statistik bearbeiten" : "Neue Statistik"}</DialogTitle>
          </DialogHeader>
          {editingStat && (
            <div className="space-y-4">
              <div>
                <Label>Titel</Label>
                <Input value={editingStat.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingStat({ ...editingStat, title: e.target.value })} />
              </div>
              <div>
                <Label>Wert</Label>
                <Input value={editingStat.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingStat({ ...editingStat, value: e.target.value })} />
              </div>
              <div>
                <Label>Änderung</Label>
                <Input value={editingStat.change} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingStat({ ...editingStat, change: e.target.value })} />
              </div>
              <div>
                <Label>Trend</Label>
                <select
                  value={editingStat.trend}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingStat({ ...editingStat, trend: e.target.value as "up" | "down" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="up">Aufwärts</option>
                  <option value="down">Abwärts</option>
                </select>
              </div>
              <div>
                <Label>Icon</Label>
                <select
                  value={editingStat.icon}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingStat({ ...editingStat, icon: e.target.value as StatCard["icon"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="zap">Zap</option>
                  <option value="activity">Activity</option>
                  <option value="users">Users</option>
                  <option value="clock">Clock</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveStat}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chart Dialog */}
      <Dialog open={chartDialogOpen} onOpenChange={setChartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chart-Daten hinzufügen</DialogTitle>
            <DialogDescription>Wählen Sie eine vordefinierte Option oder erstellen Sie eine neue</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Vordefinierte Optionen</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {predefinedChartOptions
                  .filter(option => !chartData.find(d => d.name === option.name))
                  .map((option) => (
                    <Button
                      key={option.name}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        handleAddChartData(option);
                        setChartDialogOpen(false);
                      }}
                    >
                      {option.name}
                    </Button>
                  ))}
                {predefinedChartOptions.filter(option => !chartData.find(d => d.name === option.name)).length === 0 && (
                  <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                    Alle vordefinierten Optionen sind bereits hinzugefügt
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newData: ChartDataPoint = {
                    name: "",
                    workflows: 0,
                    executions: 0,
                  };
                  setEditingChart(newData);
                  setChartDialogOpen(false);
                  // Öffne den alten Dialog für manuelle Eingabe
                  setTimeout(() => {
                    setChartDialogOpen(true);
                  }, 100);
                }}
              >
                Manuell erstellen
              </Button>
            </div>
            {editingChart && editingChart.name === "" && (
              <div className="space-y-4">
                <div>
                  <Label>Name (z.B. Tag, Woche)</Label>
                  <Input value={editingChart.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingChart({ ...editingChart, name: e.target.value })} />
                </div>
                <div>
                  <Label>Workflows</Label>
                  <Input type="number" value={editingChart.workflows} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingChart({ ...editingChart, workflows: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Ausführungen</Label>
                  <Input type="number" value={editingChart.executions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingChart({ ...editingChart, executions: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            )}
          </div>
          {editingChart && editingChart.name === "" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => { setChartDialogOpen(false); setEditingChart(null); }}>Abbrechen</Button>
              <Button onClick={handleSaveChartData}>Speichern</Button>
            </DialogFooter>
          )}
          {(!editingChart || editingChart.name !== "") && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setChartDialogOpen(false)}>Schließen</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingActivity?.id ? "Aktivität bearbeiten" : "Neue Aktivität"}</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <div className="space-y-4">
              <div>
                <Label>Workflow-Name</Label>
                <Input value={editingActivity.workflow} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingActivity({ ...editingActivity, workflow: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={editingActivity.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingActivity({ ...editingActivity, status: e.target.value as Activity["status"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="success">Erfolg</option>
                  <option value="running">Läuft</option>
                  <option value="error">Fehler</option>
                </select>
              </div>
              <div>
                <Label>Zeit</Label>
                <Input value={editingActivity.time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingActivity({ ...editingActivity, time: e.target.value })} placeholder="z.B. vor 5 Min" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveActivity}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Dialog */}
      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWorkflow?.id ? "Workflow bearbeiten" : "Neuer Workflow"}</DialogTitle>
          </DialogHeader>
          {editingWorkflow && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editingWorkflow.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })} />
              </div>
              <div>
                <Label>Ausführungen</Label>
                <Input type="number" value={editingWorkflow.executions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWorkflow({ ...editingWorkflow, executions: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Erfolgsrate (%)</Label>
                <Input type="number" min="0" max="100" value={editingWorkflow.success} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWorkflow({ ...editingWorkflow, success: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkflowDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveWorkflow}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialogOpen} onOpenChange={setAddWidgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Widget hinzufügen</DialogTitle>
            <DialogDescription>Wählen Sie den Typ des Widgets, das Sie hinzufügen möchten.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {
                setAddWidgetDialogOpen(false);
                handleAddStat();
              }}
            >
              <Zap className="h-6 w-6" />
              <span>Statistik</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {
                setAddWidgetDialogOpen(false);
                handleAddChartData();
              }}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Chart</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {
                setAddWidgetDialogOpen(false);
                handleAddActivity();
              }}
            >
              <Activity className="h-6 w-6" />
              <span>Aktivität</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {
                setAddWidgetDialogOpen(false);
                handleAddWorkflow();
              }}
            >
              <Users className="h-6 w-6" />
              <span>Workflow</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWidgetDialogOpen(false)}>Abbrechen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dashboard Template auswählen</DialogTitle>
            <DialogDescription>
              Wählen Sie ein vordefiniertes Template, um Ihr Dashboard schnell zu konfigurieren.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {dashboardTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleApplyTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Abbrechen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Widget Dialog */}
      <Dialog open={!!fullscreenWidget} onOpenChange={(open: boolean) => !open && setFullscreenWidget(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {fullscreenWidget?.type === "stat" ? fullscreenWidget.data.title : "Widget-Vollbild"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {fullscreenWidget?.type === "stat" && (
              <Card className="p-8">
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn(
                      "p-3 rounded-lg",
                      fullscreenWidget.data.icon === "zap" && "bg-primary/10",
                      fullscreenWidget.data.icon === "activity" && "bg-primary/10",
                      fullscreenWidget.data.icon === "users" && "bg-blue-500/10",
                      fullscreenWidget.data.icon === "clock" && "bg-purple-500/10"
                    )}>
                      {React.createElement(iconMap[fullscreenWidget.data.icon as keyof typeof iconMap], { className: "h-8 w-8 text-primary" })}
                    </div>
                    {fullscreenWidget.data.trend === "up" ? (
                      <div className="flex items-center gap-2 text-green-600 text-lg">
                        <ArrowUpRight className="h-5 w-5" />
                        {fullscreenWidget.data.change}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 text-lg">
                        <ArrowDownRight className="h-5 w-5" />
                        {fullscreenWidget.data.change}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold">{fullscreenWidget.data.value}</p>
                    <p className="text-lg text-muted-foreground">{fullscreenWidget.data.title}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Toolbar */}
      {!isEditMode && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-white dark:bg-background border border-border rounded-lg shadow-lg p-2 flex flex-col gap-2 backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-accent border-border text-foreground"
                  onClick={() => setTemplateDialogOpen(true)}
                  title="Template auswählen"
                >
                  <LayoutTemplate className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Template</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-accent border-border text-foreground"
                  onClick={toggleComparisonMode}
                  title="Vergleichsmodus"
                >
                  <GitCompare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vergleich</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-accent border-border text-foreground"
                  onClick={() => {
                    const pinnedArray = Array.from(pinnedItems);
                    if (pinnedArray.length === 0) {
                      toast({ title: "Keine Favoriten", description: "Es sind keine Favoriten vorhanden." });
                    } else {
                      toast({ title: "Favoriten", description: `${pinnedArray.length} Favoriten vorhanden.` });
                    }
                  }}
                  title="Favoriten anzeigen"
                >
                  <Star className={cn("h-4 w-4", pinnedItems.size > 0 && "fill-yellow-500 text-yellow-500")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Favoriten ({pinnedItems.size})</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
