# Quick Start: Webhook Setup

## 🚀 Schnellstart (5 Minuten)

### Schritt 1: Dependencies installieren

```bash
npm install svix @clerk/nextjs
```

### Schritt 2: Webhook in Clerk registrieren

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com) → **"Developers"** → **"Webhooks"**
2. Klicke auf **"+ Add Endpoint"**
3. **Für Production (Vercel):**
   - URL: `https://deine-domain.vercel.app/api/clerk/webhook`
4. **Für lokale Entwicklung:**
   - Starte ngrok: `ngrok http 8080`
   - URL: `https://abc123.ngrok.io/api/clerk/webhook` (deine ngrok-URL)
5. Wähle Events:
   - ✅ `user.created`
   - ✅ `checkout.session.completed`
6. Klicke **"Create"**
7. **Kopiere den Webhook Secret** (`whsec_...`)

### Schritt 3: Environment Variable setzen

**Vercel:**
- Settings → Environment Variables → `CLERK_WEBHOOK_SECRET` = `whsec_...`

**Lokal:**
- Erstelle `.env` Datei:
  ```env
  CLERK_WEBHOOK_SECRET=whsec_...
  ```

### Schritt 4: Deployen (Production)

```bash
git add api/clerk/webhook.ts
git commit -m "Add Clerk webhook handler"
git push
```

Vercel deployt automatisch die Serverless Function.

### Schritt 5: Testen

1. Registriere einen neuen User
2. Prüfe im Clerk Dashboard → Users → Metadata
3. ✅ `publicMetadata.plan` sollte `"starter"` sein

---

## 📚 Detaillierte Anleitung

Siehe `WEBHOOK_SETUP.md` für:
- Lokale Entwicklung mit Node.js Server
- Troubleshooting
- Erweiterte Konfiguration

---

## ⚠️ Wichtig

- Die Plan IDs in `api/clerk/webhook.ts` müssen mit deinen Clerk Plan IDs übereinstimmen
- Der Webhook Secret muss sicher aufbewahrt werden (nicht in Git committen)
- Für lokale Tests brauchst du ngrok oder einen ähnlichen Service

