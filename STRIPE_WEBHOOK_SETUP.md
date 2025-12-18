# Stripe Webhook Setup für Vercel

Diese Anleitung zeigt dir, wie du Stripe-Webhooks für deine Vite+Vercel-Anwendung einrichtest.

## 📋 Übersicht

Die Webhook-Integration ermöglicht es, dass Stripe automatisch deine Supabase-Datenbank aktualisiert, wenn:
- Ein User einen Plan abonniert
- Ein Plan aktualisiert wird
- Ein Plan gekündigt wird

## 🗂️ Dateien

- `api/stripe-webhook.js` - Vercel Serverless Function
- `supabase-stripe-schema.sql` - Datenbank-Schema für Stripe-Integration
- `src/hooks/useSubscription.ts` - React Hook für Subscription-Daten

## 🚀 Setup-Schritte

### 1. Datenbank-Schema erstellen

1. Öffne Supabase Dashboard → **SQL Editor**
2. Führe `supabase-stripe-schema.sql` aus
3. Dies erstellt:
   - `stripe_customer_id` Spalte in `user_profiles`
   - `subscriptions` Tabelle
   - RLS Policies
   - Trigger für automatische Synchronisation

### 2. Stripe-Paket installieren

```bash
npm install stripe
```

### 3. Environment-Variablen in Vercel setzen

Im Vercel Dashboard deines Projekts:

**Settings** → **Environment Variables**

Füge hinzu:

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx  # Oder sk_test_xxxxx für Development
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Wird von Stripe generiert

# Supabase (Backend)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Service Role Key!
```

⚠️ **WICHTIG**: 
- `SUPABASE_SERVICE_ROLE_KEY` ist NICHT der anon key!
- Findest du unter: Supabase Dashboard → **Settings** → **API** → **service_role key**
- **NIEMALS** im Frontend verwenden!

### 4. Stripe Price IDs konfigurieren

In `api/stripe-webhook.js`, aktualisiere das `PRICE_TO_PLAN` Mapping:

```javascript
const PRICE_TO_PLAN = {
  'price_1234567890': 'starter',    // Deine Stripe Price ID
  'price_0987654321': 'pro',        // Deine Stripe Price ID
  'price_1122334455': 'enterprise',  // Deine Stripe Price ID
  'price_5566778899': 'individual', // Deine Stripe Price ID
};
```

**Oder** verwende Stripe Metadata:
- In Stripe Dashboard → **Products** → **Prices**
- Füge Metadata hinzu: `plan: "pro"` (oder "starter", "enterprise", "individual")

### 5. Webhook in Stripe einrichten

1. Gehe zu Stripe Dashboard → **Developers** → **Webhooks**
2. Klicke auf **Add endpoint**
3. **Endpoint URL**: `https://dein-projekt.vercel.app/api/stripe-webhook`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed` (optional)
5. Klicke auf **Add endpoint**
6. Kopiere den **Signing secret** (beginnt mit `whsec_`)
7. Füge ihn in Vercel als `STRIPE_WEBHOOK_SECRET` ein

### 6. Testen

#### Lokal testen (mit Stripe CLI)

```bash
# Stripe CLI installieren
brew install stripe/stripe-cli/stripe  # macOS
# oder: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Webhook weiterleiten
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Test-Event senden
stripe trigger customer.subscription.created
```

#### In Production testen

1. Erstelle einen Test-Checkout in Stripe
2. Prüfe Vercel Logs: **Deployments** → **Functions** → **stripe-webhook**
3. Prüfe Supabase: **Table Editor** → **subscriptions** und **user_profiles**

## 🔧 Verwendung im Frontend

### useSubscription Hook

```typescript
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { subscription, isLoading, isActive, willCancel } = useSubscription();

  if (isLoading) return <div>Loading...</div>;

  if (isActive) {
    return <div>Subscription aktiv bis {subscription?.current_period_end}</div>;
  }

  return <div>Keine aktive Subscription</div>;
}
```

### Plan aus Subscription abrufen

Der Plan wird automatisch in `user_profiles.plan` aktualisiert. Verwende den `useUserPlan` Hook:

```typescript
import { useUserPlan } from '@/hooks/useUserPlan';

function Dashboard() {
  const { plan, accountType } = useUserPlan();
  // plan wird automatisch aus user_profiles gelesen
  // und wird durch den Webhook aktualisiert
}
```

## 📊 Datenfluss

```
1. User klickt auf "Abonnieren" → Stripe Checkout
2. User zahlt → Stripe erstellt Subscription
3. Stripe sendet Webhook → Vercel Function
4. Function aktualisiert:
   - user_profiles.plan
   - user_profiles.stripe_customer_id
   - subscriptions Tabelle
5. Frontend liest aktualisierte Daten via useUserPlan/useSubscription
```

## 🐛 Fehlerbehebung

### Problem: Webhook wird nicht empfangen

**Lösung:**
1. Prüfe Vercel Logs: **Deployments** → **Functions**
2. Prüfe Stripe Dashboard → **Webhooks** → **Events**
3. Prüfe, ob die URL korrekt ist: `https://dein-projekt.vercel.app/api/stripe-webhook`

### Problem: "Webhook signature verification failed"

**Lösung:**
1. Prüfe, ob `STRIPE_WEBHOOK_SECRET` korrekt in Vercel gesetzt ist
2. Stelle sicher, dass der Secret vom richtigen Webhook-Endpoint stammt
3. Prüfe, ob `getRawBody` korrekt funktioniert

### Problem: Profile nicht gefunden

**Lösung:**
1. Prüfe, ob `stripe_customer_id` in `user_profiles` gesetzt ist
2. Der Webhook versucht auch, über Email zu finden
3. Stelle sicher, dass der User in Supabase existiert

### Problem: Plan wird nicht aktualisiert

**Lösung:**
1. Prüfe `PRICE_TO_PLAN` Mapping in `api/stripe-webhook.js`
2. Oder verwende Stripe Metadata (siehe Schritt 4)
3. Prüfe Vercel Logs für Fehler

## 🔒 Sicherheit

- ✅ Webhook-Signatur wird verifiziert
- ✅ Service Role Key nur im Backend
- ✅ RLS Policies schützen User-Daten
- ✅ Keine direkten Subscription-Updates vom Frontend

## 📝 Nächste Schritte

1. **Checkout-Integration**: Erstelle Checkout-Links in deiner App
2. **Billing-Seite**: Zeige Subscription-Details an
3. **Plan-Upgrades**: Implementiere Upgrade-Funktionalität
4. **Email-Benachrichtigungen**: Bei Subscription-Änderungen

## 📚 Ressourcen

- [Stripe Webhooks Dokumentation](https://stripe.com/docs/webhooks)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)




