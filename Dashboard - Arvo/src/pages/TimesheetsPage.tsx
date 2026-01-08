import { useState, useMemo, useEffect, useRef } from "react";
import { Clock, Plus, Calendar, Filter, Download, TrendingUp, PlayCircle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  startTime: string;
  startTimestamp?: number; // Unix timestamp in ms für genaue Berechnung
  endTime: string;
  endTimestamp?: number; // Unix timestamp in ms für genaue Berechnung
  duration: string;
  status: "active" | "completed";
}

const mockTimeEntries: TimeEntry[] = [
  // Heute
  {
    id: "1",
    date: new Date().toISOString().split("T")[0],
    project: "Workflow Automation",
    task: "API Integration",
    startTime: "09:00",
    endTime: "12:30",
    duration: "3.5h",
    status: "completed",
  },
  {
    id: "2",
    date: new Date().toISOString().split("T")[0],
    project: "Dashboard Development",
    task: "UI Components",
    startTime: "13:30",
    endTime: "17:00",
    duration: "3.5h",
    status: "completed",
  },
  // Letzte Woche
  {
    id: "3",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Team Management",
    task: "Meeting & Planning",
    startTime: "09:00",
    endTime: "10:30",
    duration: "1.5h",
    status: "completed",
  },
  {
    id: "4",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Workflow Automation",
    task: "Testing & Debugging",
    startTime: "10:45",
    endTime: "14:00",
    duration: "3.25h",
    status: "completed",
  },
  {
    id: "5",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Dashboard Development",
    task: "Responsive Design",
    startTime: "09:00",
    endTime: "12:00",
    duration: "3h",
    status: "completed",
  },
  {
    id: "6",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Team Management",
    task: "Code Review",
    startTime: "14:00",
    endTime: "16:30",
    duration: "2.5h",
    status: "completed",
  },
  {
    id: "7",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Workflow Automation",
    task: "Documentation",
    startTime: "09:00",
    endTime: "11:00",
    duration: "2h",
    status: "completed",
  },
  {
    id: "8",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Dashboard Development",
    task: "Bug Fixes",
    startTime: "11:30",
    endTime: "15:00",
    duration: "3.5h",
    status: "completed",
  },
  {
    id: "9",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Team Management",
    task: "Sprint Planning",
    startTime: "09:00",
    endTime: "10:00",
    duration: "1h",
    status: "completed",
  },
  {
    id: "10",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Workflow Automation",
    task: "Performance Optimization",
    startTime: "10:30",
    endTime: "16:00",
    duration: "5.5h",
    status: "completed",
  },
  // Ältere Daten für Monat/Jahr
  {
    id: "11",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Dashboard Development",
    task: "Feature Implementation",
    startTime: "09:00",
    endTime: "13:00",
    duration: "4h",
    status: "completed",
  },
  {
    id: "12",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Workflow Automation",
    task: "Integration Testing",
    startTime: "09:00",
    endTime: "12:00",
    duration: "3h",
    status: "completed",
  },
  {
    id: "13",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Team Management",
    task: "Retrospective",
    startTime: "14:00",
    endTime: "15:30",
    duration: "1.5h",
    status: "completed",
  },
  {
    id: "14",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    project: "Dashboard Development",
    task: "UI/UX Improvements",
    startTime: "09:00",
    endTime: "17:00",
    duration: "8h",
    status: "completed",
  },
];

// Farben für verschiedene Projekte
const projectColors: Record<string, string> = {
  "Workflow Automation": "#6366f1", // Indigo
  "Dashboard Development": "#4a4a4a", // Neutral Gray
  "Team Management": "#f59e0b", // Amber
};

// KI Startup Farbpalette - Hellere, leuchtendere Farben für bessere Sichtbarkeit
const colorPalette = [
  "#4facfe", // Electric Blue
  "#00f2fe", // Cyan
  "#a855f7", // Neon Purple
  "#fa709a", // Neon Pink
  "#fee140", // Neon Yellow
  "#22d3ee", // Bright Cyan
  "#9333ea", // Purple
  "#06b6d4", // Teal Cyan
];

