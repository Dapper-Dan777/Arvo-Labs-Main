# Nächste Schritte nach Supabase-Setup

Du hast das Supabase-Setup abgeschlossen! Hier sind die nächsten Schritte:

## ✅ Was bereits erledigt ist

- [x] Supabase-Projekt erstellt
- [x] Umgebungsvariablen gesetzt
- [x] Datenbank-Schema erstellt
- [x] Auth-Einstellungen konfiguriert
- [x] Code auf Supabase umgestellt

## 🧪 1. Testen der Anwendung

### Lokal testen

```bash
# Starte den Development-Server
npm run dev
```

### Test-Checkliste

1. **Registrierung testen**
   - Gehe zu deiner App
   - Klicke auf "Registrieren"
   - Erstelle einen neuen Account
   - Prüfe in Supabase Dashboard:
     - **Authentication** → **Users**: Neuer User sollte erscheinen
     - **Table Editor** → **user_profiles**: Neues Profil sollte automatisch erstellt sein

2. **Login testen**
   - Melde dich mit deinem neuen Account an
   - Prüfe, ob du zum Dashboard weitergeleitet wirst

3. **Plan-Funktionalität testen**
   - Gehe zum Dashboard
   - Prüfe, ob der Standard-Plan "starter" angezeigt wird
   - Gehe zu **Table Editor** → **user_profiles** in Supabase
   - Ändere den `plan` Wert zu "pro" oder "enterprise"
   - Lade die Seite neu - der Plan sollte aktualisiert sein

## 🔧 2. Code-Anpassungen (bereits gemacht)

Ich habe bereits folgende Anpassungen vorgenommen:

- ✅ `useUserPlan` Hook liest jetzt Pläne aus der `user_profiles` Tabelle
- ✅ `supabase-queries.ts` verwendet jetzt `auth.uid()` statt Mock-IDs
- ✅ Neue `user-profile.ts` Datei für Profil-Verwaltung

## 📝 3. Plan-Verwaltung implementieren

### Option A: Manuell über Supabase Dashboard (für Tests)

1. Gehe zu **Table Editor** → **user_profiles**
2. Bearbeite den `plan` Wert für einen User

### Option B: Über eine Admin-Seite (empfohlen)

Erstelle eine Admin-Seite oder API-Route, um Pläne zu verwalten:

```typescript
// Beispiel: src/pages/admin/ManagePlans.tsx
import { updateUserPlan } from '@/lib/user-profile';

// In deiner Komponente:
await updateUserPlan(userId, 'pro', 'individual');
```

### Option C: Über Payment-Webhooks (für Production)

Wenn du einen Payment-Provider (z.B. Stripe) verwendest:
1. Erstelle eine Supabase Edge Function
2. Empfange Webhooks von deinem Payment-Provider
3. Aktualisiere den Plan in der Datenbank

## 🎨 4. UI-Verbesserungen

### Sign-In/Sign-Up Seiten erstellen

Aktuell öffnen sich Modals. Du kannst auch dedizierte Seiten erstellen:

- `/auth/sign-in` - Login-Seite
- `/auth/sign-up` - Registrierungs-Seite
- `/auth/reset-password` - Passwort zurücksetzen

### Beispiel-Struktur:

```
src/pages/auth/
  ├── SignIn.tsx
  ├── SignUp.tsx
  └── ResetPassword.tsx
```

## 🔐 5. Sicherheit prüfen

### Row Level Security (RLS)

Die RLS Policies sind bereits aktiviert. Teste sie:

1. Melde dich mit einem User an
2. Versuche, Daten eines anderen Users zu lesen
3. Es sollte nicht funktionieren

### Service Role Key

⚠️ **WICHTIG**: Der Service Role Key sollte NUR im Backend verwendet werden!

- ✅ Verwende ihn in Edge Functions
- ✅ Verwende ihn in API-Routes
- ❌ NIEMALS im Frontend-Code!

## 📊 6. Monitoring einrichten

### Supabase Dashboard

- **Logs**: Prüfe die Logs unter **Logs** → **Postgres Logs**
- **API Usage**: Überwache deine API-Nutzung unter **Settings** → **Usage**

### Error Tracking

Erwäge, Error-Tracking einzurichten (z.B. Sentry):

```typescript
// Beispiel: src/lib/error-tracking.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  // ...
});
```

## 🚀 7. Deployment

### Umgebungsvariablen in Production

Stelle sicher, dass deine Production-Umgebung die richtigen Variablen hat:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Redirect URLs aktualisieren

In Supabase Dashboard:
- **Authentication** → **URL Configuration**
- Füge deine Production-URL hinzu

## 🧹 8. Cleanup (Optional)

### Alte Clerk-Dateien entfernen

Falls noch vorhanden, kannst du diese Dateien löschen:

- `CLERK_SETUP_ANLEITUNG.md`
- `CLERK_SETUP_STATUS.md`
- `WEBHOOK_SETUP.md`
- `QUICK_START_WEBHOOK.md`
- `docs/clerk-redirects.md`

### Alte Dokumentation aktualisieren

- Aktualisiere `README.md` mit Supabase-Informationen
- Entferne Clerk-Referenzen

## 📚 9. Nützliche Ressourcen

- [Supabase Dokumentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🐛 10. Troubleshooting

### Problem: User kann sich nicht registrieren

**Lösung:**
- Prüfe die Email-Konfiguration in Supabase
- Prüfe die Redirect URLs
- Prüfe die Browser-Konsole auf Fehler

### Problem: Plan wird nicht angezeigt

**Lösung:**
- Prüfe, ob ein Profil in `user_profiles` existiert
- Prüfe die Browser-Konsole auf Fehler
- Prüfe die RLS Policies

### Problem: RLS blockiert Zugriff

**Lösung:**
- Prüfe, ob der User eingeloggt ist
- Prüfe die RLS Policies in Supabase
- Teste mit einem anderen User

## ✅ Checkliste für Production

- [ ] Alle Umgebungsvariablen gesetzt
- [ ] Redirect URLs für Production konfiguriert
- [ ] RLS Policies getestet
- [ ] Plan-Verwaltung implementiert
- [ ] Error-Tracking eingerichtet
- [ ] Monitoring konfiguriert
- [ ] Backup-Strategie geplant
- [ ] Performance getestet
- [ ] Security Review durchgeführt

## 🎉 Fertig!

Deine Anwendung sollte jetzt vollständig mit Supabase funktionieren. Bei Fragen oder Problemen, schaue in die Supabase-Dokumentation oder kontaktiere den Support.

