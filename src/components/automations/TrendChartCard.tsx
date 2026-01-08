"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMonitoringData } from "@/hooks/use-monitoring-data";
import { format, subDays, isSameDay } from "date-fns";

function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(subDays(new Date(), i));
  }
  return days;
}

export function TrendChartCard() {
  const { data, isLoading } = useMonitoringData();
  
  const chartData = useMemo(() => {
    const last30Days = getLast30Days();
    const dailyStats = last30Days.map(date => {
      const dayLogs = data.filter(log => isSameDay(new Date(log.timestamp), date));
      return {
        date: format(date, 'dd.MM'),
        Erfolgreich: dayLogs.filter(l => l.status === 'success').length,
        Fehler: dayLogs.filter(l => l.status === 'error').length,
        Gesamt: dayLogs.length,
      };
    });
    return dailyStats;
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend (letzte 30 Tage)</CardTitle>
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
        <CardTitle>Trend (letzte 30 Tage)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Erfolgreich" 
              stroke="#22c55e" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="Fehler" 
              stroke="#ef4444" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="Gesamt" 
              stroke="#6b7280" 
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

