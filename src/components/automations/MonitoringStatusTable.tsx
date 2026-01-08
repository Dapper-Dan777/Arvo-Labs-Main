"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { useMonitoringData } from "@/hooks/use-monitoring-data";
import { format, isToday, isThisWeek, isThisMonth, startOfWeek, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

export function MonitoringStatusTable() {
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    timeRange: 'week',
  });
  
  const { data, isLoading } = useMonitoringData();
  
  const filteredData = useMemo(() => {
    return data.filter(log => {
      if (filters.status !== 'all' && log.status !== filters.status) return false;
      if (filters.plan !== 'all' && log.plan !== filters.plan) return false;
      
      const logDate = new Date(log.timestamp);
      if (filters.timeRange === 'today' && !isToday(logDate)) return false;
      if (filters.timeRange === 'week' && !isThisWeek(logDate)) return false;
      if (filters.timeRange === 'month' && !isThisMonth(logDate)) return false;
      
      return true;
    });
  }, [data, filters]);

  const getStatusBadge = (status: string) => {
    const config = {
      success: { label: 'Erfolg', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      error: { label: 'Fehler', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
      partial: { label: 'Teilweise', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    };
    const cfg = config[status as keyof typeof config] || config.error;
    return <Badge variant="outline" className={cn("text-xs", cfg.className)}>{cfg.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status-Übersicht</CardTitle>
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle>Status-Übersicht</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="success">Erfolg</SelectItem>
                <SelectItem value="error">Fehler</SelectItem>
                <SelectItem value="partial">Teilweise</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.plan} onValueChange={(v) => setFilters({...filters, plan: v})}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Pläne</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.timeRange} onValueChange={(v) => setFilters({...filters, timeRange: v})}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Heute</SelectItem>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Dieser Monat</SelectItem>
                <SelectItem value="all">Alle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User-ID</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HubSpot</TableHead>
                <TableHead>Stripe</TableHead>
                <TableHead>Fehler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Keine Einträge gefunden
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((log) => (
                  <TableRow key={`${log.timestamp}-${log.user_id}`}>
                    <TableCell className="text-sm">
                      {format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.user_id}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.plan}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {log.hubspot_contact_id ? (
                        <a 
                          href={`https://app.hubspot.com/contacts/[PORTAL-ID]/contact/${log.hubspot_contact_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.stripe_subscription_id ? (
                        <a 
                          href={`https://dashboard.stripe.com/subscriptions/${log.stripe_subscription_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.error_message ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{log.error_step}: {log.error_message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

