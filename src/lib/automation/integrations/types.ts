export interface IntegrationField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'json' | 'boolean' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: string[] | { label: string; value: string }[];
  description?: string;
  default?: any;
}

export interface IntegrationColor {
  from: string;
  to: string;
}

export interface BaseIntegration {
  id: string;
  app: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: string;
  color: IntegrationColor;
  fields?: IntegrationField[];
}

export interface Trigger extends BaseIntegration {
  type: 'trigger';
  fields?: string[]; // Simple field names for triggers
}

export interface Action extends BaseIntegration {
  type: 'action';
  fields: IntegrationField[]; // Full field definitions for actions
}

export type Integration = Trigger | Action;

export const CATEGORIES = {
  email: { label: 'Email', color: 'red' },
  communication: { label: 'Communication', color: 'purple' },
  crm: { label: 'CRM', color: 'orange' },
  payments: { label: 'Payments', color: 'indigo' },
  ecommerce: { label: 'E-Commerce', color: 'green' },
  calendar: { label: 'Calendar', color: 'blue' },
  storage: { label: 'Storage', color: 'yellow' },
  database: { label: 'Database', color: 'cyan' },
  webhooks: { label: 'Webhooks', color: 'yellow' },
  forms: { label: 'Forms', color: 'gray' },
  schedule: { label: 'Schedule', color: 'purple' },
  social: { label: 'Social Media', color: 'pink' },
  project_management: { label: 'Project Management', color: 'blue' },
  productivity: { label: 'Productivity', color: 'gray' },
  scheduling: { label: 'Scheduling', color: 'blue' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
