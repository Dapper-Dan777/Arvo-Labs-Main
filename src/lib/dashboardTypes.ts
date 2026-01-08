/**
 * Dashboard Type Definitions
 */

export interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "zap" | "activity" | "users" | "clock";
}

export interface ChartDataPoint {
  name: string;
  workflows: number;
  executions: number;
}

export interface Activity {
  id: string;
  workflow: string;
  status: "success" | "running" | "error";
  time: string;
}

export interface TopWorkflow {
  id: string;
  name: string;
  executions: number;
  success: number;
}

export interface DashboardData {
  stats: StatCard[];
  chartData: ChartDataPoint[];
  activities: Activity[];
  topWorkflows: TopWorkflow[];
  widgetOrder?: string[];
  visibleWidgets?: {
    chartWorkflowActivity?: boolean;
    chartExecutions?: boolean;
    activities?: boolean;
    workflows?: boolean;
    calendar?: boolean;
  };
}

export type ExportDashboardData = DashboardData;

