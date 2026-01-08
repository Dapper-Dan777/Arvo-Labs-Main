# Auth Migration Guide: Lokales Auth → Supabase Auth

## Übersicht

Dieser Guide erklärt, wie du dein lokales Auth-System zu Supabase Auth migrierst.

## Schritt 1: Supabase Setup

1. **Supabase Projekt erstellen** (falls noch nicht geschehen)
   - Gehe zu [supabase.com](https://supabase.com)
   - Erstelle ein neues Projekt
   - Kopiere URL und Anon Key

2. **Umgebungsvariablen setzen**
   ```env
   VITE_SUPABASE_URL=https://dein-projekt.supabase.co
   VITE_SUPABASE_ANON_KEY=dein-anon-key
   ```

3. **SQL Migration ausführen**
   - Öffne Supabase SQL Editor
   - Führe das Script aus `docs/SUPABASE_AUTH_MIGRATION.md` aus
   - Dies erstellt die `user_profiles` Tabelle und RLS Policies

## Schritt 2: AuthContext Migration

Du hast zwei Optionen:

### Option A: Vollständige Migration (Empfohlen)

1. **Backup erstellen**
   ```bash
   cp src/contexts/AuthContext.tsx src/contexts/AuthContext.local.backup.tsx
   ```

2. **Supabase Version aktivieren**
   ```bash
   cp src/contexts/AuthContext.supabase.ts src/contexts/AuthContext.tsx
   ```

3. **Testen**
   - Starte die App: `npm run dev`
   - Teste Login/Register
   - Prüfe ob User korrekt geladen werden

### Option B: Hybrid-Lösung (Schrittweise Migration)

Die Hybrid-Lösung nutzt automatisch Supabase Auth, wenn konfiguriert, sonst lokales Auth.

**Aktueller Status**: Die App nutzt bereits lokales Auth. Um Supabase Auth zu aktivieren:

1. Setze die Umgebungsvariablen (siehe Schritt 1)
2. Führe die SQL Migration aus
3. Die App wird automatisch Supabase Auth verwenden

## Schritt 3: Bestehende User migrieren (Optional)

Falls du bestehende lokale User zu Supabase migrieren möchtest:

1. **Exportiere lokale User-Daten**
   - Öffne Browser DevTools → Application → Local Storage
   - Kopiere die verschlüsselten User-Daten

2. **Erstelle User in Supabase Auth**
   - Via Supabase Dashboard: Authentication → Users → Add User
   - Oder via API/Script

3. **Importiere Profile-Daten**
   ```sql
   INSERT INTO public.user_profiles (id, username, name, email, is_admin, email_verified)
   VALUES ('USER_ID', 'username', 'Name', 'email@example.com', false, true);
   ```

## Schritt 4: Admin User einrichten

1. **Erstelle Admin-User in Supabase Auth**
   - Via Dashboard oder API

2. **Setze Admin-Flag**
   ```sql
   UPDATE public.user_profiles
   SET is_admin = true
   WHERE id = 'ADMIN_USER_ID';
   ```

## Schritt 5: Testing

1. **Teste Login**
   - Registriere einen neuen User
   - Logge dich ein
   - Prüfe ob Session persistiert

2. **Teste RLS**
   - Erstelle Kunden mit verschiedenen Usern
   - Prüfe ob User nur ihre eigenen Kunden sehen

3. **Teste 2FA** (falls verwendet)
   - Aktiviere 2FA für einen User
   - Teste Login mit 2FA-Code

## Wichtige Unterschiede

### Lokales Auth
- User werden in `localStorage` gespeichert (verschlüsselt)
- Passwörter werden lokal gehasht
- Keine serverseitige Validierung

### Supabase Auth
- User werden in Supabase Auth gespeichert
- Passwörter werden serverseitig gehasht
- E-Mail-Verifizierung über Supabase
- Session Management über Supabase
- RLS Policies greifen automatisch

## Troubleshooting

### Problem: "Supabase ist nicht konfiguriert"
- Prüfe `.env` Datei
- Prüfe ob `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` gesetzt sind
- Starte Dev-Server neu nach Änderungen

### Problem: "User Profile nicht gefunden"
- Prüfe ob SQL Migration ausgeführt wurde
- Prüfe ob Trigger `on_auth_user_created` existiert
- Erstelle Profil manuell falls nötig

### Problem: RLS Policies funktionieren nicht
- Prüfe ob RLS aktiviert ist: `ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`
- Prüfe ob Policies existieren
- Prüfe ob User eingeloggt ist (`auth.uid()` muss gesetzt sein)

## Rollback

Falls du zurück zu lokalem Auth möchtest:

1. Entferne/kommentiere Umgebungsvariablen
2. Nutze `AuthContext.local.backup.tsx` (falls erstellt)
3. Oder nutze die Hybrid-Version, die automatisch zu lokalem Auth wechselt

## Nächste Schritte

Nach erfolgreicher Migration:

1. ✅ User können sich mit Supabase Auth anmelden
2. ✅ RLS Policies schützen Daten automatisch
3. ✅ E-Mail-Verifizierung funktioniert über Supabase
4. ✅ Session Management ist serverseitig
5. ✅ Kunden-Datenbank nutzt automatisch `auth.uid()` für `owner_id`







