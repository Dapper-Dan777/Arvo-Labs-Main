-- Automation Tool Database Schema
-- Execute this in Supabase SQL Editor

-- 1. Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  nodes JSONB NOT NULL, -- React Flow nodes
  edges JSONB NOT NULL, -- React Flow edges
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workflow Executions Table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'error')),
  trigger_data JSONB,
  execution_log JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

-- 3. Integration Credentials Table
CREATE TABLE IF NOT EXISTS integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  integration TEXT NOT NULL, -- 'stripe', 'slack', 'email'
  credentials JSONB NOT NULL, -- encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration)
);

-- 4. Onboarding Logs Table (Customer Onboarding Use-Case)
CREATE TABLE IF NOT EXISTS onboarding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  email TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise', 'individual')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  hubspot_contact_id TEXT,
  error_step TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_logs_email ON onboarding_logs(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_logs_created_at ON onboarding_logs(created_at DESC);

-- RLS Policies (Row Level Security)
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_logs ENABLE ROW LEVEL SECURITY;

-- Workflows: Users can only see their own
DROP POLICY IF EXISTS "Users can view own workflows" ON workflows;
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can create own workflows" ON workflows;
CREATE POLICY "Users can create own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own workflows" ON workflows;
CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own workflows" ON workflows;
CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (auth.uid()::text = user_id);

-- Workflow Executions: Users can only see executions of their workflows
DROP POLICY IF EXISTS "Users can view own workflow executions" ON workflow_executions;
CREATE POLICY "Users can view own workflow executions" ON workflow_executions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflows 
      WHERE workflows.id = workflow_executions.workflow_id 
      AND workflows.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can create own workflow executions" ON workflow_executions;
CREATE POLICY "Users can create own workflow executions" ON workflow_executions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows 
      WHERE workflows.id = workflow_executions.workflow_id 
      AND workflows.user_id = auth.uid()::text
    )
  );

-- Integration Credentials: Users can only see their own
DROP POLICY IF EXISTS "Users can view own credentials" ON integration_credentials;
CREATE POLICY "Users can view own credentials" ON integration_credentials
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own credentials" ON integration_credentials;
CREATE POLICY "Users can manage own credentials" ON integration_credentials
  FOR ALL USING (auth.uid()::text = user_id);

-- Onboarding Logs: Users can only see their own logs
DROP POLICY IF EXISTS "Users can view own onboarding logs" ON onboarding_logs;
CREATE POLICY "Users can view own onboarding logs" ON onboarding_logs
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can create own onboarding logs" ON onboarding_logs;
CREATE POLICY "Users can create own onboarding logs" ON onboarding_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