// Funktion zum Abrufen der Farbe für ein Projekt
const getProjectColor = (project: string, index: number): string => {
  return projectColors[project] || colorPalette[index % colorPalette.length];
};

export default function TimesheetsPage() {
  const [entries, setEntries] = useState(mockTimeEntries);
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year">("week");
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    project: "",
    task: "",
    startTime: "",
    endTime: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const totalHours = entries
    .filter((e) => e.status === "completed")
    .reduce((sum, e) => {
      const hours = parseFloat(e.duration.replace("h", ""));
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);

  const handleStartTimer = () => {
    const now = new Date();
    const timestamp = now.getTime();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    
    const newEntry: TimeEntry = {
      id: timestamp.toString(),
      date: now.toISOString().split("T")[0],
      project: "Aktuelles Projekt",
      task: "Aktuelle Aufgabe",
      startTime: timeString,
      startTimestamp: timestamp,
      endTime: "",
      duration: "00:00:00",
      status: "active",
    };

    // Stop any active timers
    const stopTime = new Date();
    const stopTimestamp = stopTime.getTime();
    const stopTimeString = `${stopTime.getHours().toString().padStart(2, "0")}:${stopTime.getMinutes().toString().padStart(2, "0")}:${stopTime.getSeconds().toString().padStart(2, "0")}`;
    
    setEntries(
      entries.map((e) => {
        if (e.status === "active" && e.startTimestamp) {
          const durationMs = stopTimestamp - e.startTimestamp;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
          const durationString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          return {
            ...e,
            status: "completed",
            endTime: stopTimeString,
            endTimestamp: stopTimestamp,
            duration: durationString,
          };
        }
        return e;
      })
    );

    setEntries([newEntry, ...entries]);
    setCurrentTime(now);
    setElapsedTime("00:00:00");
    
    toast({
      title: "Timer gestartet",
      description: `Zeiterfassung gestartet um ${timeString}`,
    });
  };

  const handleStopTimer = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry || !entry.startTimestamp) return;

    const now = new Date();
    const endTimestamp = now.getTime();
    const endTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    
    const durationMs = endTimestamp - entry.startTimestamp;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    const durationString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);

    setEntries(
      entries.map((e) =>
        e.id === id
          ? {
              ...e,
              endTime,
              endTimestamp,
              duration: durationString,
              status: "completed",
            }
          : e
      )
    );

    // Stoppe den Intervall
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedTime("00:00:00");

    toast({
      title: "Timer gestoppt",
      description: `Zeiterfassung beendet um ${endTime}. Dauer: ${durationString} (${durationHours}h)`,
    });
  };

  const handleCreateEntry = () => {
    if (!newEntry.project.trim() || !newEntry.task.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(`${newEntry.date}T${newEntry.startTime}`);
    const end = new Date(`${newEntry.date}T${newEntry.endTime}`);
    const durationHours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);

    const entry: TimeEntry = {
      id: Date.now().toString(),
      ...newEntry,
      duration: `${durationHours}h`,
      status: "completed",
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      project: "",
      task: "",
      startTime: "",
      endTime: "",
    });
    setNewEntryOpen(false);
    toast({
      title: "Zeiteintrag erstellt",
      description: "Der Zeiteintrag wurde erfolgreich hinzugefügt.",
    });
  };

  const activeEntry = entries.find((e) => e.status === "active");

  // Echtzeit-Timer: Aktualisiere verstrichene Zeit jede Sekunde
  useEffect(() => {
    if (activeEntry && activeEntry.startTimestamp) {
      const updateTimer = () => {
        const now = Date.now();
        const elapsedMs = now - activeEntry.startTimestamp!;
        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setElapsedTime(timeString);
        setCurrentTime(new Date());
      };

      // Sofort aktualisieren
      updateTimer();

      // Dann jede Sekunde
      intervalRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Stoppe Timer wenn kein aktiver Entry vorhanden
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsedTime("00:00:00");
    }
  }, [activeEntry?.id, activeEntry?.startTimestamp]);

  // Funktion zum Konvertieren von Stunden-String zu Stunden (Zahl)
  const parseHours = (duration: string): number => {
    const hours = parseFloat(duration.replace("h", "").replace(",", "."));
    return isNaN(hours) ? 0 : hours;
  };

  // Chart-Daten basierend auf Zeitraum berechnen
  const chartData = useMemo(() => {
    const completedEntries = entries.filter((e) => e.status === "completed");
    const now = new Date();
    
    let filteredEntries = completedEntries;
    let groupKey: (date: Date) => string;
    let dateRange: Date[] = [];

    // Filtere Einträge basierend auf Zeitraum
    if (chartPeriod === "day") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= today;
      });
      // Gruppiere nach Stunden
      groupKey = (date: Date) => {
        const hour = date.getHours();
        return `${hour.toString().padStart(2, "0")}:00`;
      };
      // Erstelle Stunden-Array (8-18 Uhr)
      for (let h = 8; h <= 18; h++) {
        dateRange.push(new Date(now.getFullYear(), now.getMonth(), now.getDate(), h));
      }
    } else if (chartPeriod === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      weekStart.setHours(0, 0, 0, 0);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart;
      });
      groupKey = (date: Date) => {
        const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
        return dayNames[date.getDay()];
      };
      // Erstelle Wochen-Array
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dateRange.push(date);
      }
    } else if (chartPeriod === "month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= monthStart;
      });
      groupKey = (date: Date) => {
        const weekNum = Math.ceil(date.getDate() / 7);
        return `Woche ${weekNum}`;
      };
      // Erstelle Monats-Array (Wochen)
      const weeksInMonth = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 0).getDay()) / 7);
      for (let w = 1; w <= weeksInMonth; w++) {
        dateRange.push(new Date(now.getFullYear(), now.getMonth(), (w - 1) * 7 + 1));
      }
    } else {
      // Jahr
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= yearStart;
      });
      groupKey = (date: Date) => {
        const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        return monthNames[date.getMonth()];
      };
      // Erstelle Jahres-Array (Monate)
      for (let m = 0; m < 12; m++) {
        dateRange.push(new Date(now.getFullYear(), m, 1));
      }
    }

    // Sammle alle Projekte
    const projects = Array.from(new Set(filteredEntries.map((e) => e.project)));

    // Gruppiere Daten
    const groupedData: Record<string, Record<string, number>> = {};
    
    dateRange.forEach((date) => {
      const key = groupKey(date);
      groupedData[key] = {};
      projects.forEach((project) => {
        groupedData[key][project] = 0;
      });
    });

    filteredEntries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const key = groupKey(entryDate);
      if (groupedData[key]) {
        const hours = parseHours(entry.duration);
        groupedData[key][entry.project] = (groupedData[key][entry.project] || 0) + hours;
      }
    });

    // Konvertiere zu Array-Format für Recharts
    return dateRange.map((date) => {
      const key = groupKey(date);
      const dataPoint: Record<string, string | number> = {
        name: chartPeriod === "day" ? key : chartPeriod === "week" ? key : chartPeriod === "month" ? key : key,
      };
      projects.forEach((project) => {
        dataPoint[project] = groupedData[key]?.[project] || 0;
      });
      return dataPoint;
    });
  }, [entries, chartPeriod]);

  // Sammle alle Projekte für die Legende (basierend auf Chart-Daten)
  const chartProjects = useMemo(() => {
    const completedEntries = entries.filter((e) => e.status === "completed");
    const now = new Date();
    let filteredEntries = completedEntries;

    if (chartPeriod === "day") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= today;
      });
    } else if (chartPeriod === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      weekStart.setHours(0, 0, 0, 0);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart;
      });
    } else if (chartPeriod === "month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= monthStart;
      });
    } else {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filteredEntries = completedEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= yearStart;
      });
    }

    return Array.from(new Set(filteredEntries.map((e) => e.project)));
  }, [entries, chartPeriod]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Zeiterfassung</h1>
          <p className="text-sm text-muted-foreground">Verfolge deine Arbeitszeit und Projekte</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setNewEntryOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Manuell hinzufügen
          </Button>
          {activeEntry ? (
            <Button
              variant="destructive"
              onClick={() => handleStopTimer(activeEntry.id)}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              <Square className="h-4 w-4 mr-2" />
              Timer stoppen
            </Button>
          ) : (
            <Button onClick={handleStartTimer} className="bg-gradient-to-r from-primary to-purple-500">
              <PlayCircle className="h-4 w-4 mr-2" />
              Timer starten
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heute</p>
                <p className="text-2xl font-bold">
                  {entries
                    .filter((e) => e.date === new Date().toISOString().split("T")[0] && e.status === "completed")
                    .reduce((sum, e) => {
                      const hours = parseFloat(e.duration.replace("h", ""));
                      return sum + (isNaN(hours) ? 0 : hours);
                    }, 0)
                    .toFixed(1)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diese Woche</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktiver Timer</p>
                <p className="text-2xl font-bold">{activeEntry ? "Läuft" : "—"}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Einträge</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Timer Card */}
      {activeEntry && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Aktiver Timer</p>
                <p className="text-lg font-semibold">{activeEntry.project}</p>
                <p className="text-sm text-muted-foreground">{activeEntry.task}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Gestartet:</span> {activeEntry.startTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Aktuelle Zeit:</span> {currentTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="text-right ml-6">
                <p className="text-4xl font-bold text-primary font-mono mb-1">{elapsedTime}</p>
                <p className="text-xs text-muted-foreground mb-4">Verstrichene Zeit</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStopTimer(activeEntry.id)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Timer stoppen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Arbeitszeit Verteilung</CardTitle>
            <Select value={chartPeriod} onValueChange={(value: "day" | "week" | "month" | "year") => setChartPeriod(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Tag</SelectItem>
                <SelectItem value="week">Woche</SelectItem>
                <SelectItem value="month">Monat</SelectItem>
                <SelectItem value="year">Jahr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  label={{ value: "Stunden", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))", fontSize: 12 } }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}h`, ""]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="square"
                />
                {chartProjects.map((project, index) => (
                  <Bar 
                    key={project} 
                    dataKey={project} 
                    stackId="a" 
                    fill={getProjectColor(project, index)}
                    name={project}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Heute</SelectItem>
            <SelectItem value="week">Diese Woche</SelectItem>
            <SelectItem value="month">Dieser Monat</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportieren
        </Button>
      </div>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Zeiteinträge</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Projekt</TableHead>
                <TableHead>Aufgabe</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Ende</TableHead>
                <TableHead>Dauer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString("de-DE")}</TableCell>
                  <TableCell className="font-medium">{entry.project}</TableCell>
                  <TableCell>{entry.task}</TableCell>
                  <TableCell>{entry.startTime}</TableCell>
                  <TableCell>{entry.endTime || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === "active" ? "default" : "secondary"}>
                      {entry.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.status === "active"
                          ? "default"
                          : entry.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {entry.status === "active" ? "Läuft" : "Abgeschlossen"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStopTimer(entry.id)}
                      >
                        Stoppen
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Entry Dialog */}
      <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zeiteintrag manuell hinzufügen</DialogTitle>
            <DialogDescription>
              Füge einen Zeiteintrag manuell hinzu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Datum</Label>
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Projekt *</Label>
              <Input
                placeholder="z.B. Workflow Automation"
                value={newEntry.project}
                onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Aufgabe *</Label>
              <Input
                placeholder="z.B. API Integration"
                value={newEntry.task}
                onChange={(e) => setNewEntry({ ...newEntry, task: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Startzeit</Label>
                <Input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Endzeit</Label>
                <Input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEntryOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateEntry} className="bg-gradient-to-r from-primary to-purple-500">
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

