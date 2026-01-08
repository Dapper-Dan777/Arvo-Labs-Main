import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, Activity, Clock, Zap, Download, Settings, PieChart, LineChart, ScatterChart, Grid3x3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, 
  Pie, Cell, ComposedChart, ScatterChart as RechartsScatterChart, Scatter, 
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";
import { useSectionGradient } from "@/lib/sectionGradients";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, exportToJSON, exportChartAsImage } from "@/lib/analyticsExport";
import { ReportBuilder, type ReportConfig } from "@/components/analytics/ReportBuilder";
import { useLiveUpdates } from "@/hooks/use-live-updates";

const chartData = [
  { name: "Mon", runs: 45, errors: 2, time: 120, success: 43 },
  { name: "Tue", runs: 52, errors: 1, time: 95, success: 51 },
  { name: "Wed", runs: 61, errors: 3, time: 140, success: 58 },
  { name: "Thu", runs: 48, errors: 0, time: 88, success: 48 },
  { name: "Fri", runs: 55, errors: 2, time: 115, success: 53 },
  { name: "Sat", runs: 32, errors: 1, time: 60, success: 31 },
  { name: "Sun", runs: 28, errors: 0, time: 45, success: 28 },
];

// Pie Chart Data
const pieData = [
  { name: "Erfolgreich", value: 312, color: "#4facfe" },
  { name: "Fehler", value: 9, color: "#ef4444" },
  { name: "Pausiert", value: 45, color: "#f59e0b" },
  { name: "Laufend", value: 12, color: "#10b981" },
];

// Scatter Chart Data
const scatterData = chartData.map((d, i) => ({
  x: d.runs,
  y: d.time,
  z: d.errors,
  name: d.name,
}));

// Radar Chart Data
const radarData = [
  { subject: "Performance", A: 95, fullMark: 100 },
  { subject: "Zuverlässigkeit", A: 98, fullMark: 100 },
  { subject: "Geschwindigkeit", A: 88, fullMark: 100 },
  { subject: "Skalierbarkeit", A: 92, fullMark: 100 },
  { subject: "Effizienz", A: 90, fullMark: 100 },
];

// Heatmap Data (simuliert)
const heatmapData = Array.from({ length: 7 }, (_, day) => ({
  day: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][day],
  ...Array.from({ length: 24 }, (_, hour) => ({
    [`h${hour}`]: Math.floor(Math.random() * 100),
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
}));

const kpis = [
  { label: "Total Runs", value: "1,247", change: "+12%", positive: true, icon: Activity },
  { label: "Success Rate", value: "99.2%", change: "+0.5%", positive: true, icon: Zap },
  { label: "Avg. Duration", value: "2.4s", change: "-15%", positive: true, icon: Clock },
  { label: "Errors", value: "9", change: "-25%", positive: true, icon: BarChart3 },
];

export default function AnalyticsPage() {
  const sectionGradient = useSectionGradient();
  const { toast } = useToast();
  const [selectedChartType, setSelectedChartType] = useState<string>("area");
  
  const handleExportChart = async (format: "png" | "csv" | "json") => {
    try {
      if (format === "csv") {
        exportToCSV(chartData, "analytics-data");
        toast({
          title: "Export erfolgreich",
          description: "Daten wurden als CSV exportiert.",
        });
      } else if (format === "json") {
        exportToJSON(chartData, "analytics-data");
        toast({
          title: "Export erfolgreich",
          description: "Daten wurden als JSON exportiert.",
        });
      } else if (format === "png") {
        // Exportiere den aktuell sichtbaren Chart
        const chartElement = document.querySelector(".recharts-wrapper") as HTMLElement;
        if (chartElement) {
          await exportChartAsImage(chartElement, "analytics-chart");
          toast({
            title: "Export erfolgreich",
            description: "Chart wurde als PNG exportiert.",
          });
        } else {
          toast({
            title: "Fehler",
            description: "Chart-Element nicht gefunden.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Monitor your workflow performance and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportChart("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportChart("json")}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* KPI Cards - Erste Card mit Section-Gradient als Highlight */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const isHighlight = index === 0; // Erste KPI-Card als Highlight
          return (
            <Card key={kpi.label} className={isHighlight ? "border-2" : ""} style={isHighlight ? { borderColor: "transparent", background: sectionGradient } : undefined}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${isHighlight ? "text-white" : "text-muted-foreground"}`} />
                  <span className={`text-xs flex items-center gap-1 ${isHighlight ? "text-white" : (kpi.positive ? "text-green-600" : "text-red-600")}`}>
                    {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isHighlight ? "text-white" : ""}`}>{kpi.value}</p>
                <p className={`text-sm ${isHighlight ? "text-white/90" : "text-muted-foreground"}`}>{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="runs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="runs">Runs</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="pie">Verteilung</TabsTrigger>
          <TabsTrigger value="composed">Kombiniert</TabsTrigger>
          <TabsTrigger value="scatter">Korrelation</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="runs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow Runs This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      {/* KI Startup Gradient für Chart-Fill */}
                      <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.5}/>
                        <stop offset="50%" stopColor="#00f2fe" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="runs" 
                      stroke="#4facfe" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRuns)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Execution Time (minutes)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }} 
                    />
                    <Bar dataKey="time" fill="#4facfe" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pie Chart */}
        <TabsContent value="pie">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status-Verteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status-Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                        <span className="text-sm font-semibold">
                          {((item.value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Composed Chart */}
        <TabsContent value="composed">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kombinierte Metriken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }} 
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="runs" 
                      fill="#4facfe" 
                      fillOpacity={0.3}
                      stroke="#4facfe"
                      strokeWidth={2}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="errors" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="success" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scatter Chart */}
        <TabsContent value="scatter">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Runs vs. Execution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 165, 250, 0.2)" />
                    <XAxis 
                      type="number"
                      dataKey="x"
                      name="Runs"
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <YAxis 
                      type="number"
                      dataKey="y"
                      name="Time (min)"
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(96, 165, 250, 0.3)" }}
                    />
                    <RechartsTooltip 
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }}
                    />
                    <Scatter 
                      dataKey="y" 
                      fill="#4facfe"
                    />
                  </RechartsScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Radar Chart */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance-Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(96, 165, 250, 0.2)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fill: "#9ca3b4", fontSize: 12 }}
                    />
                    <Radar 
                      name="Performance" 
                      dataKey="A" 
                      stroke="#4facfe" 
                      fill="#4facfe" 
                      fillOpacity={0.6}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#161821", 
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
