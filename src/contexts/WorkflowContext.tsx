"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type WorkflowStatus = "running" | "paused" | "error";

export type NodeType = "trigger" | "action" | "condition" | "filter";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
}

export type WorkflowCategory = "marketing" | "invoicing" | "custom" | "all";

export interface Workflow {
  id: number;
  name: string;
  status: WorkflowStatus;
  progress: number;
  lastRun: string;
  duration: string;
  description?: string;
  icon?: string;
  category?: WorkflowCategory;
  createdAt: Date;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isTutorial?: boolean;
}

interface WorkflowContextType {
  workflows: Workflow[];
  addWorkflow: (workflow: Omit<Workflow, "id" | "createdAt">) => Workflow;
  updateWorkflow: (id: number, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: number) => void;
  toggleWorkflowStatus: (id: number) => void;
  executeWorkflow: (id: number, getIntegrationService?: (name: string) => any, getIntegration?: (name: string) => any) => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const initialWorkflows: Workflow[] = [
  {
    id: 1,
    name: "Marketing Automation",
    status: "running",
    progress: 78,
    lastRun: "2 min ago",
    duration: "1h 23m",
    category: "marketing",
    createdAt: new Date(),
    nodes: [
      { id: "n1", type: "trigger", label: "New Email", config: { service: "Gmail", event: "new_email" }, position: { x: 100, y: 100 } },
      { id: "n2", type: "action", label: "Send Slack Message", config: { channel: "#marketing", message: "New email received" }, position: { x: 400, y: 100 } },
    ],
    connections: [{ id: "c1", source: "n1", target: "n2" }],
  },
  {
    id: 2,
    name: "Invoice Processing",
    status: "running",
    progress: 45,
    lastRun: "15 min ago",
    duration: "45m",
    category: "invoicing",
    createdAt: new Date(),
    nodes: [
      { id: "n1", type: "trigger", label: "New Invoice", config: { service: "Stripe", event: "invoice.created" }, position: { x: 100, y: 100 } },
      { id: "n2", type: "action", label: "Save to Google Sheets", config: { spreadsheet: "Invoices", sheet: "Data" }, position: { x: 400, y: 100 } },
    ],
    connections: [{ id: "c1", source: "n1", target: "n2" }],
  },
  {
    id: 3,
    name: "Lead Scoring",
    status: "paused",
    progress: 0,
    lastRun: "1 hour ago",
    duration: "—",
    category: "marketing",
    createdAt: new Date(),
    nodes: [],
    connections: [],
  },
  {
    id: 4,
    name: "Email Campaigns",
    status: "running",
    progress: 92,
    lastRun: "5 min ago",
    duration: "2h 15m",
    category: "marketing",
    createdAt: new Date(),
    nodes: [],
    connections: [],
  },
  {
    id: 5,
    name: "Data Sync",
    status: "error",
    progress: 33,
    lastRun: "30 min ago",
    duration: "Failed",
    category: "custom",
    createdAt: new Date(),
    nodes: [],
    connections: [],
  },
];

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);

  const addWorkflow = (workflowData: Omit<Workflow, "id" | "createdAt">) => {
    const newId = Math.max(...workflows.map(w => w.id), 0) + 1;
    const newWorkflow: Workflow = {
      ...workflowData,
      id: newId,
      createdAt: new Date(),
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || [],
    };
    setWorkflows([...workflows, newWorkflow]);
    return newWorkflow;
  };

  const executeWorkflow = async (id: number, getIntegrationService?: (name: string) => any, getIntegration?: (name: string) => any) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;

    // Simuliere Workflow-Ausführung
    updateWorkflow(id, { progress: 0, status: "running" });
    
    const nodes = workflow.nodes;
    const connections = workflow.connections;
    
    if (nodes.length === 0) return;

    // Finde Start-Node (Trigger)
    const triggerNode = nodes.find(n => n.type === "trigger");
    if (!triggerNode) {
      updateWorkflow(id, { status: "error" });
      return;
    }

    // Führe Workflow Schritt-für-Schritt aus
    const executedNodes: string[] = [];
    let currentNodeId: string | null = triggerNode.id;
    let stepCount = 0;
    let triggerData: any = null;

    while (currentNodeId && stepCount < 100) {
      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (!currentNode) break;

      try {
        // Simuliere Verarbeitungszeit
        await new Promise(resolve => setTimeout(resolve, 800));
        executedNodes.push(currentNodeId);
        stepCount++;

        // Update Progress
        updateWorkflow(id, {
          progress: Math.round((executedNodes.length / nodes.length) * 100),
          lastRun: "Running...",
        });

        // Finde nächsten Node über Connections
        const nextConnection = connections.find(c => c.source === currentNodeId);
        if (nextConnection) {
          currentNodeId = nextConnection.target;
        } else {
          currentNodeId = null;
        }
      } catch (error) {
        console.error(`Error executing node ${currentNodeId}:`, error);
        updateWorkflow(id, { status: "error" });
        break;
      }
    }

    updateWorkflow(id, {
      progress: 100,
      lastRun: "Just now",
      duration: `${stepCount * 0.8}s`,
      status: "running",
    });
  };

  const updateWorkflow = (id: number, updates: Partial<Workflow>) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWorkflow = (id: number) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const toggleWorkflowStatus = (id: number) => {
    setWorkflows(workflows.map(w => {
      if (w.id === id) {
        const newStatus: WorkflowStatus = w.status === "running" ? "paused" : "running";
        return {
          ...w,
          status: newStatus,
          progress: newStatus === "paused" ? 0 : w.progress || 50,
          lastRun: newStatus === "paused" ? "Paused" : "Just now",
        };
      }
      return w;
    }));
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        addWorkflow,
        updateWorkflow,
        deleteWorkflow,
        toggleWorkflowStatus,
        executeWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflows() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflows must be used within a WorkflowProvider");
  }
  return context;
}

