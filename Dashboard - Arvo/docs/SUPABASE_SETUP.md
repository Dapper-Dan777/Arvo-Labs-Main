# Supabase Setup für Kunden-Datenbank

## 1. Supabase Projekt einrichten

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Kopiere die URL und den anon/public key aus den Projekt-Einstellungen
3. Erstelle eine `.env` Datei im Root-Verzeichnis (falls noch nicht vorhanden):

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. Datenbank Schema erstellen

Führe das folgende SQL-Script in der Supabase SQL Editor aus:

```sql
-- Erstelle die customers Tabelle
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_customers_owner_id ON public.customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email) WHERE email IS NOT NULL;

-- Aktiviere Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policy: Benutzer können nur ihre eigenen Kunden sehen
CREATE POLICY "Users can view own customers"
    ON public.customers
    FOR SELECT
    USING (auth.uid() = owner_id);

-- Policy: Benutzer können nur ihre eigenen Kunden erstellen
CREATE POLICY "Users can insert own customers"
    ON public.customers
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Benutzer können nur ihre eigenen Kunden aktualisieren
CREATE POLICY "Users can update own customers"
    ON public.customers
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Benutzer können nur ihre eigenen Kunden löschen
CREATE POLICY "Users can delete own customers"
    ON public.customers
    FOR DELETE
    USING (auth.uid() = owner_id);

-- Funktion: Automatisch updated_at aktualisieren
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatisch updated_at aktualisieren
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Erlaube E-Mail Eindeutigkeit pro Benutzer (nicht global)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_owner_email_unique 
--     ON public.customers(owner_id, email) WHERE email IS NOT NULL;
```

## 3. Supabase Auth Integration (Optional)

Falls du Supabase Auth verwenden möchtest (statt des aktuellen lokalen Auth-Systems):

1. Installiere @supabase/supabase-js und @supabase/auth-helpers-react
2. Passe den AuthContext an, um Supabase Auth zu verwenden
3. Oder nutze eine Hybrid-Lösung: Lokales Auth für UI, Supabase für Daten

## 4. Alternative: Lokaler Storage Fallback

Falls Supabase nicht konfiguriert ist, nutzt die Anwendung automatisch lokalen Storage als Fallback.
Die Customer-Service-Funktionen prüfen automatisch, ob Supabase verfügbar ist.

