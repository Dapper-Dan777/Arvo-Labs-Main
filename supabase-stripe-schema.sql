-- ============================================================================
-- STRIPE INTEGRATION - DATENBANK SCHEMA
-- ============================================================================
-- 
-- Dieses Schema erweitert die user_profiles Tabelle um Stripe-Felder
-- und erstellt eine subscriptions Tabelle für Subscription-Management.
--
-- Führe dieses Script im Supabase SQL Editor aus.
--
-- ============================================================================

-- ============================================================================
-- USER_PROFILES ERWEITERN (Stripe Customer ID hinzufügen)
-- ============================================================================

-- Füge stripe_customer_id Spalte hinzu (falls nicht vorhanden)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Index für schnelle Suche
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id 
ON user_profiles(stripe_customer_id);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan_id TEXT, -- Stripe Price ID
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete', 'incomplete_expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users können nur ihre eigene Subscription sehen
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users können ihre Subscription nicht direkt ändern (nur über Webhook)
-- Keine INSERT/UPDATE/DELETE Policies für normale Users

-- ============================================================================
-- FUNCTION: Update updated_at timestamp
-- ============================================================================

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Automatisch stripe_customer_id in user_profiles aktualisieren
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_stripe_customer_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Aktualisiere user_profiles mit stripe_customer_id
  UPDATE user_profiles
  SET stripe_customer_id = NEW.stripe_customer_id
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER sync_stripe_customer_to_profile
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  WHEN (NEW.stripe_customer_id IS NOT NULL)
  EXECUTE FUNCTION sync_stripe_customer_id();

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- WICHTIG: Die subscriptions Tabelle wird NUR über den Stripe Webhook
-- aktualisiert. Normale Users können keine Subscriptions direkt erstellen.
--
-- Der Service Role Key wird im Webhook verwendet, um die Daten zu schreiben.
--
-- ============================================================================




