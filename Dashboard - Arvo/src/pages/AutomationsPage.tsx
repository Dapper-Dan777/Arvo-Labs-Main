import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkflows, WorkflowNode, WorkflowConnection } from "@/contexts/WorkflowContext";
import { Button } from "@/components/ui/button";
import { useSectionGradient } from "@/lib/sectionGradients";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Filter, 
  AlertCircle, 
  CheckCircle2,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Node-Komponenten im Zapier-Stil
const TriggerNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={cn(
        "px-4 py-3 bg-card border-2 rounded-lg shadow-sm min-w-[240px] transition-all",
        selected
          ? "border-purple-500 shadow-md"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-purple-500 !border-2 !border-card" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Trigger</div>
          <div className="font-semibold text-sm text-foreground truncate">{data.label}</div>
          {data.config?.service && (
            <div className="text-xs text-muted-foreground truncate">{data.config.service}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={cn(
        "px-4 py-3 bg-card border-2 rounded-lg shadow-sm min-w-[240px] transition-all",
        selected
          ? "border-primary shadow-md"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-primary !border-2 !border-card" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-primary !border-2 !border-card" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Action</div>
          <div className="font-semibold text-sm text-foreground truncate">{data.label}</div>
          {data.config?.service && (
            <div className="text-xs text-muted-foreground truncate">{data.config.service}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConditionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={cn(
        "px-4 py-3 bg-card border-2 rounded-lg shadow-sm min-w-[240px] transition-all",
        selected
          ? "border-blue-500 shadow-md"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card" />
      <Handle type="source" position={Position.Right} id="true" className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card !top-[30%]" />
      <Handle type="source" position={Position.Right} id="false" className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card !bottom-[30%]" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
          <Filter className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Filter</div>
          <div className="font-semibold text-sm text-foreground truncate">{data.label}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

// Verfügbare Apps/Services (Zapier-Stil)
const AVAILABLE_APPS = {
  triggers: [
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      triggers: ["New Email", "New Labeled Email", "Email in Inbox"],
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      triggers: ["New Message", "New Channel Message", "Mention"],
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      icon: "📊",
      triggers: ["New Row", "Updated Row", "New Worksheet"],
    },
    {
      id: "trello",
      name: "Trello",
      icon: "📋",
      triggers: ["New Card", "Card Updated", "New List"],
    },
  ],
  actions: [
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      actions: ["Send Email", "Draft Email", "Add Label"],
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      actions: ["Send Message", "Create Channel", "Update Message"],
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      icon: "📊",
      actions: ["Create Row", "Update Row", "Find Row"],
    },
    {
      id: "trello",
      name: "Trello",
      icon: "📋",
      actions: ["Create Card", "Update Card", "Add Comment"],
    },
    {
      id: "path",
      name: "Path",
      icon: "🔀",
      actions: ["Path by Zapier"],
    },
  ],
};

function AutomationsCanvas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWorkflow } = useWorkflows();
  const sectionGradient = useSectionGradient(); // Automations-Gradient: var(--gradient-automations)
  const [workflowName, setWorkflowName] = useState("My Zap");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeConfigOpen, setNodeConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"triggers" | "actions">("triggers");
  const { reactFlowInstance } = useReactFlow();
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleAddNode = (appId: string, item: string, category: "trigger" | "action", position?: { x: number; y: number }) => {
    const app =
      category === "trigger"
        ? AVAILABLE_APPS.triggers.find((a) => a.id === appId)
        : AVAILABLE_APPS.actions.find((a) => a.id === appId);

    if (!app) return;

    const newNode: Node = {
      id: `${category}_${Date.now()}`,
      type: category === "trigger" ? "trigger" : appId === "path" ? "condition" : "action",
      position: position || (reactFlowInstance
        ? reactFlowInstance.project({ x: 300, y: 100 + nodes.length * 150 })
        : { x: 300, y: 100 + nodes.length * 150 }),
      data: {
        label: item,
        config: {
          service: app.name,
          type: appId,
          action: item,
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);
    toast({
      title: "Step hinzugefügt",
      description: `${item} wurde hinzugefügt.`,
    });
  };

  const onDragStart = (event: React.DragEvent, appId: string, item: string, category: "trigger" | "action") => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ appId, item, category }));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!reactFlowInstance || !reactFlowWrapperRef.current) return;

    const data = event.dataTransfer.getData("application/reactflow");
    if (!data) return;

    try {
      const { appId, item, category } = JSON.parse(data);
      const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      handleAddNode(appId, item, category, position);
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeConfigOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    toast({
      title: "Step gelöscht",
      description: "Der Step wurde entfernt.",
    });
  };

  const handleSave = () => {
    // Konvertiere React Flow Nodes zu Workflow Nodes
    const workflowNodes: WorkflowNode[] = nodes.map((node) => ({
      id: node.id,
      type: (node.type as "trigger" | "action" | "condition"),
      label: node.data.label,
      config: node.data.config || {},
      position: node.position,
    }));

    // Konvertiere React Flow Edges zu Workflow Connections
    const workflowConnections: WorkflowConnection[] = edges.map((edge) => ({
      id: edge.id || `conn-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
    }));

    // Erstelle neuen Workflow
    const newWorkflow = addWorkflow({
      name: workflowName || "My Zap",
      status: "paused",
      progress: 0,
      lastRun: "Never",
      duration: "—",
      category: "marketing",
      nodes: workflowNodes,
      connections: workflowConnections,
    });

    toast({
      title: "Workflow gespeichert",
      description: "Ihr Workflow wurde erfolgreich gespeichert.",
    });

    // KEINE Navigation - User bleibt auf der Seite zum Weiterbearbeiten
  };

  const filteredApps =
    selectedCategory === "triggers"
      ? AVAILABLE_APPS.triggers.filter(
          (app) =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.triggers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : AVAILABLE_APPS.actions.filter(
          (app) =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.actions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/workflows/marketing")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-semibold border-0 focus-visible:ring-0 max-w-xs h-auto p-0 bg-transparent"
            placeholder="My Zap"
          />
          <div className="text-sm text-foreground font-medium">
            {nodes.length} {nodes.length === 1 ? "Step" : "Steps"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          <Button
            className="text-white font-medium"
            style={{ background: sectionGradient }}
            onClick={() => toast({ title: "Zap getestet" })}
          >
            <Play className="h-4 w-4 mr-2" />
            Testen
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Apps */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setSelectedCategory("triggers")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                selectedCategory === "triggers"
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Triggers
            </button>
            <button
              onClick={() => setSelectedCategory("actions")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                selectedCategory === "actions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Actions
            </button>
          </div>

          {/* Apps List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredApps.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Keine Apps gefunden
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApps.map((app) => (
                  <div key={app.id} className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-xl">{app.icon}</span>
                      <span className="font-medium text-sm text-foreground">{app.name}</span>
                    </div>
                    <div className="space-y-1">
                      {(selectedCategory === "triggers" ? app.triggers : app.actions).map(
                        (item) => (
                          <button
                            key={item}
                            draggable={true}
                            onDragStart={(e) => {
                              e.stopPropagation();
                              onDragStart(e, app.id, item, selectedCategory === "triggers" ? "trigger" : "action");
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation();
                            }}
                            onClick={() =>
                              handleAddNode(
                                app.id,
                                item,
                                selectedCategory === "triggers" ? "trigger" : "action"
                              )
                            }
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors cursor-grab active:cursor-grabbing"
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div 
          className="flex-1 relative bg-background overflow-auto"
          ref={reactFlowWrapperRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onInit={(instance) => {
              // Fit View beim Initialisieren mit Padding
              setTimeout(() => {
                instance.fitView({
                  padding: 0.2,
                  includeHiddenNodes: false,
                  minZoom: 0.5,
                  maxZoom: 1.5,
                  duration: 400
                });
              }, 100);
            }}
            nodeTypes={nodeTypes}
            className="bg-background"
            connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6366f1", strokeWidth: 2 },
            }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            panOnDrag={[1, 2]}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            minZoom={0.1}
            maxZoom={4}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Shift"]}
            preventScrolling={false}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls className="bg-card border border-border rounded-lg shadow-sm" />
            <Panel position="top-right" className="m-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (reactFlowInstance) {
                    const allNodes = reactFlowInstance.getNodes();
                    if (allNodes && allNodes.length > 0) {
                      reactFlowInstance.fitView({
                        nodes: allNodes,
                        padding: 0.2,
                        includeHiddenNodes: false,
                        minZoom: 0.5,
                        maxZoom: 1.5,
                        duration: 400
                      });
                    } else {
                      reactFlowInstance.fitView({
                        padding: 0.2,
                        includeHiddenNodes: false,
                        minZoom: 0.5,
                        maxZoom: 1.5,
                        duration: 400
                      });
                    }
                  }
                }}
                className="bg-card border border-border shadow-sm"
              >
                Fit View
              </Button>
            </Panel>
            <Background 
              variant="dots" 
              gap={20} 
              size={1}
              color={isDark ? "#6b7280" : "#d1d5db"}
            />
            
            {nodes.length === 0 && (
              <Panel position="top-center" className="mt-20">
                <div className="text-center bg-card rounded-lg border border-border shadow-sm p-8 max-w-md">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    Starten Sie Ihren Zap
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wählen Sie einen Trigger aus der linken Sidebar, um zu beginnen.
                  </p>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Node Config Dialog */}
      <Dialog open={nodeConfigOpen} onOpenChange={setNodeConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.data.label}</DialogTitle>
            <DialogDescription>
              Konfigurieren Sie diesen Step.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedNode && (
              <>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input value={selectedNode.data.config?.service || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input value={selectedNode.type || ""} disabled />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNodeConfigOpen(false)}>
              Schließen
            </Button>
            {selectedNode && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedNode) {
                    handleDeleteNode(selectedNode.id);
                    setNodeConfigOpen(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AutomationsPage() {
  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <AutomationsCanvas />
      </div>
    </ReactFlowProvider>
  );
}

