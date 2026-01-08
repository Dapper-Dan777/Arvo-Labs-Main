import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Save, Download, BarChart3, LineChart, PieChart, AreaChart, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface ReportConfig {
  id: string;
  name: string;
  description?: string;
  chartType: "area" | "bar" | "line" | "pie" | "composed";
  dataSource: string;
  metrics: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  createdAt: Date;
}

interface ReportBuilderProps {
  onSave?: (config: ReportConfig) => void;
  onExport?: (config: ReportConfig) => void;
}

export function ReportBuilder({ onSave, onExport }: ReportBuilderProps) {
  const { toast } = useToast();
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [chartType, setChartType] = useState<ReportConfig["chartType"]>("area");
  const [dataSource, setDataSource] = useState("workflows");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const availableMetrics = [
    { id: "runs", label: "Workflow Runs", icon: BarChart3 },
    { id: "errors", label: "Errors", icon: BarChart3 },
    { id: "time", label: "Execution Time", icon: BarChart3 },
    { id: "success", label: "Success Rate", icon: BarChart3 },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleSave = () => {
    if (!reportName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Report-Namen ein.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMetrics.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie mindestens eine Metrik aus.",
        variant: "destructive",
      });
      return;
    }

    const config: ReportConfig = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chartType,
      dataSource,
      metrics: selectedMetrics,
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Letzte 7 Tage
        end: new Date(),
      },
      createdAt: new Date(),
    };

    onSave?.(config);
    toast({
      title: "Report gespeichert",
      description: `${reportName} wurde erfolgreich erstellt.`,
    });

    // Reset form
    setReportName("");
    setReportDescription("");
    setSelectedMetrics([]);
  };

  const handleExport = () => {
    if (!reportName.trim() || selectedMetrics.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte erstellen Sie zuerst einen Report.",
        variant: "destructive",
      });
      return;
    }

    const config: ReportConfig = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chartType,
      dataSource,
      metrics: selectedMetrics,
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      createdAt: new Date(),
    };

    onExport?.(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Name */}
        <div className="space-y-2">
          <Label>Report Name</Label>
          <Input
            placeholder="z.B. Weekly Performance Report"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Beschreibung (optional)</Label>
          <Input
            placeholder="Beschreibung des Reports"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
          />
        </div>

        {/* Chart Type */}
        <div className="space-y-2">
          <Label>Chart-Typ</Label>
          <Select value={chartType} onValueChange={(value: ReportConfig["chartType"]) => setChartType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">
                <div className="flex items-center gap-2">
                  <AreaChart className="h-4 w-4" />
                  Area Chart
                </div>
              </SelectItem>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Bar Chart
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Line Chart
                </div>
              </SelectItem>
              <SelectItem value="pie">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Pie Chart
                </div>
              </SelectItem>
              <SelectItem value="composed">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Composed Chart
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Source */}
        <div className="space-y-2">
          <Label>Datenquelle</Label>
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workflows">Workflows</SelectItem>
              <SelectItem value="triggers">Triggers</SelectItem>
              <SelectItem value="integrations">Integrations</SelectItem>
              <SelectItem value="all">Alle Daten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Selection */}
        <div className="space-y-2">
          <Label>Metriken auswählen</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableMetrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedMetrics.includes(metric.id);
              return (
                <Button
                  key={metric.id}
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleMetric(metric.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {metric.label}
                </Button>
              );
            })}
          </div>
          {selectedMetrics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMetrics.map((metricId) => {
                const metric = availableMetrics.find((m) => m.id === metricId);
                return (
                  <Badge key={metricId} variant="secondary" className="flex items-center gap-1">
                    {metric?.label}
                    <button
                      onClick={() => toggleMetric(metricId)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Report speichern
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}






