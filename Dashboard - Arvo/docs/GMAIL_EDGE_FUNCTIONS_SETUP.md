# Supabase Edge Functions Setup für Gmail OAuth

Diese Anleitung erklärt, wie Sie die Supabase Edge Functions für Gmail OAuth einrichten.

## 🚀 Schnellstart (Automatisiert)

### Option 1: Setup Script verwenden (Empfohlen)

**Windows (PowerShell):**
```powershell
.\scripts\setup-gmail-functions.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/setup-gmail-functions.sh
./scripts/setup-gmail-functions.sh
```

Das Script führt automatisch alle Schritte aus:
- ✅ Prüft Supabase CLI Installation
- ✅ Initialisiert Supabase (falls nötig)
- ✅ Erstellt Edge Functions (falls nicht vorhanden)
- ✅ Setzt Secrets mit den bereitgestellten Credentials
- ✅ Deployt Functions (optional mit `-Deploy` Flag)

**Für Production:**
```powershell
# Windows
.\scripts\setup-gmail-functions.ps1 -ProjectRef YOUR_PROJECT_REF -Deploy

# Linux/Mac
./scripts/setup-gmail-functions.sh --project-ref YOUR_PROJECT_REF --deploy
```

### Option 2: Manuelles Setup

Falls Sie die Schritte manuell ausführen möchten, folgen Sie den Anweisungen unten.

---

## Voraussetzungen

1. Supabase CLI installiert: `npm install -g supabase`
2. Supabase Projekt erstellt
3. Mit Supabase verbunden: `supabase login`

## Setup

### 1. Supabase CLI Initialisieren

```bash
# Im Projekt-Root
supabase init
```

### 2. Edge Functions erstellen

```bash
# Gmail OAuth Function
supabase functions new gmail-oauth

# Gmail API Function
supabase functions new gmail-api
```

**Hinweis**: Die Function-Dateien wurden bereits erstellt und befinden sich in:
- `supabase/functions/gmail-oauth/index.ts`
- `supabase/functions/gmail-api/index.ts`

### 3. Secrets setzen

**Lokales Development:**
```bash
# Setze Gmail OAuth Credentials als Secrets
supabase secrets set GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
supabase secrets set GMAIL_CLIENT_SECRET=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
```

**Production:**
```bash
supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_SECRET=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
```

**WICHTIG**: Diese Secrets sind nur in Supabase verfügbar, niemals im Frontend!

### 4. Functions deployen

**Lokales Testing:**
```bash
# Starte lokalen Supabase Stack (inkl. Functions)
supabase start
```

**Production Deployment:**
```bash
# Deploy Gmail OAuth Function
supabase functions deploy gmail-oauth --project-ref YOUR_PROJECT_REF

# Deploy Gmail API Function
supabase functions deploy gmail-api --project-ref YOUR_PROJECT_REF
```

### 5. Function URLs

Nach dem Deploy erhalten Sie URLs wie:
- `https://<project-ref>.supabase.co/functions/v1/gmail-oauth`
- `https://<project-ref>.supabase.co/functions/v1/gmail-api`

**Lokale URLs (Development):**
- `http://localhost:54321/functions/v1/gmail-oauth`
- `http://localhost:54321/functions/v1/gmail-api`

Diese werden automatisch von der App verwendet. Die App nutzt die Supabase Client Library, die die korrekten URLs basierend auf Ihrer `VITE_SUPABASE_URL` Umgebungsvariable verwendet.

## Lokales Testing

### 1. Lokale Functions starten

```bash
# Starte kompletten Supabase Stack (inkl. Functions)
supabase start

# Oder nur Functions (wenn Supabase bereits läuft)
supabase functions serve
```

### 2. Test mit curl

**Hinweis**: Sie benötigen einen gültigen Authorization Code von Google OAuth Flow.

```bash
# Hole Ihre Supabase Anon Key
supabase status

# Test Token Exchange
curl -X POST http://localhost:54321/functions/v1/gmail-oauth \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AUTHORIZATION_CODE",
    "redirect_uri": "http://localhost:5173/auth/callback"
  }'

# Test Token Refresh
curl -X POST http://localhost:54321/functions/v1/gmail-oauth \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "refresh",
    "refresh_token": "REFRESH_TOKEN"
  }'
```

