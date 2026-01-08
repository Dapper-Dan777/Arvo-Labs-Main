import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Loader2, Play, Square, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowNode } from "@/contexts/WorkflowContext";

interface TestStep {
  nodeId: string;
  nodeLabel: string;
  status: "pending" | "running" | "success" | "error";
  duration?: number;
  output?: any;
  error?: string;
  timestamp: Date;
}

interface WorkflowTestPanelProps {
  nodes: WorkflowNode[];
  connections: Array<{ source: string; target: string }>;
  onExecute: (mockData?: any) => Promise<void>;
  onStop: () => void;
  isRunning: boolean;
}

export function WorkflowTestPanel({
  nodes,
  connections,
  onExecute,
  onStop,
  isRunning,
}: WorkflowTestPanelProps) {
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  const [mockData, setMockData] = useState<Record<string, any>>({});
  const [showMockData, setShowMockData] = useState(false);

  const handleStartTest = async () => {
    setTestSteps([]);
    
    // Erstelle initiale Test-Steps für alle Nodes
    const initialSteps: TestStep[] = nodes.map((node) => ({
      nodeId: node.id,
      nodeLabel: node.label,
      status: "pending",
      timestamp: new Date(),
    }));
    setTestSteps(initialSteps);

    // Führe Test aus
    await onExecute(mockData);
  };

  const updateStepStatus = (nodeId: string, status: TestStep["status"], output?: any, error?: string, duration?: number) => {
    setTestSteps((prev) =>
      prev.map((step) =>
        step.nodeId === nodeId
          ? { ...step, status, output, error, duration, timestamp: new Date() }
          : step
      )
    );
  };

  const getStatusIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "pending":
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestStep["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground";
      case "running":
        return "bg-primary/10 text-primary border-primary/20";
      case "success":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "error":
        return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  const triggerNode = nodes.find((n) => n.type === "trigger");
  const hasTrigger = !!triggerNode;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Test-Modus</CardTitle>
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <Button
                size="sm"
                onClick={handleStartTest}
                disabled={!hasTrigger}
                className="bg-gradient-to-r from-primary to-purple-500"
              >
                <Play className="h-4 w-4 mr-2" />
                Test starten
              </Button>
            ) : (
              <Button size="sm" variant="destructive" onClick={onStop}>
                <Square className="h-4 w-4 mr-2" />
                Stoppen
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasTrigger && (
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-600">
              Bitte fügen Sie mindestens einen Trigger hinzu, um den Workflow zu testen.
            </p>
          </div>
        )}

        {triggerNode && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Trigger: {triggerNode.label}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMockData(!showMockData)}
            >
              {showMockData ? "Mock-Daten ausblenden" : "Mock-Daten eingeben"}
            </Button>
            {showMockData && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 text-xs font-mono bg-background border rounded"
                  rows={4}
                  placeholder='{"email": "test@example.com", "subject": "Test Email"}'
                  value={JSON.stringify(mockData[triggerNode.id] || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setMockData({ ...mockData, [triggerNode.id]: parsed });
                    } catch {
                      // Ignore invalid JSON
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Ausführungs-Log</p>
          <ScrollArea className="h-[300px] border rounded-lg p-4">
            {testSteps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Noch keine Tests ausgeführt</p>
                <p className="text-xs mt-1">Klicken Sie auf "Test starten", um den Workflow zu testen.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testSteps.map((step, index) => {
                  const node = nodes.find((n) => n.id === step.nodeId);
                  return (
                    <div
                      key={step.nodeId}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        getStatusColor(step.status)
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(step.status)}
                          <span className="font-medium text-sm">
                            {index + 1}. {step.nodeLabel}
                          </span>
                          {node && (
                            <Badge variant="outline" className="text-xs">
                              {node.type}
                            </Badge>
                          )}
                        </div>
                        {step.duration && (
                          <span className="text-xs text-muted-foreground">
                            {step.duration}ms
                          </span>
                        )}
                      </div>
                      {step.output && (
                        <div className="mt-2 p-2 bg-background/50 rounded text-xs font-mono">
                          <p className="text-muted-foreground mb-1">Output:</p>
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(step.output, null, 2)}
                          </pre>
                        </div>
                      )}
                      {step.error && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
                          <p className="text-red-600 font-medium mb-1">Fehler:</p>
                          <p className="text-red-600">{step.error}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {step.timestamp.toLocaleTimeString("de-DE")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {testSteps.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <span>
                Erfolgreich:{" "}
                <span className="font-medium text-green-600">
                  {testSteps.filter((s) => s.status === "success").length}
                </span>
              </span>
              <span>
                Fehler:{" "}
                <span className="font-medium text-red-600">
                  {testSteps.filter((s) => s.status === "error").length}
                </span>
              </span>
              <span>
                Ausstehend:{" "}
                <span className="font-medium text-muted-foreground">
                  {testSteps.filter((s) => s.status === "pending").length}
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}






