"use client";

import { Clock, Play, Pause, MoreHorizontal, Filter, Plus, Edit, Trash2, Calendar as CalendarIcon, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionGradient } from "@/lib/sectionGradients";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, getISOWeek, startOfWeek, eachDayOfInterval, eachWeekOfInterval } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";

interface Trigger {
  id: number;
  name: string;
  type: "Schedule" | "Webhook" | "Event";
  time: string;
  status: "active" | "paused";
  nextRun: string;
  workflow: string;
}

const triggersData: Trigger[] = [
  { id: 1, name: "Daily Marketing Report", type: "Schedule", time: "09:00 AM", status: "active", nextRun: "1h 23m", workflow: "Marketing Automation" },
  { id: 2, name: "Invoice Generation", type: "Schedule", time: "06:00 PM", status: "active", nextRun: "4h 12m", workflow: "Invoicing Flow" },
  { id: 3, name: "New Lead Notification", type: "Webhook", time: "On Event", status: "active", nextRun: "Listening", workflow: "Lead Processing" },
  { id: 4, name: "Weekly Analytics Sync", type: "Schedule", time: "Monday 08:00", status: "paused", nextRun: "Paused", workflow: "Analytics Pipeline" },
  { id: 5, name: "Customer Onboarding", type: "Webhook", time: "On Signup", status: "active", nextRun: "Listening", workflow: "Onboarding Flow" },
  { id: 6, name: "Error Alert Handler", type: "Event", time: "On Error", status: "active", nextRun: "Listening", workflow: "Error Management" },
];

