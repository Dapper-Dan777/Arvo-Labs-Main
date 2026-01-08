import { Workflow } from "@/contexts/WorkflowContext";

export interface WorkflowVersion {
  id: string;
  workflowId: number;
  version: number;
  name: string;
  nodes: Workflow["nodes"];
  connections: Workflow["connections"];
  createdAt: Date;
  createdBy?: string;
  description?: string;
  isCurrent?: boolean;
}

export interface WorkflowHistory {
  workflowId: number;
  versions: WorkflowVersion[];
  currentVersion: number;
}

// Speichere Versionshistorie in localStorage (später in Supabase)
const STORAGE_KEY = "workflow_versions";

export function saveWorkflowVersion(workflow: Workflow, description?: string): WorkflowVersion {
  const history = getWorkflowHistory(workflow.id);
  
  const newVersion: WorkflowVersion = {
    id: `${workflow.id}-v${history.currentVersion + 1}`,
    workflowId: workflow.id,
    version: history.currentVersion + 1,
    name: workflow.name,
    nodes: JSON.parse(JSON.stringify(workflow.nodes)), // Deep copy
    connections: JSON.parse(JSON.stringify(workflow.connections)), // Deep copy
    createdAt: new Date(),
    description,
    isCurrent: true,
  };
  
  // Markiere alle anderen Versionen als nicht aktuell
  history.versions.forEach(v => v.isCurrent = false);
  
  history.versions.push(newVersion);
  history.currentVersion = newVersion.version;
  
  // Speichere in localStorage
  const allHistories = getAllHistories();
  allHistories[workflow.id] = history;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
  
  return newVersion;
}

export function getWorkflowHistory(workflowId: number): WorkflowHistory {
  const allHistories = getAllHistories();
  
  if (!allHistories[workflowId]) {
    return {
      workflowId,
      versions: [],
      currentVersion: 0,
    };
  }
  
  return allHistories[workflowId];
}

export function getAllHistories(): Record<number, WorkflowHistory> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function restoreWorkflowVersion(workflowId: number, version: number): WorkflowVersion | null {
  const history = getWorkflowHistory(workflowId);
  const versionToRestore = history.versions.find(v => v.version === version);
  
  if (!versionToRestore) return null;
  
  // Erstelle neue Version basierend auf der wiederhergestellten Version
  const restoredVersion: WorkflowVersion = {
    ...versionToRestore,
    id: `${workflowId}-v${history.currentVersion + 1}`,
    version: history.currentVersion + 1,
    createdAt: new Date(),
    description: `Wiederhergestellt von Version ${version}`,
    isCurrent: true,
  };
  
  // Markiere alle anderen Versionen als nicht aktuell
  history.versions.forEach(v => v.isCurrent = false);
  
  history.versions.push(restoredVersion);
  history.currentVersion = restoredVersion.version;
  
  // Speichere in localStorage
  const allHistories = getAllHistories();
  allHistories[workflowId] = history;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
  
  return restoredVersion;
}

export function deleteWorkflowVersion(workflowId: number, version: number): boolean {
  const history = getWorkflowHistory(workflowId);
  const index = history.versions.findIndex(v => v.version === version);
  
  if (index === -1) return false;
  
  history.versions.splice(index, 1);
  
  // Speichere in localStorage
  const allHistories = getAllHistories();
  allHistories[workflowId] = history;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
  
  return true;
}

export function getWorkflowVersion(workflowId: number, version: number): WorkflowVersion | null {
  const history = getWorkflowHistory(workflowId);
  return history.versions.find(v => v.version === version) || null;
}






