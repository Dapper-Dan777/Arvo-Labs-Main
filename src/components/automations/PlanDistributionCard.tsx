"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMonitoringData } from "@/hooks/use-monitoring-data";

export function PlanDistributionCard() {
  const { data, isLoading } = useMonitoringData();
  
  const planData = useMemo(() => {
    const plans = ['starter', 'pro', 'enterprise'];
    return plans.map(plan => ({
      name: plan.charAt(0).toUpperCase() + plan.slice(1),
      value: data.filter(log => log.plan === plan).length,
    })).filter(item => item.value > 0);
  }, [data]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan-Verteilung</CardTitle>
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
        <CardTitle>Plan-Verteilung</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={planData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {planData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

