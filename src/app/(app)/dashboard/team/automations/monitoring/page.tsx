"use client";

import { MonitoringKPICards } from "@/components/automations/MonitoringKPICards";
import { MonitoringStatusTable } from "@/components/automations/MonitoringStatusTable";
import { ErrorAnalysisCard } from "@/components/automations/ErrorAnalysisCard";
import { TrendChartCard } from "@/components/automations/TrendChartCard";
import { PlanDistributionCard } from "@/components/automations/PlanDistributionCard";

export default function AutomationMonitoringPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customer Onboarding Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Überwachung und Analyse der automatisierten Kunden-Onboarding-Pipeline
        </p>
      </div>

      {/* KPI Cards */}
      <MonitoringKPICards />

      {/* Status Table */}
      <MonitoringStatusTable />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorAnalysisCard />
        <TrendChartCard />
      </div>

      {/* Plan Distribution */}
      <PlanDistributionCard />
    </div>
  );
}

