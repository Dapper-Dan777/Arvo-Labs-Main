# Webhook Setup-Anleitung für Arvo Labs Dashboard

Diese Anleitung beschreibt, wie du die Clerk Webhooks für automatische Plan-Zuweisung einrichtest.

## 🎯 Übersicht

Die Webhooks setzen automatisch `publicMetadata.plan` für User:
- **Neuer User** → `plan: 'starter'` (Default)
- **User kauft Plan** → `plan: 'pro'` / `'enterprise'` etc. (basierend auf gekauftem Plan)

---

## 📋 Option 1: Vercel Serverless Functions (Empfohlen für Production)

### Schritt 1: Datei erstellen

Die Datei `api/clerk/webhook.ts` wurde bereits erstellt. Diese wird automatisch als Vercel Serverless Function deployed.

### Schritt 2: Dependencies installieren

```bash
npm install svix @clerk/nextjs
```

**WICHTIG**: Falls du `@clerk/nextjs` nicht verwenden möchtest, kannst du stattdessen `@clerk/clerk-sdk-node` verwenden:

```bash
npm install svix @clerk/clerk-sdk-node
```

Dann in `api/clerk/webhook.ts` ändern:
```typescript
import { clerkClient } from '@clerk/clerk-sdk-node';
```

### Schritt 3: Environment Variables in Vercel setzen

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt aus
3. Gehe zu **"Settings"** → **"Environment Variables"**
4. Füge hinzu:
   - `CLERK_WEBHOOK_SECRET` = `whsec_...` (aus Clerk Dashboard, Schritt 4)

### Schritt 4: Deployen

```bash
git add api/clerk/webhook.ts
git commit -m "Add Clerk webhook handler"
git push
```

Vercel deployt automatisch die Serverless Function.

### Schritt 5: Webhook in Clerk registrieren

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com) → **"Developers"** → **"Webhooks"**
2. Klicke auf **"+ Add Endpoint"**
3. Trage deine Webhook-URL ein:
   - Production: `https://deine-domain.vercel.app/api/clerk/webhook`
4. Wähle folgende Events:
   - ✅ `user.created`
   - ✅ `checkout.session.completed`
   - ✅ `organization.created` (optional)
   - ✅ `organizationMembership.created` (optional)
5. Klicke auf **"Create"**
6. **Kopiere den Webhook Secret** (beginnt mit `whsec_`)
7. Füge ihn zu Vercel Environment Variables hinzu (Schritt 3)

---

## 📋 Option 2: Standalone Node.js Server (Für lokale Entwicklung)

### Schritt 1: Dependencies installieren

```bash
npm install express svix @clerk/clerk-sdk-node
```

### Schritt 2: Server starten

```bash
node api/clerk/webhook-nodejs.js
```

Der Server läuft auf `http://localhost:3001`

### Schritt 3: ngrok installieren und starten

```bash
# ngrok installieren (falls noch nicht installiert)
# macOS: brew install ngrok
# Oder von https://ngrok.com/download

# ngrok starten
ngrok http 3001
```

Du erhältst eine URL wie: `https://abc123.ngrok.io`

### Schritt 4: Environment Variables setzen

Erstelle eine `.env` Datei im Projekt-Root:

```env
CLERK_WEBHOOK_SECRET=whsec_... (aus Clerk Dashboard)
CLERK_SECRET_KEY=sk_test_... (aus Clerk Dashboard)
```

### Schritt 5: Webhook in Clerk registrieren

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com) → **"Developers"** → **"Webhooks"**
2. Klicke auf **"+ Add Endpoint"**
3. Trage deine ngrok-URL ein:
   - `https://abc123.ngrok.io/webhook`
4. Wähle folgende Events:
   - ✅ `user.created`
   - ✅ `checkout.session.completed`
   - ✅ `organization.created` (optional)
5. Klicke auf **"Create"**
6. **Kopiere den Webhook Secret** und füge ihn zu deiner `.env` hinzu

