# 📧 Supabase Email-Bestätigung deaktivieren

Falls nach der Registrierung der User nicht automatisch eingeloggt wird, liegt das wahrscheinlich daran, dass die Email-Bestätigung in Supabase aktiviert ist.

## 🔧 Lösung: Email-Bestätigung deaktivieren

### Schritt 1: Supabase Dashboard öffnen
1. Gehe zu [supabase.com](https://supabase.com)
2. Logge dich ein
3. Wähle dein Projekt aus

### Schritt 2: Email-Bestätigung deaktivieren
1. Gehe zu **Authentication** → **Settings** (oder **Providers**)
2. Suche nach **"Enable email confirmations"** oder **"Confirm email"**
3. **Deaktiviere** diese Option
4. Klicke **Save**

### Alternative: Email-Bestätigung aktiv lassen
Wenn du die Email-Bestätigung aktiv lassen möchtest:
- Nach der Registrierung wird der User zur Login-Seite weitergeleitet
- Der User muss erst seine E-Mail bestätigen
- Dann kann er sich anmelden

## ✅ Nach dem Deaktivieren

Nach dem Deaktivieren der Email-Bestätigung:
- User wird nach Registrierung **automatisch eingeloggt**
- Weiterleitung zum **Dashboard** funktioniert
- Keine E-Mail-Bestätigung erforderlich

## 🧪 Testen

1. Registriere einen neuen User
2. Du solltest **automatisch eingeloggt** sein
3. Weiterleitung zum **Dashboard** sollte funktionieren

