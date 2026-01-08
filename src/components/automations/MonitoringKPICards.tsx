"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { useMonitoringData } from "@/hooks/use-monitoring-data";
import { isToday, isThisWeek } from "date-fns";

export function MonitoringKPICards() {
  const { data, isLoading } = useMonitoringData();
  
  const kpis = useMemo(() => {
    const today = data.filter(log => isToday(new Date(log.timestamp))).length;
    const thisWeek = data.filter(log => isThisWeek(new Date(log.timestamp))).length;
    const success = data.filter(log => log.status === 'success').length;
    const errors = data.filter(log => log.status === 'error').length;
    const total = data.length;
    
    return {
      today,
      thisWeek,
      successRate: total > 0 ? parseFloat((success / total * 100).toFixed(1)) : 0,
      errorRate: total > 0 ? parseFloat((errors / total * 100).toFixed(1)) : 0,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Heute</p>
              <p className="text-3xl font-bold">{kpis.today}</p>
            </div>
            <Users className="h-8 w-8 text-primary/20" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Diese Woche</p>
              <p className="text-3xl font-bold">{kpis.thisWeek}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/20" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Erfolgsrate</p>
              <p className="text-3xl font-bold text-green-600">{kpis.successRate}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500/20" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fehlerrate</p>
              <p className="text-3xl font-bold text-red-600">{kpis.errorRate}%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500/20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

