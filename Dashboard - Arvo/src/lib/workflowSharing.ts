import { Workflow } from "@/contexts/WorkflowContext";

export interface SharedWorkflow {
  id: string;
  workflowId: number;
  shareToken: string;
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  allowCopy: boolean;
  viewCount: number;
}

const STORAGE_KEY = "shared_workflows";

export function shareWorkflow(workflow: Workflow, options: {
  isPublic?: boolean;
  allowCopy?: boolean;
  expiresInDays?: number;
} = {}): SharedWorkflow {
  const shareToken = generateShareToken();
  
  const shared: SharedWorkflow = {
    id: `${workflow.id}-${Date.now()}`,
    workflowId: workflow.id,
    shareToken,
    createdAt: new Date(),
    expiresAt: options.expiresInDays 
      ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : undefined,
    isPublic: options.isPublic ?? false,
    allowCopy: options.allowCopy ?? true,
    viewCount: 0,
  };
  
  // Speichere in localStorage
  const allShared = getAllSharedWorkflows();
  allShared[shareToken] = shared;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allShared));
  
  return shared;
}

export function getSharedWorkflow(shareToken: string): SharedWorkflow | null {
  const allShared = getAllSharedWorkflows();
  const shared = allShared[shareToken];
  
  if (!shared) return null;
  
  // Prüfe Ablaufdatum
  if (shared.expiresAt && new Date(shared.expiresAt) < new Date()) {
    delete allShared[shareToken];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allShared));
    return null;
  }
  
  // Erhöhe View-Count
  shared.viewCount++;
  allShared[shareToken] = shared;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allShared));
  
  return shared;
}

export function getAllSharedWorkflows(): Record<string, SharedWorkflow> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function deleteSharedWorkflow(shareToken: string): boolean {
  const allShared = getAllSharedWorkflows();
  if (!allShared[shareToken]) return false;
  
  delete allShared[shareToken];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allShared));
  return true;
}

export function getShareUrl(shareToken: string): string {
  return `${window.location.origin}/workflows/shared/${shareToken}`;
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function copyWorkflow(workflow: Workflow, newName?: string): Omit<Workflow, "id" | "createdAt"> {
  return {
    name: newName || `${workflow.name} (Kopie)`,
    status: "paused",
    progress: 0,
    lastRun: "Never",
    duration: "—",
    description: workflow.description,
    icon: workflow.icon,
    category: workflow.category,
    nodes: JSON.parse(JSON.stringify(workflow.nodes)), // Deep copy
    connections: JSON.parse(JSON.stringify(workflow.connections)), // Deep copy
  };
}






