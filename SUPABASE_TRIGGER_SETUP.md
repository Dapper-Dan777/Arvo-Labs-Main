# Supabase Trigger Setup - Automatische Profil-Erstellung

## Übersicht

Dieses Script erstellt automatisch ein User-Profil in der `user_profiles` Tabelle, wenn ein neuer User registriert wird.

## Installation

### Schritt 1: SQL Script ausführen

1. Öffne dein Supabase Dashboard
2. Gehe zu **SQL Editor**
3. Kopiere den Inhalt aus `supabase-trigger.sql`
4. Führe das Script aus

### Schritt 2: Testen

1. Registriere einen neuen User in deiner App
2. Prüfe in Supabase:
   - **Table Editor** → **user_profiles**
   - Ein neues Profil sollte automatisch erstellt sein mit:
     - `plan`: 'starter'
     - `account_type`: 'individual'
     - `full_name`: Aus den Registrierungsdaten oder Email

## Was passiert?

Wenn ein neuer User registriert wird:

1. **Trigger wird ausgelöst**: `on_auth_user_created` nach INSERT in `auth.users`
2. **Funktion wird ausgeführt**: `handle_new_user()`
3. **Profil wird erstellt**: Neuer Eintrag in `user_profiles` mit:
   - `id`: User-ID aus `auth.users`
   - `plan`: 'starter' (Standard)
   - `account_type`: 'individual' (Standard)
   - `full_name`: Aus `raw_user_meta_data` oder Email

## Anpassungen

### Plan ändern

Wenn du einen anderen Standard-Plan möchtest:

```sql
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
    'free', -- Oder 'pro', 'enterprise', 'individual'
    'individual',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;
```

### Account Type ändern

Wenn du einen anderen Standard-Account-Type möchtest:

```sql
-- Ändere 'individual' zu 'team' oder anderen Werten
INSERT INTO public.user_profiles (id, plan, account_type, full_name)
VALUES (
  NEW.id,
  'starter',
  'team', -- Oder 'individual'
  COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
);
```

## Fehlerbehebung

### Problem: Trigger wird nicht ausgelöst

**Lösung:**
1. Prüfe, ob die Funktion existiert:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

2. Prüfe, ob der Trigger existiert:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

3. Teste die Funktion manuell:
   ```sql
   -- Erstelle einen Test-User und prüfe, ob das Profil erstellt wird
   ```

### Problem: RLS blockiert INSERT

**Lösung:**
Die Funktion verwendet `SECURITY DEFINER`, was bedeutet, dass sie mit den Rechten des Funktionseigentümers läuft. Stelle sicher, dass:
- Die Funktion von einem Admin erstellt wurde
- Die RLS Policy für INSERT existiert (siehe SUPABASE_SETUP.md)

### Problem: Profil wird nicht erstellt

**Lösung:**
1. Prüfe die Supabase Logs: **Logs** → **Postgres Logs**
2. Prüfe, ob die Tabelle `user_profiles` existiert
3. Prüfe, ob die Spalten korrekt sind (id, plan, account_type, full_name)

## Manuelle Profil-Erstellung (Fallback)

Falls der Trigger nicht funktioniert, kannst du Profile manuell erstellen:

```sql
-- Für einen bestehenden User
INSERT INTO public.user_profiles (id, plan, account_type, full_name)
VALUES (
  'USER_ID_HIER', -- Ersetze mit der tatsächlichen User-ID
  'starter',
  'individual',
  'User Name'
);
```

## Wichtige Hinweise

⚠️ **SECURITY DEFINER**: Die Funktion läuft mit erhöhten Rechten. Stelle sicher, dass:
- Die Funktion nur von vertrauenswürdigen Quellen aufgerufen wird
- Die Funktion keine SQL-Injection-Anfälligkeiten hat
- Die Funktion regelmäßig überprüft wird

✅ **Best Practices**:
- Verwende `SET search_path = public` um Schema-Injection zu verhindern
- Verwende `COALESCE` für sichere Standardwerte
- Teste die Funktion nach Änderungen

## Nächste Schritte

Nach der Installation:
1. Teste die Registrierung
2. Prüfe, ob Profile automatisch erstellt werden
3. Implementiere Plan-Updates (siehe NEXT_STEPS.md)




