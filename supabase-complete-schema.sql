-- ============================================================================
-- VOLLSTÄNDIGES SUPABASE SCHEMA FÜR STRIPE INTEGRATION
-- ============================================================================
-- 
-- Dieses Schema erstellt alle notwendigen Tabellen für die SaaS-Plattform
-- mit Stripe-Integration und Supabase-Backend.
--
-- Führe dieses Script im Supabase SQL Editor aus.
--
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE (User-Profile mit Stripe-Integration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise', 'individual')),
  account_type TEXT DEFAULT 'individual' CHECK (account_type IN ('individual', 'team')),
  stripe_customer_id TEXT,
  subscription_plan TEXT DEFAULT 'free',
  usage_limit INTEGER DEFAULT 1000,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für profiles
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON profiles(account_type);

-- ============================================================================
-- SUBSCRIPTIONS TABLE (Stripe Subscription Management)
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

-- Indexes für subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (lösche zuerst, falls vorhanden)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subscriptions Policies (lösche zuerst, falls vorhanden)
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions können nur über Webhook aktualisiert werden (Service Role Key)

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für profiles (lösche zuerst, falls vorhanden)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger für subscriptions (lösche zuerst, falls vorhanden)
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Automatisch stripe_customer_id in profiles aktualisieren
CREATE OR REPLACE FUNCTION sync_stripe_customer_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Aktualisiere profiles mit stripe_customer_id
  UPDATE profiles
  SET stripe_customer_id = NEW.stripe_customer_id
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Synchronisation (lösche zuerst, falls vorhanden)
DROP TRIGGER IF EXISTS sync_stripe_customer_to_profile ON subscriptions;
CREATE TRIGGER sync_stripe_customer_to_profile
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  WHEN (NEW.stripe_customer_id IS NOT NULL)
  EXECUTE FUNCTION sync_stripe_customer_id();

-- ============================================================================
-- FUNCTION: Automatische Profil-Erstellung bei User-Registrierung
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, plan, account_type, full_name)
  VALUES (
    NEW.id,
    'starter',
    'individual',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Profil-Erstellung (lösche zuerst, falls vorhanden)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- WICHTIG: 
-- - Die subscriptions Tabelle wird NUR über den Stripe Webhook aktualisiert
-- - Normale Users können keine Subscriptions direkt erstellen
-- - Der Service Role Key wird im Webhook verwendet, um die Daten zu schreiben
-- - Profiles werden automatisch bei User-Registrierung erstellt
--
-- ============================================================================

