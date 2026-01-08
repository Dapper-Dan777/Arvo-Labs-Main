# Zapier Monitoring Setup

Diese Anleitung erklärt, wie du die Zapier Table API für das Monitoring-Dashboard einrichtest.

## 📋 Übersicht

Das Monitoring-Dashboard zeigt Daten aus deiner Zapier Table "Customer Onboarding Log" an. Die Daten werden über eine Next.js API-Route abgerufen und im Dashboard visualisiert.

## 🔧 Environment Variables

Füge folgende Environment Variables in deiner `.env.local` (Development) oder in Vercel (Production) hinzu:

```env
# Zapier Table API Configuration
ZAPIER_TABLE_API_KEY=your_zapier_api_key_here
ZAPIER_TABLE_ID=your_table_id_here
```

### Wo finde ich diese Werte?

#### 1. Zapier API Key

1. Gehe zu [Zapier Platform](https://platform.zapier.com/)
2. Melde dich mit deinem Zapier-Account an
3. Gehe zu **Settings** → **API Keys**
4. Erstelle einen neuen API Key oder kopiere einen bestehenden
5. **Wichtig**: Der API Key sollte die Berechtigung haben, auf Tables zuzugreifen

#### 2. Table ID

1. Gehe zu deinem Zapier Dashboard
2. Öffne die **Tables** App
3. Wähle deine "Customer Onboarding Log" Table aus
4. Die Table ID findest du in der URL oder in den Table-Einstellungen
   - Format: `https://zapier.com/apps/tables/table/{TABLE_ID}`
   - Oder: Table Settings → API → Table ID

## 📊 Zapier Table Schema

Deine "Customer Onboarding Log" Table sollte folgende Spalten haben:

| Spaltenname | Typ | Beschreibung |
|------------|-----|--------------|
| `timestamp` | DateTime | Zeitstempel des Onboarding-Events |
| `user_id` | Text | Eindeutige User-ID aus deinem Dashboard |
| `email` | Text | E-Mail-Adresse des Kunden |
| `plan` | Text | Gewählter Plan (starter, pro, enterprise, individual) |
| `status` | Text | Status: `success`, `error`, oder `partial` |
| `hubspot_contact_id` | Text (optional) | HubSpot Contact ID, falls erstellt |
| `stripe_subscription_id` | Text (optional) | Stripe Subscription ID, falls erstellt |
| `error_step` | Text (optional) | Step, bei dem Fehler aufgetreten ist (z.B. "hubspot", "stripe", "email") |
| `error_message` | Text (optional) | Fehlermeldung, falls Status = "error" |

### Alternative Spaltennamen

Die API-Route unterstützt auch alternative Spaltennamen (CamelCase):
- `userId` statt `user_id`
- `hubspotContactId` statt `hubspot_contact_id`
- `stripeSubscriptionId` statt `stripe_subscription_id`
- `errorStep` statt `error_step`
- `errorMessage` statt `error_message`

## 🔄 Zapier Automation Setup

Stelle sicher, dass deine Zapier Automation (Customer Onboarding) Daten in die Table schreibt:

### Step: "Create Row in Table"

1. **App**: Tables by Zapier
2. **Action**: Create Row
3. **Table**: Customer Onboarding Log
4. **Fields**:
   - `timestamp`: `{{zap_meta_human_now}}` oder `{{timestamp}}`
   - `user_id`: `{{trigger_data.user_id}}`
   - `email`: `{{trigger_data.email}}`
   - `plan`: `{{trigger_data.plan}}`
   - `status`: `success`, `error`, oder `partial`
   - `hubspot_contact_id`: `{{step_2.id}}` (aus HubSpot Step)
   - `stripe_subscription_id`: `{{step_3.id}}` (aus Stripe Step)
   - `error_step`: Nur setzen, wenn `status = error`
   - `error_message`: Nur setzen, wenn `status = error`

### Error Handling

Für jeden Step, der fehlschlagen kann, füge einen **Path by Zapier** hinzu:

1. **Path A (Success)**: Setze `status = success` und fahre fort
2. **Path B (Error)**: Setze `status = error`, `error_step = "step_name"`, `error_message = "{{error_message}}"` und stoppe

## 🧪 Testing

### 1. Mock-Daten testen

Ohne Environment Variables verwendet die API automatisch Mock-Daten:

```bash
# Starte den Dev Server
npm run dev

# Öffne das Monitoring-Dashboard
# http://localhost:3000/dashboard/team/automations/monitoring
```

Du solltest Mock-Daten sehen. In der Browser-Konsole erscheint eine Warnung:
```
⚠️ Monitoring: Verwende Mock-Daten. Setze ZAPIER_TABLE_API_KEY und ZAPIER_TABLE_ID...
```

### 2. Echte Daten testen

1. Setze die Environment Variables in `.env.local`:
   ```env
   ZAPIER_TABLE_API_KEY=your_key
   ZAPIER_TABLE_ID=your_table_id
   ```

2. Starte den Dev Server neu:
   ```bash
   npm run dev
   ```

3. Öffne das Monitoring-Dashboard erneut
4. Die Warnung sollte verschwinden und echte Daten aus Zapier sollten angezeigt werden

### 3. API direkt testen

```bash
# GET Request mit Query Params
curl http://localhost:3000/api/automations/monitoring-logs?status=success&limit=10

# Mit Authentication (Clerk)
# Du musst eingeloggt sein, sonst bekommst du 401 Unauthorized
```

## 📝 API Endpoint

### GET `/api/automations/monitoring-logs`

**Query Parameters:**
- `status?`: Filter nach Status (`success`, `error`, `partial`, `all`)
- `plan?`: Filter nach Plan (`starter`, `pro`, `enterprise`, `individual`)
- `startDate?`: Startdatum (ISO String)
- `endDate?`: Enddatum (ISO String)
- `limit?`: Maximale Anzahl Einträge (Standard: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "user_id": "usr_123",
      "email": "customer@example.com",
      "plan": "pro",
      "status": "success",
      "hubspot_contact_id": "12345",
      "stripe_subscription_id": "sub_123"
    }
  ],
  "count": 1,
  "isMockData": false
}
```

## 🚀 Production Deployment

### Vercel

1. Gehe zu **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Füge hinzu:
   - `ZAPIER_TABLE_API_KEY`: Dein Zapier API Key
   - `ZAPIER_TABLE_ID`: Deine Table ID
3. Wähle **Production**, **Preview**, und **Development** aus
4. Redeploy deine App

### Andere Plattformen

Setze die Environment Variables entsprechend in deiner Hosting-Plattform:
- **Netlify**: Site settings → Environment variables
- **Railway**: Variables Tab
- **Heroku**: Config Vars

## 🔒 Sicherheit

- **NIEMALS** den API Key im Frontend-Code committen
- Verwende immer Environment Variables
- Der API Key sollte nur Server-seitig (in API Routes) verwendet werden
- Die API-Route ist durch Clerk Authentication geschützt (nur eingeloggte User)

## 🐛 Troubleshooting

### "Mock-Daten werden angezeigt"

- Prüfe, ob die Environment Variables gesetzt sind
- Prüfe, ob der Dev Server neu gestartet wurde
- Prüfe die Browser-Konsole auf Fehler
- Prüfe die Server-Logs auf API-Fehler

### "401 Unauthorized"

- Stelle sicher, dass du eingeloggt bist
- Prüfe, ob Clerk korrekt konfiguriert ist

### "Zapier API Error"

- Prüfe, ob der API Key gültig ist
- Prüfe, ob die Table ID korrekt ist
- Prüfe, ob der API Key die Berechtigung für Tables hat
- Prüfe die Zapier API Dokumentation für aktuelle Endpoints

### "Keine Daten angezeigt"

- Prüfe, ob deine Zapier Automation Daten in die Table schreibt
- Prüfe, ob die Spaltennamen in der Table mit dem Schema übereinstimmen
- Prüfe die API-Response in den Browser DevTools (Network Tab)

## 📚 Weitere Ressourcen

- [Zapier Tables Documentation](https://zapier.com/help/tables)
- [Zapier Platform API](https://platform.zapier.com/docs/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

