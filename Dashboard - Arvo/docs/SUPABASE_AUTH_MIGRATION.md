# Supabase Auth Migration - SQL Schema

## 1. User Profile Tabelle erstellen

Diese Tabelle erweitert die `auth.users` Tabelle von Supabase mit zusätzlichen Feldern:

```sql
-- Erstelle user_profiles Tabelle
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    avatar TEXT,
    is_admin BOOLEAN DEFAULT false NOT NULL,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT false NOT NULL,
    two_factor_secret TEXT,
    two_factor_backup_codes TEXT[], -- Array von Backup-Codes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email) WHERE email IS NOT NULL;

-- Aktiviere Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Benutzer können ihr eigenes Profil sehen
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Benutzer können ihr eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Neues Profil wird automatisch beim Signup erstellt (via Trigger)
-- Admin kann alle Profile sehen (optional)
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Funktion: Automatisch updated_at aktualisieren
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatisch updated_at aktualisieren
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- Funktion: Automatisch Profil beim User-Signup erstellen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, name, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Erstelle Profil beim User-Signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

## 2. Admin User erstellen (Optional)

Falls du einen Admin-User in Supabase erstellen möchtest:

```sql
-- Erstelle Admin-User (nachdem User in Supabase Auth erstellt wurde)
-- Ersetze 'USER_ID_HIER' mit der tatsächlichen UUID des Users
UPDATE public.user_profiles
SET is_admin = true
WHERE id = 'USER_ID_HIER';
```

## 3. Migration bestehender lokaler User (Optional)

Falls du bestehende lokale User zu Supabase migrieren möchtest:

1. Exportiere lokale User-Daten
2. Erstelle User in Supabase Auth (via Supabase Dashboard oder API)
3. Importiere Profil-Daten in `user_profiles` Tabelle

## 4. Wichtige Hinweise

- Die `customers` Tabelle verwendet bereits `owner_id` mit `REFERENCES auth.users(id)`
- RLS Policies in `customers` funktionieren automatisch mit Supabase Auth
- Die `user_profiles` Tabelle erweitert `auth.users` mit zusätzlichen Feldern
- Der Trigger erstellt automatisch ein Profil beim Signup

