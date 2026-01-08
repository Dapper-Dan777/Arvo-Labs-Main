// Dashboard Templates (aus Vite-Dashboard übernommen)
import type { StatCard, ChartDataPoint, Activity, TopWorkflow } from "./dashboardTypes";

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  stats: StatCard[];
  chartData: ChartDataPoint[];
  activities: Activity[];
  topWorkflows: TopWorkflow[];
  visibleWidgets: {
    chartWorkflowActivity: boolean;
    chartExecutions: boolean;
    activities: boolean;
    workflows: boolean;
    calendar: boolean;
  };
}

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Ein einfaches Dashboard mit den wichtigsten Metriken",
    icon: "📊",
    stats: [
      { id: "1", title: "Aktive Workflows", value: "0", change: "0%", trend: "up", icon: "zap" },
      { id: "2", title: "Ausführungen heute", value: "0", change: "0%", trend: "up", icon: "activity" },
    ],
    chartData: [],
    activities: [],
    topWorkflows: [],
    visibleWidgets: {
      chartWorkflowActivity: false,
      chartExecutions: false,
      activities: false,
      workflows: false,
      calendar: false,
    },
  },
  {
    id: "analytics",
    name: "Analytics Fokus",
    description: "Dashboard mit Schwerpunkt auf Charts und Analysen",
    icon: "📈",
    stats: [
      { id: "1", title: "Aktive Workflows", value: "0", change: "0%", trend: "up", icon: "zap" },
      { id: "2", title: "Ausführungen heute", value: "0", change: "0%", trend: "up", icon: "activity" },
      { id: "3", title: "Team-Mitglieder", value: "0", change: "0", trend: "up", icon: "users" },
      { id: "4", title: "Durchschnittliche Laufzeit", value: "0s", change: "0%", trend: "down", icon: "clock" },
    ],
    chartData: [
      { name: "Mo", workflows: 120, executions: 800 },
      { name: "Di", workflows: 190, executions: 1200 },
      { name: "Mi", workflows: 300, executions: 1500 },
      { name: "Do", workflows: 280, executions: 1400 },
      { name: "Fr", workflows: 350, executions: 1800 },
      { name: "Sa", workflows: 240, executions: 1100 },
      { name: "So", workflows: 180, executions: 900 },
    ],
    activities: [],
    topWorkflows: [],
    visibleWidgets: {
      chartWorkflowActivity: true,
      chartExecutions: true,
      activities: false,
      workflows: false,
      calendar: false,
    },
  },
  {
    id: "activity",
    name: "Aktivitäten Fokus",
    description: "Dashboard mit Fokus auf aktuelle Aktivitäten und Workflows",
    icon: "⚡",
    stats: [
      { id: "1", title: "Aktive Workflows", value: "0", change: "0%", trend: "up", icon: "zap" },
      { id: "2", title: "Ausführungen heute", value: "0", change: "0%", trend: "up", icon: "activity" },
    ],
    chartData: [],
    activities: [
      { id: "1", workflow: "Beispiel Workflow", status: "success", time: "vor 5 Min" },
    ],
    topWorkflows: [
      { id: "1", name: "Beispiel Workflow", executions: 100, success: 95 },
    ],
    visibleWidgets: {
      chartWorkflowActivity: false,
      chartExecutions: false,
      activities: true,
      workflows: true,
      calendar: false,
    },
  },
  {
    id: "complete",
    name: "Vollständig",
    description: "Dashboard mit allen Widgets und Funktionen",
    icon: "🎯",
    stats: [
      { id: "1", title: "Aktive Workflows", value: "0", change: "0%", trend: "up", icon: "zap" },
      { id: "2", title: "Ausführungen heute", value: "0", change: "0%", trend: "up", icon: "activity" },
      { id: "3", title: "Team-Mitglieder", value: "0", change: "0", trend: "up", icon: "users" },
      { id: "4", title: "Durchschnittliche Laufzeit", value: "0s", change: "0%", trend: "down", icon: "clock" },
    ],
    chartData: [
      { name: "Mo", workflows: 120, executions: 800 },
      { name: "Di", workflows: 190, executions: 1200 },
      { name: "Mi", workflows: 300, executions: 1500 },
      { name: "Do", workflows: 280, executions: 1400 },
      { name: "Fr", workflows: 350, executions: 1800 },
      { name: "Sa", workflows: 240, executions: 1100 },
      { name: "So", workflows: 180, executions: 900 },
    ],
    activities: [
      { id: "1", workflow: "Beispiel Workflow", status: "success", time: "vor 5 Min" },
    ],
    topWorkflows: [
      { id: "1", name: "Beispiel Workflow", executions: 100, success: 95 },
    ],
    visibleWidgets: {
      chartWorkflowActivity: true,
      chartExecutions: true,
      activities: true,
      workflows: true,
      calendar: false,
    },
  },
];

