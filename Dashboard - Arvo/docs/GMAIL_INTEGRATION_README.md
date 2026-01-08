# Gmail OAuth 2.0 Integration - Vollständige Anleitung

Diese Dokumentation beschreibt die vollständige Gmail OAuth 2.0 Integration für Arvo Workflows.

## 📋 Übersicht

Die Integration ermöglicht:
- ✅ E-Mails lesen (gmail.readonly)
- ✅ E-Mails senden (gmail.send)
- ✅ E-Mails modifizieren (gmail.modify)
- ✅ Automatisches Token Refresh
- ✅ Sichere Token-Speicherung in Supabase
- ✅ CSRF-Schutz
- ✅ Row Level Security (RLS)

## 🚀 Quick Start

### 1. Environment Variables

Erstellen Sie `.env.local`:

```env
VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 2. Supabase Setup

1. Führen Sie `docs/GMAIL_SETUP_SQL.sql` im Supabase SQL Editor aus
2. Folgen Sie `docs/GMAIL_EDGE_FUNCTIONS_SETUP.md` für Edge Functions

### 3. Dependencies

```bash
npm install
```

### 4. Start

```bash
npm run dev
```

## 📁 Dateistruktur

```
src/
├── lib/gmail/
│   ├── oauth.ts          # OAuth Flow Utilities
│   └── api.ts            # Gmail API Helpers
├── pages/
│   └── AuthCallbackPage.tsx  # OAuth Callback Handler
├── components/integrations/
│   └── GmailIntegrationCard.tsx  # UI Component
└── services/integrations/
    └── gmailService.ts   # Workflow Integration Service

supabase/functions/
├── gmail-oauth/          # Token Exchange & Refresh
└── gmail-api/            # Gmail API Proxy

docs/
├── GMAIL_OAUTH_SETUP.md
├── GMAIL_SETUP_SQL.sql
└── GMAIL_EDGE_FUNCTIONS_SETUP.md
```

## 🔐 Security

### Best Practices

1. **Client Secret**: Niemals im Frontend, nur in Edge Functions
2. **Token Encryption**: Tokens werden verschlüsselt in DB gespeichert
3. **CSRF Protection**: State Parameter für OAuth Flow
4. **RLS**: Row Level Security in Supabase
5. **HTTPS**: Immer in Production verwenden

### Token Management

- **Access Tokens**: Kurzlebig (1 Stunde)
- **Refresh Tokens**: Langlebig, sicher gespeichert
- **Automatisches Refresh**: 5 Minuten vor Ablauf

## 🔄 OAuth Flow

```
1. User klickt "Gmail verbinden"
   ↓
2. Frontend generiert State (CSRF-Schutz)
   ↓
3. Redirect zu Google OAuth Consent Screen
   ↓
4. User autorisiert App
   ↓
5. Google redirects zu /auth/callback mit Code
   ↓
6. Frontend tauscht Code gegen Tokens (via Edge Function)
   ↓
7. Tokens werden in Supabase gespeichert
   ↓
8. Integration ist verbunden
```

## 📡 API Usage

### E-Mails abrufen

```typescript
import { fetchEmails } from "@/lib/gmail/api";

const emails = await fetchEmails({
  maxResults: 10,
  q: "is:unread",
});
```

### E-Mail senden

```typescript
import { sendEmail } from "@/lib/gmail/api";

const result = await sendEmail({
  to: "recipient@example.com",
  subject: "Test",
  body: "Hello World",
  htmlBody: "<h1>Hello World</h1>",
});
```

### E-Mail als gelesen markieren

```typescript
import { markAsRead } from "@/lib/gmail/api";

await markAsRead(messageId);
```

## 🧪 Testing

### Lokales Testing

1. Starten Sie den Dev Server: `npm run dev`
2. Navigieren Sie zu `/integrations`
3. Klicken Sie auf "Gmail verbinden"
4. Folgen Sie dem OAuth Flow
5. Prüfen Sie die Token-Speicherung in Supabase

### Edge Cases

- ✅ Expired Tokens (automatisches Refresh)
- ✅ Revoked Access (User muss reconnecten)
- ✅ Network Errors (Error Handling)
- ✅ Invalid Grants (User-friendly Messages)

## 🐛 Troubleshooting

### "Access blocked: This app's request is invalid"

- Prüfen Sie die Redirect URI in Google Cloud Console
- Stellen Sie sicher, dass die URI exakt übereinstimmt

### "Invalid grant"

- Refresh Token ist abgelaufen
- User muss sich erneut verbinden

### "Token expired"

- Automatisches Refresh sollte greifen
- Falls nicht, manuell reconnecten

### Edge Function Fehler

- Prüfen Sie die Logs: `supabase functions logs gmail-oauth`
- Prüfen Sie ob Secrets gesetzt sind

## 📚 Weitere Ressourcen

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Flow](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🎯 Nächste Schritte

- [ ] Webhook für Push Notifications
- [ ] Email Templates
- [ ] Batch Operations
- [ ] Sync Status Tracking
- [ ] Email Search & Filtering
- [ ] Attachment Handling

## 📝 Changelog

### v1.0.0 (Initial Release)
- ✅ OAuth 2.0 Flow
- ✅ Token Management
- ✅ Gmail API Integration
- ✅ Frontend Components
- ✅ Security Best Practices

