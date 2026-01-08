"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringData } from "@/hooks/use-monitoring-data";

export function ErrorAnalysisCard() {
  const { data, isLoading } = useMonitoringData();
  
  const errorAnalysis = useMemo(() => {
    const errors = data.filter(log => log.status === 'error');
    const byStep: Record<string, number> = {};
    const byMessage: Record<string, number> = {};
    
    errors.forEach(log => {
      if (log.error_step) {
        byStep[log.error_step] = (byStep[log.error_step] || 0) + 1;
      }
      if (log.error_message) {
        const key = log.error_message.substring(0, 50);
        byMessage[key] = (byMessage[key] || 0) + 1;
      }
    });
    
    return {
      totalErrors: errors.length,
      byStep: Object.entries(byStep)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      byMessage: Object.entries(byMessage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fehler-Analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fehler-Analyse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Fehler nach Step</p>
            <div className="space-y-2">
              {errorAnalysis.byStep.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine Fehler</p>
              ) : (
                errorAnalysis.byStep.map(([step, count]) => (
                  <div key={step} className="flex items-center justify-between">
                    <span className="text-sm">{step}</span>
                    <Badge variant="destructive">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Häufigste Fehler</p>
            <div className="space-y-2">
              {errorAnalysis.byMessage.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine Fehler</p>
              ) : (
                errorAnalysis.byMessage.map(([message, count]) => (
                  <div key={message} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {message}...
                    </span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

