-- Gmail OAuth Integration Database Schema
-- Führen Sie dieses SQL in Supabase SQL Editor aus

-- Tabelle für User Integrations
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration_type)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_user_integrations_expires ON user_integrations(token_expires_at);

-- Row Level Security (RLS)
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users können nur ihre eigenen Integrations sehen
CREATE POLICY "Users can view own integrations"
  ON user_integrations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations erstellen
CREATE POLICY "Users can insert own integrations"
  ON user_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations aktualisieren
CREATE POLICY "Users can update own integrations"
  ON user_integrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations löschen
CREATE POLICY "Users can delete own integrations"
  ON user_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Function für automatisches updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für automatisches updated_at
DROP TRIGGER IF EXISTS update_user_integrations_updated_at ON user_integrations;
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Function zum automatischen Cleanup abgelaufener Tokens (für zukünftige Verwendung)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  -- Entferne abgelaufene Tokens (optional, kann auch manuell gemacht werden)
  -- DELETE FROM user_integrations 
  -- WHERE token_expires_at < NOW() - INTERVAL '7 days';
END;
$$ language 'plpgsql';