export default function TeamTriggersPage() {
  const sectionGradient = useSectionGradient();
  const [triggers, setTriggers] = useState<Trigger[]>(triggersData);
  const [newTriggerOpen, setNewTriggerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [usageChartData, setUsageChartData] = useState<Array<{ date: string; minutes: number; timestamp: number }>>([]);
  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year" | "all">("week");
  const { toast } = useToast();

  const [triggerForm, setTriggerForm] = useState({
    name: "",
    type: "schedule" as "schedule" | "webhook" | "event",
    date: undefined as Date | undefined,
    time: "",
    workflow: "",
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const displayTime = format(new Date(2000, 0, 1, hours, minutes), "HH:mm", { locale: de });
    return { value: timeString, label: displayTime };
  });

  useEffect(() => {
    const savedData = localStorage.getItem("triggers-usage-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const normalizedData = parsed.map((item: any) => {
          if (!item.timestamp && item.date) {
            const parsedDate = new Date(item.date);
            return {
              ...item,
              timestamp: isNaN(parsedDate.getTime()) ? new Date().getTime() : parsedDate.getTime(),
            };
          }
          return item;
        });
        if (normalizedData.length < 7) {
          const today = new Date();
          const exampleData = Array.from({ length: 365 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (364 - i));
            return {
              date: date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit" }),
              minutes: Math.floor(Math.random() * 120) + 30,
              timestamp: date.getTime(),
            };
          });
          setUsageChartData(exampleData);
          localStorage.setItem("triggers-usage-data", JSON.stringify(exampleData));
        } else {
          setUsageChartData(normalizedData);
        }
      } catch (e) {
        console.error("Fehler beim Laden der Nutzungsdaten", e);
      }
    } else {
      const today = new Date();
      const exampleData = Array.from({ length: 365 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (364 - i));
        return {
          date: date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit" }),
          minutes: Math.floor(Math.random() * 120) + 30,
          timestamp: date.getTime(),
        };
      });
      setUsageChartData(exampleData);
      localStorage.setItem("triggers-usage-data", JSON.stringify(exampleData));
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const today = new Date();
      const todayStr = today.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit" });
      const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      
      setUsageChartData(prev => {
        const updated = [...prev];
        const todayIndex = updated.findIndex(d => {
          const dDate = new Date(d.timestamp);
          return dDate.getFullYear() === today.getFullYear() &&
                 dDate.getMonth() === today.getMonth() &&
                 dDate.getDate() === today.getDate();
        });
        if (todayIndex >= 0) {
          updated[todayIndex] = { ...updated[todayIndex], minutes: updated[todayIndex].minutes + 1 };
        } else {
          updated.push({ date: todayStr, minutes: 1, timestamp: todayTimestamp });
          if (updated.length > 365) {
            updated.shift();
          }
        }
        localStorage.setItem("triggers-usage-data", JSON.stringify(updated));
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredTriggers = triggers.filter(trigger => {
    const matchesSearch = searchQuery === "" || 
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.workflow.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || trigger.status === filterStatus;
    const matchesType = filterType === "all" || trigger.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleTriggerStatus = (id: number) => {
    setTriggers(prevTriggers => {
      const updated = prevTriggers.map(trigger => {
        if (trigger.id === id) {
          const newStatus = trigger.status === "active" ? "paused" : "active";
          let nextRun = trigger.nextRun;
          if (newStatus === "paused") {
            nextRun = "Paused";
          } else {
            if (trigger.type === "Schedule") {
              nextRun = "1h 23m";
            } else {
              nextRun = "Listening";
            }
          }
          return { ...trigger, status: newStatus, nextRun };
        }
        return trigger;
      });
      return updated;
    });
    const trigger = triggers.find(t => t.id === id);
    toast({
      title: `Trigger ${trigger?.status === "active" ? "pausiert" : "aktiviert"}`,
      description: `${trigger?.name} wurde erfolgreich ${trigger?.status === "active" ? "pausiert" : "aktiviert"}.`,
    });
  };

  const handleCreateTrigger = () => {
    if (!triggerForm.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Trigger-Namen ein.",
        variant: "destructive",
      });
      return;
    }

    if (triggerForm.type === "schedule" && (!triggerForm.date || !triggerForm.time)) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie ein Datum und eine Uhrzeit für Schedule-Trigger.",
        variant: "destructive",
      });
      return;
    }

    let timeString = "";
    if (triggerForm.type === "schedule") {
      if (triggerForm.date && triggerForm.time) {
        const dateStr = format(triggerForm.date, "EEEE dd.MM.yyyy", { locale: de });
        timeString = `${dateStr} ${triggerForm.time}`;
      }
    } else if (triggerForm.type === "webhook") {
      timeString = triggerForm.time || "On Event";
    } else {
      timeString = triggerForm.time || "On Error";
    }

    const newTrigger: Trigger = {
      id: Math.max(...triggers.map(t => t.id), 0) + 1,
      name: triggerForm.name,
      type: triggerForm.type.charAt(0).toUpperCase() + triggerForm.type.slice(1) as Trigger["type"],
      time: timeString,
      status: "active",
      nextRun: triggerForm.type === "schedule" ? "1h 23m" : "Listening",
      workflow: triggerForm.workflow || "Unbekannter Workflow",
    };

    setTriggers([...triggers, newTrigger]);
    setTriggerForm({ name: "", type: "schedule", date: undefined, time: "", workflow: "" });
    setDatePickerOpen(false);
    setTimePickerOpen(false);
    setNewTriggerOpen(false);
    toast({
      title: "Trigger erstellt",
      description: `${newTrigger.name} wurde erfolgreich erstellt.`,
    });
  };

  const handleDeleteTrigger = (id: number) => {
    const trigger = triggers.find(t => t.id === id);
    if (trigger) {
      setTriggers(triggers.filter(t => t.id !== id));
      toast({
        title: "Trigger gelöscht",
        description: `${trigger.name} wurde erfolgreich gelöscht.`,
      });
    }
  };

  const handleEditTrigger = (id: number) => {
    const trigger = triggers.find(t => t.id === id);
    if (trigger) {
      let parsedDate: Date | undefined = undefined;
      let parsedTime = trigger.time;
      
      if (trigger.type === "Schedule" && trigger.time) {
        const dateMatch = trigger.time.match(/(\w+)\s+(\d{1,2}):(\d{2})/);
        if (dateMatch) {
          const today = new Date();
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const dayIndex = dayNames.findIndex(d => d.toLowerCase().startsWith(dateMatch[1].toLowerCase()));
          if (dayIndex >= 0) {
            const daysUntil = (dayIndex - today.getDay() + 7) % 7 || 7;
            parsedDate = new Date(today);
            parsedDate.setDate(today.getDate() + daysUntil);
            parsedTime = `${dateMatch[2]}:${dateMatch[3]}`;
          }
        } else {
          parsedTime = trigger.time;
        }
      }
      
      setTriggerForm({
        name: trigger.name,
        type: trigger.type.toLowerCase() as "schedule" | "webhook" | "event",
        date: parsedDate,
        time: parsedTime,
        workflow: trigger.workflow,
      });
      setTriggers(triggers.filter(t => t.id !== id));
      setNewTriggerOpen(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleApplyFilter = () => {
    setFilterOpen(false);
    toast({
      title: "Filter angewendet",
      description: "Die Filter wurden erfolgreich angewendet.",
    });
  };

  const getFilteredChartData = () => {
    const validData = usageChartData.filter(d => d && d.timestamp);
    
    if (!validData.length) {
      return [];
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let filtered: Array<{ date: string; minutes: number; timestamp: number }> = [];
    let startDate: Date;

    switch (chartPeriod) {
      case "day":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        filtered = Array.from({ length: 24 }, (_, i) => {
          const hourDate = new Date(startDate);
          hourDate.setHours(i);
          const hourData = validData.filter(d => {
            const dDate = new Date(d.timestamp);
            return dDate.getHours() === i && dDate >= startDate && dDate < new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
          });
          const totalMinutes = hourData.reduce((sum, d) => sum + (d.minutes || 0), 0);
          return {
            date: `${String(i).padStart(2, '0')}:00`,
            minutes: totalMinutes,
            timestamp: hourDate.getTime(),
          };
        });
        break;

      case "week":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        
        const weekDays = eachDayOfInterval({
          start: startDate,
          end: today,
        });
        
        filtered = weekDays.map(day => {
          const dayData = validData.filter(d => {
            const dDate = new Date(d.timestamp);
            dDate.setHours(0, 0, 0, 0);
            return dDate.getTime() === day.getTime();
          });
          
          const totalMinutes = dayData.reduce((sum, d) => sum + (d.minutes || 0), 0);
          
          return {
            date: format(day, "EEE dd", { locale: de }),
            minutes: totalMinutes,
            timestamp: day.getTime(),
          };
        });
        break;

      case "month":
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const twoWeeksAgoStart = new Date(currentWeekStart);
        twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14);
        
        const nextWeekStart = new Date(currentWeekStart);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        
        const weeks = eachWeekOfInterval(
          {
            start: twoWeeksAgoStart,
            end: nextWeekStart,
          },
          { weekStartsOn: 1 }
        );
        
        filtered = weeks.map(weekStart => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          
          const weekData = validData.filter(d => {
            const dDate = new Date(d.timestamp);
            return dDate >= weekStart && dDate <= weekEnd;
          });
          
          const totalMinutes = weekData.reduce((sum, d) => sum + (d.minutes || 0), 0);
          const weekNumber = getISOWeek(weekStart);
          
          return {
            date: `KW${weekNumber}`,
            minutes: totalMinutes,
            timestamp: weekStart.getTime(),
          };
        });
        break;

      case "year":
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 11);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        
        const monthData: Record<string, { minutes: number; timestamp: number }> = {};
        validData
          .filter(d => {
            const dDate = new Date(d.timestamp);
            return dDate >= startDate;
          })
          .forEach(d => {
            const dDate = new Date(d.timestamp);
            const monthKey = format(dDate, "MMM yyyy", { locale: de });
            if (!monthData[monthKey]) {
              const monthStart = new Date(dDate.getFullYear(), dDate.getMonth(), 1);
              monthData[monthKey] = { minutes: 0, timestamp: monthStart.getTime() };
            }
            monthData[monthKey].minutes += d.minutes;
          });
        
        filtered = Object.entries(monthData)
          .map(([date, data]) => ({
            date,
            minutes: data.minutes,
            timestamp: data.timestamp,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        break;

      case "all":
        const allMonthData: Record<string, { minutes: number; timestamp: number }> = {};
        validData.forEach(d => {
            const dDate = new Date(d.timestamp);
            const monthKey = format(dDate, "MMM yyyy", { locale: de });
            if (!allMonthData[monthKey]) {
              const monthStart = new Date(dDate.getFullYear(), dDate.getMonth(), 1);
              allMonthData[monthKey] = { minutes: 0, timestamp: monthStart.getTime() };
            }
            allMonthData[monthKey].minutes += d.minutes;
          });
        
        filtered = Object.entries(allMonthData)
          .map(([date, data]) => ({
            date,
            minutes: data.minutes,
            timestamp: data.timestamp,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        break;
    }

    return filtered;
  };

  const filteredChartData = getFilteredChartData();

  const totalMinutes = filteredChartData.reduce((sum, d) => sum + d.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const getChartTitle = () => {
    switch (chartPeriod) {
      case "day": return "Nutzungszeit - Heute (Stunden)";
      case "week": return "Nutzungszeit - Letzte 7 Tage";
      case "month": return "Nutzungszeit - Letzte 30 Tage";
      case "year": return "Nutzungszeit - Letzte 12 Monate";
      case "all": return "Nutzungszeit - Gesamt";
      default: return "Nutzungszeit";
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Timer}
        title="Triggers"
        description="Manage your workflow triggers and schedules"
      />
      
      <div className="flex items-center justify-end">
        <Button 
          size="sm" 
          className="text-white font-medium"
          style={{ background: sectionGradient }}
          onClick={() => {
            setTriggerForm({ name: "", type: "schedule", date: undefined, time: "", workflow: "" });
            setNewTriggerOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Trigger
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{getChartTitle()}</CardTitle>
            <Tabs value={chartPeriod} onValueChange={(value) => setChartPeriod(value as typeof chartPeriod)}>
              <TabsList className="h-auto">
                <TabsTrigger value="day" className="text-xs px-2 py-1">Tag</TabsTrigger>
                <TabsTrigger value="week" className="text-xs px-2 py-1">Woche</TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-2 py-1">Monat</TabsTrigger>
                <TabsTrigger value="year" className="text-xs px-2 py-1">Jahr</TabsTrigger>
                <TabsTrigger value="all" className="text-xs px-2 py-1">Gesamt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="shrink-0">
                <p className="text-2xl font-bold">{hours}h {minutes}m</p>
                <p className="text-sm text-muted-foreground">
                  {chartPeriod === "day" ? "Heute" : 
                   chartPeriod === "week" ? "Letzte 7 Tage" :
                   chartPeriod === "month" ? "Letzte 30 Tage" :
                   chartPeriod === "year" ? "Letzte 12 Monate" :
                   "Gesamt"}
                </p>
              </div>
              <div className="flex-1 w-full h-[250px] min-w-0">
                {filteredChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4facfe" stopOpacity={0.5}/>
                          <stop offset="50%" stopColor="#00f2fe" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: "#9ca3b4", fontSize: chartPeriod === "day" ? 10 : 12 }}
                        axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                        angle={chartPeriod === "day" ? -45 : 0}
                        textAnchor={chartPeriod === "day" ? "end" : "middle"}
                        height={chartPeriod === "day" ? 60 : 30}
                      />
                      <YAxis 
                        tick={{ fill: "#9ca3b4", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                        label={{ value: "Minuten", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#9ca3b4", fontSize: 12 } }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "#161821", 
                          border: "1px solid rgba(96, 165, 250, 0.3)",
                          borderRadius: "8px",
                          color: "#f8fafc"
                        }}
                        formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, "Nutzungszeit"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="#4facfe" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorUsage)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Lade Chart-Daten...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 sm:max-w-xs">
          <Input 
            placeholder="Search triggers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilterOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {(filterStatus !== "all" || filterType !== "all") && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTriggers.length === 0 ? (
          <EmptyState
            title={
              searchQuery || filterStatus !== "all" || filterType !== "all"
                ? "Keine Trigger gefunden"
                : "Noch keine Trigger vorhanden"
            }
            description={
              searchQuery || filterStatus !== "all" || filterType !== "all"
                ? `Keine Trigger gefunden, die den Suchkriterien entsprechen.`
                : "Erstellen Sie Ihren ersten Trigger, um Automations zu starten."
            }
            icon={Clock}
            action={
              !searchQuery && filterStatus === "all" && filterType === "all"
                ? {
                    label: "Ersten Trigger erstellen",
                    icon: Plus,
                    onClick: () => setNewTriggerOpen(true),
                  }
                : undefined
            }
            tip="Trigger ermöglichen es Ihnen, Workflows automatisch zu starten, wenn bestimmte Ereignisse eintreten."
          />
        ) : (
          filteredTriggers.map((trigger) => (
          <Card key={trigger.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{trigger.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{trigger.workflow}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Badge variant="outline" className="shrink-0">{trigger.type}</Badge>
                  <span className="text-sm text-muted-foreground shrink-0">{trigger.time}</span>
                  <Badge 
                    variant={trigger.status === "active" ? "default" : "secondary"}
                    className={trigger.status === "active" ? "text-white border-transparent" : ""}
                    style={trigger.status === "active" ? { background: sectionGradient } : undefined}
                  >
                    {trigger.status === "active" ? "Active" : "Paused"}
                  </Badge>
                  <span className="text-sm font-medium shrink-0">{trigger.nextRun}</span>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleTriggerStatus(trigger.id)}
                    >
                    {trigger.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTrigger(trigger.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTrigger(trigger.id)} 
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <Dialog open={newTriggerOpen} onOpenChange={setNewTriggerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuer Trigger</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Trigger für Ihren Workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trigger-name">Trigger Name *</Label>
              <Input 
                id="trigger-name" 
                placeholder="z.B. Daily Report" 
                value={triggerForm.name}
                onChange={(e) => setTriggerForm({ ...triggerForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger-type">Trigger Typ *</Label>
              <Select 
                value={triggerForm.type} 
                onValueChange={(value: "schedule" | "webhook" | "event") => 
                  setTriggerForm({ ...triggerForm, type: value })
                }
              >
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Wählen Sie einen Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {triggerForm.type === "schedule" ? (
              <>
                <div className="space-y-2">
                  <Label>Datum *</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !triggerForm.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {triggerForm.date ? (
                          format(triggerForm.date, "EEEE, dd.MM.yyyy", { locale: de })
                        ) : (
                          <span>Datum auswählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={triggerForm.date}
                        onSelect={(date) => {
                          setTriggerForm({ ...triggerForm, date });
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        locale={de}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Uhrzeit *</Label>
                  <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !triggerForm.time && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {triggerForm.time ? (
                          triggerForm.time
                        ) : (
                          <span>Uhrzeit auswählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-4">
                        <div className="space-y-2">
                          <Label>Aus Liste wählen (30-Minuten-Schritte)</Label>
                          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.value}
                                variant={triggerForm.time === slot.value ? "default" : "outline"}
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setTriggerForm({ ...triggerForm, time: slot.value });
                                  setTimePickerOpen(false);
                                }}
                              >
                                {slot.label}
                              </Button>
                            ))}
                          </div>
                          <div className="pt-4 border-t">
                            <Label>Oder eigene Uhrzeit eingeben</Label>
                            <Input
                              type="time"
                              value={triggerForm.time}
                              onChange={(e) => setTriggerForm({ ...triggerForm, time: e.target.value })}
                              className="mt-2"
                              step="1800"
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="trigger-time">Bedingung *</Label>
                <Input 
                  id="trigger-time" 
                  placeholder={
                    triggerForm.type === "webhook"
                      ? "z.B. On Signup oder On Event"
                      : "z.B. On Error oder On Update"
                  }
                  value={triggerForm.time}
                  onChange={(e) => setTriggerForm({ ...triggerForm, time: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="trigger-workflow">Workflow</Label>
              <Input 
                id="trigger-workflow" 
                placeholder="Verknüpfter Workflow (optional)" 
                value={triggerForm.workflow}
                onChange={(e) => setTriggerForm({ ...triggerForm, workflow: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTriggerOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleCreateTrigger} 
              className="text-white font-medium"
              style={{ background: sectionGradient }}
            >
              Trigger erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <DialogDescription>
              Filtern Sie die Trigger nach verschiedenen Kriterien.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="paused">Pausiert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Typen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFilterStatus("all");
              setFilterType("all");
              setFilterOpen(false);
            }}>
              Zurücksetzen
            </Button>
            <Button onClick={handleApplyFilter}>
              Filter anwenden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