### 3. Test Gmail API

```bash
# Test Email List
curl -X POST http://localhost:54321/functions/v1/gmail-api \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "list",
    "access_token": "ACCESS_TOKEN",
    "maxResults": 10
  }'
```

## Troubleshooting

### Function läuft nicht

**Problem**: Function startet nicht oder gibt Fehler zurück

**Lösung**:
```bash
# Prüfen Sie die Logs
supabase functions logs gmail-oauth
supabase functions logs gmail-api

# Prüfen Sie ob Secrets gesetzt sind
supabase secrets list

# Prüfen Sie Supabase Status
supabase status
```

### CORS Fehler

**Problem**: CORS-Fehler beim Aufruf der Functions

**Lösung**:
- Die Functions haben bereits CORS Headers konfiguriert
- Prüfen Sie ob die Origin korrekt ist
- Stellen Sie sicher, dass `VITE_SUPABASE_URL` korrekt gesetzt ist

### Token Exchange Fehler

**Problem**: "invalid_grant" oder "invalid_client"

**Lösung**:
- Prüfen Sie ob Client ID und Secret korrekt sind
- Prüfen Sie ob Redirect URI in Google Cloud Console übereinstimmt
- Stellen Sie sicher, dass der Authorization Code noch gültig ist (nur einmal verwendbar)

### "Unauthorized" Fehler

**Problem**: Function gibt "Unauthorized" zurück

**Lösung**:
- Stellen Sie sicher, dass der Authorization Header korrekt gesetzt ist
- Prüfen Sie ob der User authentifiziert ist
- Prüfen Sie ob `SUPABASE_ANON_KEY` in der Function verfügbar ist

### Secrets nicht verfügbar

**Problem**: Function kann Secrets nicht lesen

**Lösung**:
```bash
# Prüfen Sie ob Secrets gesetzt sind
supabase secrets list

# Setzen Sie Secrets erneut
supabase secrets set GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
supabase secrets set GMAIL_CLIENT_SECRET=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

# Für Production
supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_SECRET=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
```

## Production Deployment

### Schritt-für-Schritt

1. **Setzen Sie Secrets in Production:**
   ```bash
   supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
   supabase secrets set --project-ref YOUR_PROJECT_REF GMAIL_CLIENT_SECRET=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
   ```

2. **Deploy Functions:**
   ```bash
   supabase functions deploy gmail-oauth --project-ref YOUR_PROJECT_REF
   supabase functions deploy gmail-api --project-ref YOUR_PROJECT_REF
   ```

3. **Prüfen Sie die Function URLs:**
   - Gehen Sie zu [Supabase Dashboard](https://app.supabase.com)
   - Navigieren Sie zu Ihrem Projekt
   - Gehen Sie zu "Edge Functions"
   - Die URLs sollten angezeigt werden:
     - `https://<project-ref>.supabase.co/functions/v1/gmail-oauth`
     - `https://<project-ref>.supabase.co/functions/v1/gmail-api`

4. **Testen Sie die Functions:**
   ```bash
   # Test mit curl
   curl -X POST https://<project-ref>.supabase.co/functions/v1/gmail-oauth \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"code": "TEST_CODE", "redirect_uri": "https://yourdomain.com/auth/callback"}'
   ```

### Environment Variables für Production

Stellen Sie sicher, dass in Production folgende Umgebungsvariablen gesetzt sind:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=https://yourdomain.com/auth/callback
```

**WICHTIG**: 
- `VITE_GMAIL_REDIRECT_URI` muss in Google Cloud Console als "Authorized Redirect URI" eingetragen sein
- Das Client Secret wird NUR in Supabase Edge Functions verwendet, niemals im Frontend!

## ✅ Checkliste

Vor dem Go-Live:

- [ ] Supabase Database Schema erstellt (`docs/GMAIL_SETUP_SQL.sql`)
- [ ] Edge Functions deployed
- [ ] Secrets in Production gesetzt
- [ ] Function URLs getestet
- [ ] Redirect URI in Google Cloud Console konfiguriert
- [ ] Environment Variables in Production gesetzt
- [ ] OAuth Flow getestet
- [ ] Token Refresh getestet
- [ ] Gmail API Calls getestet

