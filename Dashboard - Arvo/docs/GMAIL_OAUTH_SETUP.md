# Gmail OAuth 2.0 Integration Setup

Diese Dokumentation beschreibt die vollständige Gmail OAuth 2.0 Integration für Arvo Workflows.

## 📋 Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Voraussetzungen](#voraussetzungen)
- [Setup](#setup)
- [Architektur](#architektur)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Security](#security)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Übersicht

Die Gmail Integration ermöglicht es:
- E-Mails zu lesen (gmail.readonly)
- E-Mails zu senden (gmail.send)
- E-Mails zu modifizieren (gmail.modify)

### OAuth 2.0 Flow

1. **Authorization**: User wird zu Google OAuth Consent Screen weitergeleitet
2. **Callback**: Google leitet zurück zu `/auth/callback` mit Authorization Code
3. **Token Exchange**: Authorization Code wird gegen Access Token + Refresh Token getauscht
4. **Storage**: Tokens werden verschlüsselt in Supabase gespeichert
5. **API Calls**: Gmail API wird mit Access Token aufgerufen
6. **Token Refresh**: Automatisches Refresh bei Ablauf

---

## Voraussetzungen

### 1. Google Cloud Console Setup

1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein Projekt oder wählen Sie ein bestehendes
3. Aktivieren Sie die Gmail API
4. Erstellen Sie OAuth 2.0 Credentials:
   - **Client ID**: `633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com`
   - **Client Secret**: `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`
   - **Authorized JavaScript Origins**: `http://localhost:5173`
   - **Authorized Redirect URIs**: `http://localhost:5173/auth/callback`

### 2. Supabase Setup

1. Erstellen Sie die `user_integrations` Tabelle (siehe Schema unten)
2. Konfigurieren Sie Row Level Security (RLS)
3. Erstellen Sie Supabase Edge Functions für Token Management

---

## Setup

### 1. Environment Variables

Erstellen Sie eine `.env.local` Datei:

```env
VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
```

**WICHTIG**: Das Client Secret wird NUR in Supabase Edge Functions verwendet, niemals im Frontend!

### 2. Supabase Schema

Führen Sie dieses SQL in Supabase SQL Editor aus:

```sql
-- Tabelle für User Integrations
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration_type)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);

-- Row Level Security (RLS)
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users können nur ihre eigenen Integrations sehen
CREATE POLICY "Users can view own integrations"
  ON user_integrations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations erstellen
CREATE POLICY "Users can insert own integrations"
  ON user_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations aktualisieren
CREATE POLICY "Users can update own integrations"
  ON user_integrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Integrations löschen
CREATE POLICY "Users can delete own integrations"
  ON user_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Function für automatisches updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Supabase Edge Functions Setup

Erstellen Sie Supabase Edge Functions für sichere Token-Verwaltung:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Initialize (falls noch nicht geschehen)
supabase init

# Create Edge Function
supabase functions new gmail-oauth
supabase functions new gmail-api
```

### 4. Dependencies installieren

```bash
npm install googleapis
npm install @supabase/supabase-js
```

---

## Architektur

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       │ 1. Start OAuth Flow
       ▼
┌─────────────────────┐
│  Google OAuth       │
│  Consent Screen     │
└──────┬──────────────┘
       │
       │ 2. Redirect mit Code
       ▼
┌─────────────────────┐
│  /auth/callback      │
│  (Frontend Route)    │
└──────┬──────────────┘
       │
       │ 3. Exchange Code
       ▼
┌─────────────────────┐
│  Supabase Edge      │
│  Function:          │
│  gmail-oauth        │
└──────┬──────────────┘
       │
       │ 4. Store Tokens
       ▼
┌─────────────────────┐
│  Supabase Database  │
│  (Encrypted)        │
└─────────────────────┘
```

---

## API Endpoints

### Frontend Routes

- `GET /auth/callback` - OAuth Callback Handler

### Supabase Edge Functions

- `POST /functions/v1/gmail-oauth/callback` - Token Exchange
- `POST /functions/v1/gmail-oauth/refresh` - Token Refresh
- `GET /functions/v1/gmail-api/emails` - Fetch Emails
- `POST /functions/v1/gmail-api/send` - Send Email

---

## Frontend Components

### GmailConnectButton

Button zum Starten des OAuth Flows.

### GmailStatusDisplay

Zeigt Connection Status an.

### GmailIntegrationCard

Vollständige Integration Card mit Connect/Disconnect.

---

## Security

### Best Practices

1. **Client Secret**: Niemals im Frontend, nur in Edge Functions
2. **Token Encryption**: Tokens werden verschlüsselt in DB gespeichert
3. **CSRF Protection**: State Parameter für OAuth Flow
4. **RLS**: Row Level Security in Supabase
5. **HTTPS**: Immer in Production verwenden

### Token Management

- Access Tokens: Kurzlebig (1 Stunde)
- Refresh Tokens: Langlebig, sicher gespeichert
- Automatisches Refresh vor Ablauf

---

## Testing

### Lokales Testing

1. Starten Sie den Dev Server: `npm run dev`
2. Navigieren Sie zu Integrations Page
3. Klicken Sie auf "Connect Gmail"
4. Folgen Sie dem OAuth Flow
5. Prüfen Sie die Token-Speicherung in Supabase

### Edge Cases

- Expired Tokens
- Revoked Access
- Network Errors
- Invalid Grants

---

## Troubleshooting

### "Access blocked: This app's request is invalid"

- Prüfen Sie die Redirect URI in Google Cloud Console
- Stellen Sie sicher, dass die URI exakt übereinstimmt

### "Invalid grant"

- Refresh Token ist abgelaufen
- User muss sich erneut verbinden

### "Token expired"

- Automatisches Refresh sollte greifen
- Falls nicht, manuell reconnecten

---

## Nächste Schritte

- [ ] Webhook für Push Notifications
- [ ] Email Templates
- [ ] Batch Operations
- [ ] Sync Status Tracking

