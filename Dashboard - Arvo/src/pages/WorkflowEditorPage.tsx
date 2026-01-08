import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkflows, WorkflowNode, WorkflowConnection, NodeType } from "@/contexts/WorkflowContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { WorkflowTutorialCard } from "@/components/workflow/WorkflowTutorialCard";
import { WorkflowTestPanel } from "@/components/workflow/WorkflowTestPanel";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { getIntegrationService } from "@/services/integrations";
import { saveWorkflowVersion, getWorkflowHistory, restoreWorkflowVersion, type WorkflowVersion } from "@/lib/workflowVersioning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Save, Play, Plus, Trash2, Settings, Zap, Filter, AlertCircle, CheckCircle2, History, RotateCcw, TestTube, Copy, Clipboard, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntegrationIcon } from "@/components/integrations/IntegrationIcons";
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
  MiniMap,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Node-Komponenten mit Highlight-Support
const TriggerNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  // Check if this node should be highlighted
  const shouldHighlight = data.highlight === "trigger-node";
  
  return (
    <div className={cn(
      "px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg min-w-[200px] transition-all",
      selected && "ring-2 ring-purple-400 ring-offset-2",
      shouldHighlight && "ring-4 ring-primary ring-offset-4 animate-pulse"
    )}>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-purple-500 !border-2 !border-card" />
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.config?.service && (
            <div className="text-xs opacity-90">{data.config.service}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionNode = ({ data, selected, id }: { data: any; selected: boolean; id: string }) => {
  const shouldHighlight = data.highlight === "action-node";
  
  return (
    <div className={cn(
      "px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg min-w-[200px] transition-all",
      selected && "ring-2 ring-primary ring-offset-2",
      shouldHighlight && "ring-4 ring-primary ring-offset-4 animate-pulse"
    )}>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-primary !border-2 !border-card" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-primary !border-2 !border-card" />
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.config?.service && (
            <div className="text-xs opacity-90">{data.config.service}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConditionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={cn(
    "px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg min-w-[200px]",
    selected && "ring-2 ring-blue-400 ring-offset-2"
  )}>
    <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card" />
    <Handle type="source" position={Position.Right} id="true" className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card !top-[30%]" />
    <Handle type="source" position={Position.Right} id="false" className="!w-2 !h-2 !bg-blue-500 !border-2 !border-card !bottom-[30%]" />
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4" />
      <div>
        <div className="font-semibold text-sm">{data.label}</div>
        {data.config?.condition && (
          <div className="text-xs opacity-90">{data.config.condition}</div>
        )}
      </div>
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

// Verfügbare Apps/Services (wie in Zapier)
const AVAILABLE_APPS = {
  triggers: [
    { id: "gmail", name: "Gmail", triggers: ["New Email", "Email Opened", "Label Added"] },
    { id: "slack", name: "Slack", triggers: ["New Message", "Channel Created", "File Shared"] },
    { id: "google_sheets", name: "Google Sheets", triggers: ["New Row", "Row Updated", "Row Deleted"] },
    { id: "notion", name: "Notion", triggers: ["Page Created", "Page Updated"] },
    { id: "webhooks", name: "Webhooks", triggers: ["Catch Hook"] },
  ],
  actions: [
    // Business & Productivity Actions
    { id: "slack", name: "Slack", actions: ["Send Channel Message", "Send DM", "Create Channel"] },
    { id: "gmail", name: "Gmail", actions: ["Send Email", "Mark as Read", "Add Label"] },
    { id: "google_sheets", name: "Google Sheets", actions: ["Create Row", "Update Row", "Find Row"] },
    { id: "notion", name: "Notion", actions: ["Create Page", "Update Page", "Append to Page"] },
    { id: "webhooks", name: "Webhooks", actions: ["POST Request"] },
    { id: "filter", name: "Filter by Zapier", actions: ["Filter", "Continue if..."] },
    { id: "delay", name: "Delay", actions: ["Delay For", "Delay Until"] },
    { id: "path", name: "Paths", actions: ["If/Then/Else", "Continue if..."] },
  ],
};

function WorkflowEditorCanvas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workflows, updateWorkflow, executeWorkflow } = useWorkflows();
  const { toast } = useToast();
  const { highlightElement, isTutorialActive, tutorialWorkflowId, currentStep } = useTutorial();
  const { getIntegration } = useIntegrations();

  const workflow = workflows.find(w => w.id === parseInt(id || "0"));
  
  // Auto-öffne Tutorial wenn es ein Tutorial-Workflow ist und wir im Editor sind
  const showTutorial = isTutorialActive && tutorialWorkflowId === workflow?.id && currentStep !== null;

  // React Flow State
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);
  
  const [workflowName, setWorkflowName] = useState(workflow?.name || "");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeConfigOpen, setNodeConfigOpen] = useState(false);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [addNodeCategory, setAddNodeCategory] = useState<"trigger" | "action">("trigger");
  const [isExecuting, setIsExecuting] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [versionDescription, setVersionDescription] = useState("");
  const [testModeOpen, setTestModeOpen] = useState(false);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  
  // Undo/Redo State
  const [history, setHistory] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Clipboard State
  const [clipboard, setClipboard] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  
  // Drag Feedback State
  const [dragGhost, setDragGhost] = useState<{ x: number; y: number; label: string } | null>(null);

  // Konvertiere Workflow Nodes zu React Flow Nodes
  useEffect(() => {
    if (workflow) {
      const flowNodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type === "filter" ? "condition" : node.type,
        position: node.position,
        data: {
          label: node.label,
          config: node.config,
          originalType: node.type,
          highlight: 
            (highlightElement === "trigger-node" && node.type === "trigger") ||
            (highlightElement === "action-node" && node.type === "action")
              ? highlightElement
              : undefined,
        },
        selected: false,
      }));

      const flowEdges: Edge[] = workflow.connections.map((conn) => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      }));

      setReactFlowNodes(flowNodes);
      setReactFlowEdges(flowEdges);
      // Initialize history
      setHistory([{ nodes: flowNodes, edges: flowEdges }]);
      setHistoryIndex(0);
    }
  }, [workflow, highlightElement, setReactFlowNodes, setReactFlowEdges]);
  
  // Save state to history
  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const newState = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-50); // Keep max 50 history states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);
  
  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setReactFlowNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
      setReactFlowEdges(JSON.parse(JSON.stringify(history[newIndex].edges)));
      toast({
        title: "Rückgängig",
        description: "Letzte Änderung wurde rückgängig gemacht.",
      });
    }
  }, [historyIndex, history, setReactFlowNodes, setReactFlowEdges, toast]);
  
  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setReactFlowNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
      setReactFlowEdges(JSON.parse(JSON.stringify(history[newIndex].edges)));
      toast({
        title: "Wiederholen",
        description: "Letzte Änderung wurde wiederholt.",
      });
    }
  }, [historyIndex, history, setReactFlowNodes, setReactFlowEdges, toast]);
  
  // Copy selected nodes
  const handleCopy = useCallback(() => {
    const selectedNodes = reactFlowNodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;
    
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    const connectedEdges = reactFlowEdges.filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );
    
    setClipboard({ nodes: selectedNodes, edges: connectedEdges });
    toast({
      title: "Kopiert",
      description: `${selectedNodes.length} Node(s) wurden kopiert.`,
    });
  }, [reactFlowNodes, reactFlowEdges, toast]);
  
  // Paste nodes
  const handlePaste = useCallback(() => {
    if (!clipboard || !reactFlowInstance) return;
    
    const offset = 50;
    const newNodes = clipboard.nodes.map((node) => {
      const newId = `${node.type}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + offset,
          y: node.position.y + offset,
        },
        selected: false,
      };
    });
    
    const nodeIdMap = new Map(clipboard.nodes.map((node, index) => [node.id, newNodes[index].id]));
    const newEdges = clipboard.edges.map((edge) => ({
      ...edge,
      id: `edge_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      source: nodeIdMap.get(edge.source) || edge.source,
      target: nodeIdMap.get(edge.target) || edge.target,
    }));
    
    setReactFlowNodes((nds) => {
      const updatedNodes = [...nds, ...newNodes];
      setReactFlowEdges((eds) => {
        const updatedEdges = [...eds, ...newEdges];
        saveToHistory(updatedNodes, updatedEdges);
        return updatedEdges;
      });
      return updatedNodes;
    });
    
    toast({
      title: "Eingefügt",
      description: `${newNodes.length} Node(s) wurden eingefügt.`,
    });
  }, [clipboard, reactFlowInstance, reactFlowNodes, reactFlowEdges, setReactFlowNodes, setReactFlowEdges, saveToHistory, toast]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault();
        handleRedo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        event.preventDefault();
        handleCopy();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        event.preventDefault();
        handlePaste();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, handleCopy, handlePaste]);

  if (!workflow) {
    return (
      <div className="p-4 md:p-6">
        <p>Workflow nicht gefunden</p>
        <Button onClick={() => navigate("/workflows/marketing")}>Zurück</Button>
      </div>
    );
  }

  const onConnect = useCallback(
    (params: Connection) => {
      setReactFlowEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          eds
        );
        saveToHistory(reactFlowNodes, newEdges);
        return newEdges;
      });
    },
    [setReactFlowEdges, reactFlowNodes, saveToHistory]
  );

  const handleSave = () => {
    // Konvertiere React Flow Nodes zurück zu Workflow Nodes
    const nodes: WorkflowNode[] = reactFlowNodes.map((node) => ({
      id: node.id,
      type: (node.data.originalType || node.type) as NodeType,
      label: node.data.label,
      config: node.data.config || {},
      position: node.position,
    }));

    const connections: WorkflowConnection[] = reactFlowEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));

    const updatedWorkflow = {
      ...workflow,
      name: workflowName,
      nodes,
      connections,
    };

    updateWorkflow(workflow.id, {
      name: workflowName,
      nodes,
      connections,
    });

    // Speichere Version
    saveWorkflowVersion(updatedWorkflow, versionDescription || undefined);
    setVersionDescription("");

    toast({
      title: "Workflow gespeichert",
      description: "Ihr Workflow wurde erfolgreich gespeichert und eine neue Version erstellt.",
    });
  };

  const handleAddNode = (appId: string, item: string, category: "trigger" | "action", position?: { x: number; y: number }) => {
    const app = category === "trigger" 
      ? AVAILABLE_APPS.triggers.find(a => a.id === appId)
      : AVAILABLE_APPS.actions.find(a => a.id === appId);
    
    if (!app) return;

    const nodePosition = position || (reactFlowInstance
      ? reactFlowInstance.project({ x: 400, y: 200 + reactFlowNodes.length * 100 })
      : { x: 400, y: 200 + reactFlowNodes.length * 100 });

    const newNode: Node = {
      id: `${category}_${Date.now()}`,
      type: category === "trigger" ? "trigger" : appId === "path" || appId === "filter" ? "condition" : "action",
      position: nodePosition,
      data: {
        label: item,
        config: {
          service: app.name,
          type: appId,
          action: item,
        },
        originalType: category === "trigger" ? "trigger" : appId === "path" || appId === "filter" ? "condition" : "action",
      },
    };

    setReactFlowNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveToHistory(newNodes, reactFlowEdges);
      return newNodes;
    });
    setAddNodeOpen(false);
    toast({
      title: "Node hinzugefügt",
      description: `${item} wurde hinzugefügt. Klicken Sie darauf, um es zu konfigurieren.`,
    });
  };

  const onDragStart = (event: React.DragEvent, appId: string, item: string, category: "trigger" | "action") => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ appId, item, category }));
    event.dataTransfer.effectAllowed = "move";
    
    // Create drag ghost
    setDragGhost({ x: event.clientX, y: event.clientY, label: item });
    
    // Create custom drag image
    const dragImage = document.createElement("div");
    dragImage.className = "px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg text-sm font-medium";
    dragImage.textContent = item;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    
    // Update drag ghost position
    if (dragGhost && reactFlowWrapperRef.current) {
      const rect = reactFlowWrapperRef.current.getBoundingClientRect();
      setDragGhost({
        ...dragGhost,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

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
      setDragGhost(null);
    } catch (error) {
      console.error("Error parsing drag data:", error);
      setDragGhost(null);
    }
  };
  
  // Clear drag ghost on drag end
  useEffect(() => {
    const handleDragEnd = () => {
      setDragGhost(null);
    };
    document.addEventListener("dragend", handleDragEnd);
    return () => document.removeEventListener("dragend", handleDragEnd);
  }, []);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeConfigOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    setReactFlowNodes((nds) => {
      const newNodes = nds.filter((n) => n.id !== nodeId);
      setReactFlowEdges((eds) => {
        const newEdges = eds.filter((e) => e.source !== nodeId && e.target !== nodeId);
        saveToHistory(newNodes, newEdges);
        return newEdges;
      });
      return newNodes;
    });
    toast({
      title: "Node gelöscht",
      description: "Der Node wurde erfolgreich entfernt.",
    });
  };

  const handleNodeConfigUpdate = (updates: Record<string, any>) => {
    if (!selectedNode) return;
    setReactFlowNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  ...updates,
                },
              },
            }
          : node
      )
    );
    setNodeConfigOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => {
            // Navigiere zurück zur passenden Kategorie basierend auf dem Workflow
            const category = workflow?.category || "marketing";
            navigate(`/workflows/${category}`);
          }}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-semibold border-0 focus-visible:ring-0 max-w-xs h-auto p-0"
            placeholder="Workflow Name"
          />
          <div className="text-sm text-muted-foreground">
            {reactFlowNodes.length} Steps
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border-r pr-2 mr-1">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Rückgängig (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Wiederholen (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopy}
            title="Kopieren (Ctrl+C)"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePaste}
            disabled={!clipboard}
            title="Einfügen (Ctrl+V)"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setHistoryOpen(true)}
            title="Versionshistorie"
          >
            <History className="h-4 w-4 mr-2" />
            Versionen
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSave}
            id="save-button"
            className={highlightElement === "save-button" ? "ring-2 ring-primary ring-offset-2" : ""}
          >
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          <Button
            variant="outline"
            onClick={() => setTestModeOpen(true)}
            title="Test-Modus öffnen"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test-Modus
          </Button>
          <Button
            className={`bg-gradient-to-r from-primary to-purple-500 ${highlightElement === "test-button" ? "ring-2 ring-primary ring-offset-2" : ""}`}
            id="test-button"
            onClick={async () => {
              if (reactFlowNodes.length === 0) {
                toast({
                  title: "Keine Steps",
                  description: "Bitte fügen Sie mindestens einen Trigger hinzu.",
                  variant: "destructive",
                });
                return;
              }
              setIsExecuting(true);
              handleSave();
              updateWorkflow(workflow.id, { status: "running" });
              
              // Führe Workflow mit Integration Services aus
              await executeWorkflow(
                workflow.id,
                getIntegrationService,
                (name: string) => getIntegration(name)
              );
              
              setIsExecuting(false);
              toast({
                title: "Workflow ausgeführt",
                description: "Der Workflow wurde erfolgreich getestet.",
              });
            }}
            disabled={isExecuting}
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? "Wird ausgeführt..." : "Testen"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Apps */}
        <div className="w-72 border-r bg-muted/30 overflow-y-auto p-4 space-y-6 relative">
          {highlightElement === "trigger-sidebar" && (
            <div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none z-10 animate-pulse" />
          )}
          <div id="trigger-sidebar-section">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Trigger
            </h3>
            <div className="space-y-2">
              {AVAILABLE_APPS.triggers.map((app) => (
                <div key={app.id} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setAddNodeCategory("trigger");
                      setAddNodeOpen(true);
                      // Hier könnte man eine Sub-Selection öffnen
                    }}
                  >
                    <IntegrationIcon name={app.name} className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{app.name}</span>
                  </Button>
                  <div className="pl-8 space-y-0.5">
                    {app.triggers.map((trigger) => (
                      <Button
                        key={trigger}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-1.5 text-xs cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => onDragStart(e, app.id, trigger, "trigger")}
                        onClick={() => handleAddNode(app.id, trigger, "trigger")}
                      >
                        {trigger}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {highlightElement === "action-sidebar" && (
            <div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none z-10 animate-pulse" />
          )}
          <div id="action-sidebar-section">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Actions
            </h3>
            <div className="space-y-2">
              {AVAILABLE_APPS.actions.map((app) => (
                <div key={app.id} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                  >
                    <IntegrationIcon name={app.name} className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{app.name}</span>
                  </Button>
                  <div className="pl-8 space-y-0.5">
                    {app.actions.map((action) => (
                      <Button
                        key={action}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-1.5 text-xs cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => onDragStart(e, app.id, action, "action")}
                        onClick={() => handleAddNode(app.id, action, "action")}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div 
          className="flex-1 relative"
          ref={reactFlowWrapperRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-muted/20 to-background"
            connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6366f1", strokeWidth: 2 },
            }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            panOnDrag={[0, 1, 2]}
            panOnScroll={false}
            zoomOnScroll={true}
            zoomOnPinch={true}
            minZoom={0.1}
            maxZoom={4}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Shift"]}
            preventScrolling={false}
          >
            <Controls />
            <Background gap={12} size={1} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === "trigger") return "#a855f7";
                if (node.type === "condition") return "#3b82f6";
                return "#6366f1";
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
              pannable
              zoomable
            />
          </ReactFlow>
          
          {/* Drag Ghost Indicator */}
          {dragGhost && reactFlowInstance && (
            <div
              className="absolute pointer-events-none z-50 px-3 py-1.5 bg-primary/90 text-primary-foreground rounded-lg shadow-lg text-sm font-medium backdrop-blur-sm"
              style={{
                left: dragGhost.x - 60,
                top: dragGhost.y - 20,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dragGhost.label}
            </div>
          )}

          {reactFlowNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-card/80 backdrop-blur-sm p-8 rounded-lg border">
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Workflow erstellen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wählen Sie einen Trigger aus der linken Sidebar
                </p>
                <p className="text-xs text-muted-foreground">
                  Ziehen Sie Nodes, um sie zu verschieben. Verbinden Sie sie, um den Flow zu erstellen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node Config Dialog */}
      <Dialog open={nodeConfigOpen && selectedNode !== null} onOpenChange={setNodeConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNode?.data.label} konfigurieren</DialogTitle>
            <DialogDescription>
              Konfigurieren Sie die Einstellungen für diesen Step.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {selectedNode?.type === "trigger" && (
              <>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input value={selectedNode.data.config?.service || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Select
                    defaultValue={selectedNode.data.config?.account || ""}
                    onValueChange={(value) =>
                      handleNodeConfigUpdate({ account: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Account auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">Mein Account</SelectItem>
                      <SelectItem value="account2">Team Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedNode.data.config?.type === "gmail" && (
                  <>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        placeholder="z.B. INBOX"
                        defaultValue={selectedNode.data.config?.label || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ label: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Von</Label>
                      <Input
                        placeholder="optional: Filter nach Absender"
                        defaultValue={selectedNode.data.config?.from || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ from: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {selectedNode?.type === "action" && (
              <>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input value={selectedNode.data.config?.service || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Select
                    defaultValue={selectedNode.data.config?.account || ""}
                    onValueChange={(value) =>
                      handleNodeConfigUpdate({ account: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Account auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account1">Mein Account</SelectItem>
                      <SelectItem value="account2">Team Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedNode.data.config?.type === "slack" && (
                  <>
                    <div className="space-y-2">
                      <Label>Channel</Label>
                      <Input
                        placeholder="#general"
                        defaultValue={selectedNode.data.config?.channel || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ channel: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message Text</Label>
                      <Input
                        placeholder="Nachricht..."
                        defaultValue={selectedNode.data.config?.message || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ message: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.config?.type === "google_sheets" && (
                  <>
                    <div className="space-y-2">
                      <Label>Spreadsheet</Label>
                      <Input
                        placeholder="Name oder URL der Tabelle"
                        defaultValue={selectedNode.data.config?.spreadsheet || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ spreadsheet: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Worksheet</Label>
                      <Input
                        placeholder="Sheet1"
                        defaultValue={selectedNode.data.config?.worksheet || ""}
                        onChange={(e) =>
                          handleNodeConfigUpdate({ worksheet: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {selectedNode?.type === "condition" && (
              <>
                <div className="space-y-2">
                  <Label>Bedingung</Label>
                  <Select
                    defaultValue={selectedNode.data.config?.condition || ""}
                    onValueChange={(value) =>
                      handleNodeConfigUpdate({ condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bedingung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Enthält</SelectItem>
                      <SelectItem value="equals">Gleich</SelectItem>
                      <SelectItem value="greater">Größer als</SelectItem>
                      <SelectItem value="less">Kleiner als</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Feld</Label>
                  <Input
                    placeholder="Zu prüfendes Feld"
                    defaultValue={selectedNode.data.config?.field || ""}
                    onChange={(e) =>
                      handleNodeConfigUpdate({ field: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wert</Label>
                  <Input
                    placeholder="Vergleichswert"
                    defaultValue={selectedNode.data.config?.value || ""}
                    onChange={(e) =>
                      handleNodeConfigUpdate({ value: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedNode) {
                    handleDeleteNode(selectedNode.id);
                    setNodeConfigOpen(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Node löschen
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNodeConfigOpen(false)}>
              Schließen
            </Button>
            <Button
              onClick={() => {
                setNodeConfigOpen(false);
                handleSave();
              }}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Versionshistorie Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Versionshistorie</DialogTitle>
            <DialogDescription>
              Alle gespeicherten Versionen dieses Workflows. Sie können eine Version wiederherstellen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(() => {
              const history = getWorkflowHistory(workflow.id);
              const versions = [...history.versions].reverse(); // Neueste zuerst
              
              if (versions.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Noch keine Versionen gespeichert</p>
                    <p className="text-sm mt-2">Speichern Sie den Workflow, um eine Version zu erstellen.</p>
                  </div>
                );
              }
              
              return versions.map((version) => (
                <Card key={version.id} className={version.isCurrent ? "border-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">Version {version.version}</h4>
                          {version.isCurrent && (
                            <Badge variant="default" className="text-xs">Aktuell</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {version.description || "Keine Beschreibung"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{version.nodes.length} Nodes</span>
                          <span>{version.connections.length} Connections</span>
                          <span>{new Date(version.createdAt).toLocaleString("de-DE")}</span>
                        </div>
                      </div>
                      {!version.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const restored = restoreWorkflowVersion(workflow.id, version.version);
                            if (restored) {
                              updateWorkflow(workflow.id, {
                                nodes: restored.nodes,
                                connections: restored.connections,
                              });
                              
                              const flowNodes: Node[] = restored.nodes.map((node) => ({
                                id: node.id,
                                type: node.type === "filter" ? "condition" : node.type,
                                position: node.position,
                                data: {
                                  label: node.label,
                                  config: node.config,
                                  originalType: node.type,
                                },
                                selected: false,
                              }));
                              
                              const flowEdges: Edge[] = restored.connections.map((conn) => ({
                                id: conn.id,
                                source: conn.source,
                                target: conn.target,
                                type: "smoothstep",
                                animated: true,
                                style: { stroke: "#6366f1", strokeWidth: 2 },
                              }));
                              
                              setReactFlowNodes(flowNodes);
                              setReactFlowEdges(flowEdges);
                              
                              setHistoryOpen(false);
                              toast({
                                title: "Version wiederhergestellt",
                                description: `Version ${version.version} wurde wiederhergestellt.`,
                              });
                            }
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Wiederherstellen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test-Modus Dialog */}
      <Dialog open={testModeOpen} onOpenChange={setTestModeOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Test-Modus</DialogTitle>
            <DialogDescription>
              Testen Sie Ihren Workflow Schritt für Schritt mit Mock-Daten und sehen Sie die Ausführung in Echtzeit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <WorkflowTestPanel
              nodes={reactFlowNodes.map((node) => ({
                id: node.id,
                type: (node.data.originalType || node.type) as any,
                label: node.data.label,
                config: node.data.config || {},
                position: node.position,
              }))}
              connections={reactFlowEdges.map((edge) => ({
                source: edge.source,
                target: edge.target,
              }))}
              onExecute={async (mockData) => {
                setIsExecuting(true);
                handleSave();
                updateWorkflow(workflow.id, { status: "running" });
                
                await executeWorkflow(
                  workflow.id,
                  getIntegrationService,
                  (name: string) => getIntegration(name)
                );
                
                setIsExecuting(false);
                toast({
                  title: "Test abgeschlossen",
                  description: "Der Workflow wurde erfolgreich getestet.",
                });
              }}
              onStop={() => {
                setIsExecuting(false);
                updateWorkflow(workflow.id, { status: "paused" });
              }}
              isRunning={isExecuting}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestModeOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Card */}
      {showTutorial && (
        <WorkflowTutorialCard open={true} onClose={() => {}} />
      )}
    </div>
  );
}

export default function WorkflowEditorPage() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorCanvas />
    </ReactFlowProvider>
  );
}
