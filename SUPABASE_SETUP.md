# Supabase Setup-Anleitung

Diese Anleitung führt dich durch die notwendigen Schritte, um Supabase für deine Anwendung zu konfigurieren.

## 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein Konto (falls noch nicht vorhanden)
2. Erstelle ein neues Projekt:
   - Klicke auf "New Project"
   - Wähle eine Organisation
   - Gib deinem Projekt einen Namen (z.B. "Arvo Labs")
   - Wähle eine Region (z.B. "West Europe")
   - Setze ein Datenbank-Passwort (⚠️ **WICHTIG**: Speichere es sicher!)
   - Warte, bis das Projekt erstellt ist (ca. 2 Minuten)

## 2. Umgebungsvariablen setzen

1. Gehe zu **Project Settings** → **API**
2. Kopiere die folgenden Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon/public key** (beginnt mit `eyJ...`)

3. Erstelle eine `.env` Datei im Root-Verzeichnis deines Projekts:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **WICHTIG**: Die `.env` Datei sollte bereits in `.gitignore` sein. Füge sie niemals zu Git hinzu!

## 3. Auth-Einstellungen konfigurieren

### 3.1 Redirect URLs

1. Gehe zu **Authentication** → **URL Configuration**
2. Füge folgende URLs hinzu:

**Site URL:**
```
https://arvo-labs.de
```
(oder `http://localhost:5173` für Development)

**Redirect URLs:**
```
https://arvo-labs.de/**
http://localhost:5173/**
http://localhost:5173/auth/callback
```

### 3.2 Email Templates (Optional)

1. Gehe zu **Authentication** → **Email Templates**
2. Passe die Templates nach Bedarf an (Standard-Templates funktionieren auch)

### 3.3 Auth Providers (Optional)

Standardmäßig ist Email/Password aktiviert. Du kannst weitere Provider aktivieren:
- **Authentication** → **Providers**
- Aktiviere z.B. Google, GitHub, etc.

## 4. Datenbank-Schema erstellen

1. Gehe zu **SQL Editor** in deinem Supabase Dashboard
2. Führe das folgende SQL-Script aus:

```sql
-- ============================================================================
-- SUPABASE DATABASE SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE (für zusätzliche User-Daten)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise', 'individual')),
  account_type TEXT DEFAULT 'individual' CHECK (account_type IN ('individual', 'team')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PDF', 'Excel', 'Word', 'PowerPoint')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('Fertig', 'In Bearbeitung', 'Entwurf', 'In Prüfung')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_date ON documents(date);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- ============================================================================
-- TIME_ENTRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  project TEXT NOT NULL,
  duration TEXT NOT NULL, -- Format: "4h 30m"
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Erfasst' CHECK (status IN ('Erfasst', 'Geprüft', 'Abgerechnet')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('document', 'workflow', 'ai', 'task')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unread BOOLEAN DEFAULT TRUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, unread) WHERE unread = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Documents: Users can only see their own documents
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Time Entries: Users can only see their own entries
CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries"
  ON time_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Automatisch User Profile erstellen
-- ============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, plan, account_type, full_name)
  VALUES (
    NEW.id,
    'starter', -- Standard-Plan
    'individual', -- Standard-Account-Type
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) -- Name aus Metadata oder Email
  );
  RETURN NEW;
END;
$$;

-- Entferne alten Trigger falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 5. Plan-Verwaltung implementieren

Die Pläne werden in der `user_profiles` Tabelle gespeichert. Du kannst sie auf verschiedene Weise aktualisieren:

### Option 1: Über Supabase Dashboard (für Tests)

1. Gehe zu **Table Editor** → **user_profiles**
2. Bearbeite den `plan` Wert für einen User

### Option 2: Über eine Admin-Funktion (empfohlen)

Erstelle eine Serverless-Funktion oder API-Route, die Pläne aktualisiert. Beispiel:

```typescript
// In deiner Backend-API oder Supabase Edge Function
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key (nur für Backend!)
);

async function updateUserPlan(userId: string, plan: string) {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({ plan })
    .eq('id', userId);
  
  if (error) throw error;
}
```

### Option 3: Über Supabase Functions (empfohlen für Production)

Erstelle eine Edge Function, die Webhooks von deinem Payment-Provider verarbeitet.

## 6. Code-Anpassungen

Du musst noch `src/lib/supabase-queries.ts` anpassen, um `auth.uid()` statt `getCurrentUserId()` zu verwenden:

```typescript
// In src/lib/supabase-queries.ts
import { supabase } from '@/Integrations/supabase/client';

// Ersetze getCurrentUserId() mit:
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
```

## 7. Testen

1. Starte deine Anwendung: `npm run dev`
2. Versuche dich zu registrieren
3. Prüfe in Supabase:
   - **Authentication** → **Users**: Neuer User sollte erscheinen
   - **Table Editor** → **user_profiles**: Neues Profil sollte automatisch erstellt sein

## 8. Wichtige Hinweise

### Service Role Key
- ⚠️ **NIEMALS** den Service Role Key im Frontend verwenden!
- Nur für Backend-Operationen oder Edge Functions verwenden
- Findest du unter **Project Settings** → **API** → **service_role key**

### Row Level Security (RLS)
- RLS ist aktiviert und schützt deine Daten
- Jeder User kann nur seine eigenen Daten sehen/bearbeiten
- Teste die Policies gründlich!

### Email-Konfiguration
- Für Production: Konfiguriere einen SMTP-Provider
- Gehe zu **Project Settings** → **Auth** → **SMTP Settings**
- Oder verwende Supabase's Email-Service (begrenzt auf 3 Emails/Stunde im Free Plan)

## 9. Nächste Schritte

- [ ] Supabase-Projekt erstellt
- [ ] Umgebungsvariablen gesetzt
- [ ] Redirect URLs konfiguriert
- [ ] Datenbank-Schema ausgeführt
- [ ] RLS Policies getestet
- [ ] Plan-Verwaltung implementiert
- [ ] Code-Anpassungen gemacht
- [ ] Registrierung getestet
- [ ] Login getestet

## Support

Bei Problemen:
- [Supabase Dokumentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

