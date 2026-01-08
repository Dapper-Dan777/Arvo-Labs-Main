// Core Workflow Types
export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger: TriggerConfig;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriggerConfig {
  type: 'webhook' | 'schedule' | 'event';
  config: {
    url?: string; // for webhook
    cron?: string; // for schedule
    event?: string; // for event
  };
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'transform' | 'path';
  position: { x: number; y: number };
  data: NodeData;
}

export interface NodeData {
  label: string;
  integration: string; // 'stripe', 'email', 'slack', 'formatter', etc.
  action: string; // 'create_subscription', 'send_email', 'send_message', etc.
  config: Record<string, any>;
  mapping?: Record<string, string>; // {{trigger.email}} -> actual value
  stepNumber?: number;
  isConfigured?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string; // 'true' | 'false' for path nodes
  type?: 'default' | 'conditional';
  animated?: boolean;
  style?: Record<string, any>;
}

// Execution Types
export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'success' | 'error';
  trigger_data: any;
  execution_log: ExecutionStepLog[];
  error_message?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface ExecutionStepLog {
  node_id: string;
  step_name: string;
  status: 'success' | 'error' | 'skipped';
  input: any;
  output?: any;
  error?: string;
  duration_ms: number;
  timestamp: string;
}

// Integration Types
export interface IntegrationAdapter {
  name: string;
  execute(action: string, config: any, context: ExecutionContext): Promise<any>;
  validate(config: any): boolean;
}

export interface ExecutionContext {
  trigger: any;
  steps: Record<string, any>;
  user_id: string;
  execution_id: string;
}

// Stripe Price IDs (from your setup)
export const STRIPE_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'price_1Sn6JbBdCVA7GgILx570Db05',
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_1Sn66DBdCVA7GgILEEKyGAF4',
  enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || 'price_1Sn68wBdCVA7GgILeZbGdyO2',
  individual: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL || 'price_1Sn6BLBdCVA7GgILXLJGZm9R',
} as const;

// Onboarding Log Type (matches database schema)
export interface OnboardingLog {
  id: string;
  user_id?: string;
  email: string;
  plan: 'starter' | 'pro' | 'enterprise' | 'individual';
  status: 'success' | 'error' | 'partial';
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  hubspot_contact_id?: string;
  error_step?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

