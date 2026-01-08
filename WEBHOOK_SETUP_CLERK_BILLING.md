# Clerk Billing Webhook Setup

Diese Anleitung beschreibt, wie du den Clerk Billing Webhook für automatische Organization-Erstellung einrichtest.

## 🎯 Übersicht

Der Webhook verarbeitet Clerk Billing Events:
- **subscription.created**: Wenn ein User einen Plan abonniert
- **subscription.updated**: Wenn ein Subscription aktualisiert wird
- **checkout.session.completed**: Wenn ein Checkout abgeschlossen wird

Für Team-Pläne:
- Automatisch Organization erstellen (falls nicht vorhanden)
- Organization `publicMetadata` setzen (plan, isTeam, accountType)
- User `publicMetadata` setzen (plan, isTeam, accountType)

## 📋 Setup-Schritte

### 1. Environment Variable setzen

Füge in `.env.local` hinzu:

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

**WICHTIG**: Der Webhook Secret wird im Clerk Dashboard generiert (siehe Schritt 3).

### 2. Webhook-Route ist bereits erstellt

Die Route `src/app/api/webhooks/clerk/route.ts` ist bereits implementiert und verwendet:
- `svix` für Webhook-Verification
- `clerkClient` für Organization-Erstellung
- Plan-Mapping aus `@/lib/clerk-plan-mapping`

### 3. Webhook in Clerk Dashboard einrichten

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigiere zu **"Developers"** → **"Webhooks"**
3. Klicke auf **"+ Add Endpoint"**
4. **Endpoint URL**:
   - Production: `https://deine-domain.vercel.app/api/webhooks/clerk`
   - Development: `https://dein-ngrok-url.ngrok.io/api/webhooks/clerk` (für lokales Testen)
5. **Events auswählen**:
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `checkout.session.completed` (optional, falls verwendet)
6. Klicke auf **"Create"**
7. **Kopiere den Webhook Secret** (beginnt mit `whsec_`)
8. Füge ihn in `.env.local` als `CLERK_WEBHOOK_SECRET` ein

### 4. Lokales Testen (optional)

#### Mit ngrok:

```bash
# ngrok installieren: https://ngrok.com/download
ngrok http 3000

# Kopiere die HTTPS-URL (z.B. https://abc123.ngrok.io)
# Füge sie in Clerk Dashboard als Webhook URL ein
```

#### Mit Clerk CLI (falls verfügbar):

```bash
# Webhook-Events simulieren
clerk webhook test subscription.created
```

### 5. Deployen

```bash
git add src/app/api/webhooks/clerk/route.ts
git commit -m "Add Clerk Billing webhook handler"
git push
```

Vercel deployt automatisch die API Route.

### 6. Testen in Production

1. Kaufe einen Team-Plan über Clerk Billing
2. Prüfe Vercel Logs: **Deployments** → **Functions** → **webhooks/clerk**
3. Prüfe Clerk Dashboard: **Users** → User → **Metadata** (sollte `plan`, `isTeam`, `accountType` enthalten)
4. Prüfe Clerk Dashboard: **Organizations** → Organization sollte existieren mit korrektem `publicMetadata`

## 🔍 Troubleshooting

### Webhook wird nicht aufgerufen

- Prüfe, ob die Webhook-URL in Clerk Dashboard korrekt ist
- Prüfe, ob `CLERK_WEBHOOK_SECRET` in Vercel Environment Variables gesetzt ist
- Prüfe Vercel Logs auf Fehler

### Organization wird nicht erstellt

- Prüfe Vercel Logs auf Fehler
- Prüfe, ob User bereits eine Organization hat (wird übersprungen)
- Prüfe, ob `clerkClient` korrekt konfiguriert ist

### Plan wird nicht korrekt gemappt

- Prüfe, ob Plan-Name in Webhook-Event korrekt ist
- Prüfe `src/lib/clerk-plan-mapping.ts` für Mapping-Logik
- Prüfe Vercel Logs für `planName` und `clerkPlan` Werte

## 📝 Webhook Event Structure

Clerk Billing Events können unterschiedliche Strukturen haben. Der Webhook-Handler unterstützt:

```typescript
// Mögliche Event-Strukturen:
{
  type: "subscription.created",
  data: {
    user_id: "...",
    plan_id: "...",
    plan_name: "team_pro"
  }
}

// Oder:
{
  type: "subscription.created",
  data: {
    object: {
      user_id: "...",
      plan_id: "...",
      plan_name: "team_pro"
    }
  }
}
```

Der Handler versucht alle möglichen Feldnamen automatisch.