### Schritt 6: Server neu starten

```bash
# Stoppe den Server (Ctrl+C) und starte neu
node api/clerk/webhook-nodejs.js
```

---

## 🧪 Testing

### Test 1: Neuer User registriert sich

1. Registriere einen neuen User
2. Prüfe im Clerk Dashboard → **"Users"** → Wähle den User → **"Metadata"** Tab
3. ✅ `publicMetadata.plan` sollte `"starter"` sein

### Test 2: User kauft Plan

1. Führe einen Checkout-Flow durch (z.B. Pro Plan)
2. Prüfe im Clerk Dashboard → **"Users"** → Wähle den User → **"Metadata"** Tab
3. ✅ `publicMetadata.plan` sollte `"pro"` sein (oder der gekaufte Plan)

### Test 3: Webhook-Logs prüfen

1. Im Clerk Dashboard → **"Developers"** → **"Webhooks"**
2. Klicke auf deinen Webhook-Endpoint
3. Gehe zu **"Logs"** Tab
4. ✅ Du solltest die Webhook-Events sehen

---

## 🔧 Troubleshooting

### Problem: Webhook wird nicht aufgerufen

**Lösung:**
- ✅ Prüfe ob die Webhook-URL korrekt ist
- ✅ Prüfe ob ngrok läuft (für lokale Entwicklung)
- ✅ Prüfe die Webhook-Logs im Clerk Dashboard
- ✅ Prüfe ob der Webhook Secret korrekt gesetzt ist

### Problem: "Verification failed"

**Lösung:**
- ✅ Prüfe ob `CLERK_WEBHOOK_SECRET` korrekt gesetzt ist
- ✅ Prüfe ob der Secret aus dem Clerk Dashboard kopiert wurde (beginnt mit `whsec_`)
- ✅ Stelle sicher, dass keine zusätzlichen Leerzeichen im Secret sind

### Problem: "Error processing checkout"

**Lösung:**
- ✅ Prüfe ob die Plan IDs in `PLAN_MAPPING` mit deinen Clerk Plan IDs übereinstimmen
- ✅ Prüfe die Server-Logs für detaillierte Fehlermeldungen
- ✅ Prüfe ob `CLERK_SECRET_KEY` gesetzt ist (für Node.js Server)

### Problem: Metadata wird nicht gesetzt

**Lösung:**
- ✅ Prüfe ob der User existiert (für `user.created` Event)
- ✅ Prüfe ob `userId` und `planId` im Webhook-Payload vorhanden sind
- ✅ Prüfe die Server-Logs für Fehler
- ✅ Prüfe ob der Clerk Secret Key die richtigen Berechtigungen hat

---

## 📝 Wichtige Hinweise

1. **Plan IDs müssen übereinstimmen**: Die Plan IDs in `PLAN_MAPPING` müssen exakt mit den Plan IDs in deinem Clerk Dashboard übereinstimmen.

2. **Webhook Secret sicher aufbewahren**: Der `CLERK_WEBHOOK_SECRET` sollte niemals in Git committed werden. Verwende Environment Variables.

3. **Lokale Entwicklung**: Für lokale Tests musst du ngrok oder einen ähnlichen Service verwenden, da Clerk Webhooks nur auf öffentlich erreichbare URLs sendet.

4. **Production**: In Production sollte die Webhook-URL über HTTPS erreichbar sein.

---

## 🚀 Nächste Schritte

Nach erfolgreicher Webhook-Einrichtung:

1. ✅ Teste die Registrierung eines neuen Users
2. ✅ Teste den Checkout-Flow
3. ✅ Prüfe ob die Weiterleitung nach Login korrekt funktioniert
4. ✅ Prüfe ob Team-User korrekt behandelt werden

---

## 📚 Weitere Ressourcen

- [Clerk Webhooks Dokumentation](https://clerk.com/docs/integrations/webhooks/overview)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

