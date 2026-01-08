import { WorkflowNode, WorkflowConnection } from "@/contexts/WorkflowContext";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "marketing" | "invoicing" | "custom";
  icon?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  tags?: string[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "email-to-slack",
    name: "E-Mail zu Slack",
    description: "Sende eine Slack-Benachrichtigung, wenn eine neue E-Mail eintrifft",
    category: "marketing",
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        label: "New Email",
        config: { service: "Gmail", event: "new_email" },
        position: { x: 100, y: 100 },
      },
      {
        id: "action_1",
        type: "action",
        label: "Send Slack Message",
        config: { service: "Slack", channel: "#general", message: "Neue E-Mail erhalten" },
        position: { x: 400, y: 100 },
      },
    ],
    connections: [
      { id: "conn_1", source: "trigger_1", target: "action_1" },
    ],
    tags: ["email", "slack", "notifications"],
  },
  {
    id: "invoice-processing",
    name: "Rechnungsverarbeitung",
    description: "Automatische Verarbeitung von Rechnungen mit Google Sheets",
    category: "invoicing",
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        label: "New Invoice",
        config: { service: "Stripe", event: "invoice.created" },
        position: { x: 100, y: 100 },
      },
      {
        id: "action_1",
        type: "action",
        label: "Save to Google Sheets",
        config: { service: "Google Sheets", spreadsheet: "Invoices", sheet: "Data" },
        position: { x: 400, y: 100 },
      },
      {
        id: "action_2",
        type: "action",
        label: "Send Email Notification",
        config: { service: "Gmail", to: "finance@example.com", subject: "Neue Rechnung" },
        position: { x: 400, y: 250 },
      },
    ],
    connections: [
      { id: "conn_1", source: "trigger_1", target: "action_1" },
      { id: "conn_2", source: "trigger_1", target: "action_2" },
    ],
    tags: ["invoice", "sheets", "email"],
  },
  {
    id: "lead-scoring",
    name: "Lead-Scoring",
    description: "Automatisches Scoring von Leads basierend auf Aktivitäten",
    category: "marketing",
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        label: "New Contact",
        config: { service: "HubSpot CRM", event: "contact.created" },
        position: { x: 100, y: 100 },
      },
      {
        id: "condition_1",
        type: "condition",
        label: "Check Activity",
        config: { condition: "activity_count > 5" },
        position: { x: 400, y: 100 },
      },
      {
        id: "action_1",
        type: "action",
        label: "Update Lead Score",
        config: { service: "HubSpot CRM", action: "update_score", value: 100 },
        position: { x: 700, y: 50 },
      },
      {
        id: "action_2",
        type: "action",
        label: "Send to Sales",
        config: { service: "Slack", channel: "#sales", message: "Neuer qualifizierter Lead" },
        position: { x: 700, y: 150 },
      },
    ],
    connections: [
      { id: "conn_1", source: "trigger_1", target: "condition_1" },
      { id: "conn_2", source: "condition_1", target: "action_1" },
      { id: "conn_3", source: "condition_1", target: "action_2" },
    ],
    tags: ["lead", "scoring", "crm"],
  },
  {
    id: "social-media-posting",
    name: "Social Media Posting",
    description: "Automatisches Posten auf mehreren Social-Media-Plattformen",
    category: "marketing",
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        label: "Schedule",
        config: { service: "Schedule", event: "every_day", time: "09:00" },
        position: { x: 100, y: 100 },
      },
      {
        id: "action_1",
        type: "action",
        label: "Post to Twitter",
        config: { service: "Twitter", message: "{{content}}" },
        position: { x: 400, y: 50 },
      },
      {
        id: "action_2",
        type: "action",
        label: "Post to LinkedIn",
        config: { service: "LinkedIn", message: "{{content}}" },
        position: { x: 400, y: 150 },
      },
      {
        id: "action_3",
        type: "action",
        label: "Post to Facebook",
        config: { service: "Facebook", message: "{{content}}" },
        position: { x: 400, y: 250 },
      },
    ],
    connections: [
      { id: "conn_1", source: "trigger_1", target: "action_1" },
      { id: "conn_2", source: "trigger_1", target: "action_2" },
      { id: "conn_3", source: "trigger_1", target: "action_3" },
    ],
    tags: ["social", "posting", "automation"],
  },
  {
    id: "data-sync",
    name: "Daten-Synchronisation",
    description: "Synchronisiere Daten zwischen verschiedenen Systemen",
    category: "custom",
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        label: "New Row",
        config: { service: "Google Sheets", event: "row.created" },
        position: { x: 100, y: 100 },
      },
      {
        id: "action_1",
        type: "action",
        label: "Create in Airtable",
        config: { service: "Airtable", base: "Data", table: "Records" },
        position: { x: 400, y: 100 },
      },
      {
        id: "action_2",
        type: "action",
        label: "Update in Notion",
        config: { service: "Notion", database: "Sync", page: "Data" },
        position: { x: 400, y: 250 },
      },
    ],
    connections: [
      { id: "conn_1", source: "trigger_1", target: "action_1" },
      { id: "conn_2", source: "trigger_1", target: "action_2" },
    ],
    tags: ["sync", "data", "integration"],
  },
];

export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  if (category === "all") return workflowTemplates;
  return workflowTemplates.filter(t => t.category === category);
}

export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return workflowTemplates.find(t => t.id === id);
}






