import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, ArrowUp, ArrowDown, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/documents/ExportButton';
import { toast } from '@/hooks/use-toast';

// ============================================================
// DASHBOARDS PAGE
// KPI-Übersichten und Analytics mit Export & Refresh
// ============================================================

interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  period: string;
}

// ANPASSEN: Dummy-Daten, später durch Supabase-Query ersetzen
const KPI_CARDS: KPICard[] = [
  {
    id: '1',
    title: 'Automatisierte Tasks',
    value: '156',
    change: 23,
    isPositive: true,
    period: 'Diese Woche',
  },
  {
    id: '2',
    title: 'Durchschnittliche Zeit',
    value: '2.4h',
    change: 12,
    isPositive: true,
    period: 'Pro Task',
  },
  {
    id: '3',
    title: 'Fehlerquote',
    value: '0.8%',
    change: 5,
    isPositive: false,
    period: 'Diese Woche',
  },
  {
    id: '4',
    title: 'Team-Produktivität',
    value: '94%',
    change: 8,
    isPositive: true,
    period: 'Durchschnitt',
  },
];

const CHART_PLACEHOLDER_DATA = [40, 65, 45, 80, 55, 90, 70];

const DashboardsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: 'Aktualisiert',
      description: 'Dashboard-Daten wurden aktualisiert.',
    });
  };

  // Prepare export data
  const exportData = KPI_CARDS.map(kpi => ({
    Titel: kpi.title,
    Wert: kpi.value,
    Änderung: `${kpi.change}%`,
    Trend: kpi.isPositive ? 'Positiv' : 'Negativ',
    Zeitraum: kpi.period,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboards</h1>
          <p className="text-muted-foreground mt-1">
            Deine wichtigsten Kennzahlen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Aktualisieren"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
          <ExportButton
            data={exportData}
            filename="dashboard-kpis"
            variant="outline"
            size="default"
          />
          <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <p className="text-xs text-muted-foreground">{kpi.title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.isPositive ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={cn(
                'text-xs font-medium',
                kpi.isPositive ? 'text-green-500' : 'text-red-500'
              )}>
                {kpi.change}%
              </span>
              <span className="text-xs text-muted-foreground">{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chart Placeholder */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Workflow-Aktivität</h3>
            <p className="text-sm text-muted-foreground">Letzte 7 Tage</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        
        {/* Simple Bar Chart Placeholder */}
        <div className="flex items-end justify-between h-32 gap-2">
          {CHART_PLACEHOLDER_DATA.map((value, index) => (
            <div 
              key={index}
              className="flex-1 bg-primary/20 rounded-t-md transition-all hover:bg-primary/30"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
            <span key={day} className="text-xs text-muted-foreground flex-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </div>
      
      {/* Charts Placeholder */}
      <div className="grid gap-4">
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <p className="text-muted-foreground text-sm">
            📊 Weitere Charts und Grafiken kommen bald...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardsPage;
