# Vollständige Implementierungs-Anleitung

Diese Anleitung führt dich durch die vollständige Einrichtung deiner SaaS-Plattform mit Stripe-Integration und Supabase-Backend.

## 📋 Übersicht

Die Implementierung umfasst:
- ✅ Umgebungsvariablen-Konfiguration
- ✅ Supabase-Datenbank-Schema
- ✅ Stripe API-Endpunkte
- ✅ Frontend-Komponenten (PricingTable, SubscriptionManagement, PaymentSuccess)
- ✅ Webhook-Integration

## 🚀 Setup-Schritte

### 1. Umgebungsvariablen konfigurieren

#### Frontend (.env Datei)

Die `.env` Datei wurde bereits mit folgenden Werten aktualisiert:

```env
VITE_BASE_URL=https://arvo-labs.de

# Supabase Configuration
VITE_SUPABASE_URL=https://wncuwnignndwooeazhwr.supabase.co
VITE_SUPABASE_ANON_KEY=[vom Supabase Dashboard holen]

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SfROMPgo9Kimm8xQpAppBBMJQmHMfDL2sV5ohWKpg9GWwsWGl3EMucGThc3y8VbQEQtTjpz3LqXlSt5GnmXlmf200zlN8iA3e

# Stripe Price IDs
VITE_STRIPE_PRICE_STARTER=price_1SfRXkPgo9Kimm8xHNLvrWVR
VITE_STRIPE_PRICE_PRO=price_1SfRY5Pgo9Kimm8x04VoyShG
VITE_STRIPE_PRICE_ENTERPRISE=price_1SfRYXPgo9Kimm8xe9LWxFwj
VITE_STRIPE_PRICE_INDIVIDUAL=price_1SfRW1Pgo9Kimm8xGy8fUex1
```

**Wichtig:** Hole den `VITE_SUPABASE_ANON_KEY` aus dem Supabase Dashboard:
1. Gehe zu **Project Settings** → **API**
2. Kopiere den **anon/public key**

#### Backend (Vercel Environment Variables)

In Vercel Dashboard → **Settings** → **Environment Variables** hinzufügen:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...  # Dein Stripe Secret Key
STRIPE_WEBHOOK_SECRET=whsec_...  # Wird von Stripe generiert

# Supabase
SUPABASE_URL=https://wncuwnignndwooeazhwr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Service Role Key (NICHT der anon key!)

# App
APP_URL=https://arvo-labs.de  # Oder deine Domain
```

### 2. Supabase-Datenbank-Schema erstellen

1. Gehe zu **Supabase Dashboard** → **SQL Editor**
2. Führe das Script `supabase-complete-schema.sql` aus
3. Das Script erstellt:
   - `profiles` Tabelle (mit allen benötigten Feldern)
   - `subscriptions` Tabelle
   - RLS Policies
   - Trigger für automatische Profil-Erstellung
   - Funktionen für automatische Updates

**Wichtig:** Die Tabelle heißt `profiles` (nicht `user_profiles`). Die API-Endpunkte müssen entsprechend angepasst werden.

### 3. Supabase-Auth konfigurieren

1. Gehe zu **Authentication** → **URL Configuration**
2. Füge folgende Redirect URLs hinzu:
   ```
   https://arvo-labs.de/**
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   ```

### 4. Stripe-Webhook konfigurieren

1. Gehe zu **Stripe Dashboard** → **Developers** → **Webhooks**
2. Klicke auf **Add endpoint**
3. Endpoint URL: `https://deine-domain.vercel.app/api/stripe-webhook`
4. Wähle folgende Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Kopiere den **Signing secret** (beginnt mit `whsec_`)
6. Füge ihn in Vercel als `STRIPE_WEBHOOK_SECRET` hinzu

### 5. API-Endpunkte

Die folgenden API-Endpunkte sind implementiert:

#### `/api/create-checkout-session.js`
- Erstellt Stripe Checkout Session
- Parameter: `userId`, `priceId`, `accountType`
- Returniert: `sessionId`, `url` (für Redirect)

#### `/api/create-subscription.js`
- Erstellt direkte Subscription (nach Setup Intent)
- Parameter: `userId`, `priceId`, `paymentMethodId`, `accountType`
- Returniert: `subscriptionId`, `status`

#### `/api/stripe-webhook.js`
- Verarbeitet Stripe Webhook Events
- Aktualisiert `profiles` und `subscriptions` Tabellen
- Unterstützt alle wichtigen Events

#### `/api/create-payment-intent.js`
- Erstellt Setup Intent für Payment Element
- Parameter: `userId`, `priceId`
- Returniert: `clientSecret`, `setupIntentId`

#### `/api/cancel-subscription.js`
- Kündigt Subscription (am Ende der Periode)
- Parameter: `userId`, `subscriptionId`
- Returniert: `success`, `cancelAtPeriodEnd`, `currentPeriodEnd`

### 6. Frontend-Komponenten

#### PricingTable Component
- **Pfad:** `src/components/pricing/PricingTable.tsx`
- Zeigt alle Pläne (Individual/Team)
- Toggle zwischen Monatlich/Jährlich
- "Subscribe" Button startet Checkout

**Verwendung:**
```tsx
import { PricingTable } from '@/components/pricing/PricingTable';

<PricingTable 
  accountType="individual" 
  onPlanSelect={(plan, accountType) => {
    console.log('Plan selected:', plan, accountType);
  }}
/>
```

#### SubscriptionManagement Component
- **Pfad:** `src/components/subscription/SubscriptionManagement.tsx`
- Zeigt aktuellen Plan
- Upgrade/Downgrade Buttons
- Cancel Subscription Button

**Verwendung:**
```tsx
import { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';

<SubscriptionManagement />
```

#### PaymentSuccess Page
- **Pfad:** `src/pages/PaymentSuccess.tsx`
- Success-Seite nach Stripe Checkout
- Lädt User-Daten neu
- Route: `/payment/success`

### 7. Routen hinzufügen

Die Route für PaymentSuccess wurde bereits in `src/App.tsx` hinzugefügt:

```tsx
<Route path="/payment/success" element={<PaymentSuccess />} />
```

## 🔧 Wichtige Anpassungen

### Tabellennamen

**WICHTIG:** Das neue Schema verwendet `profiles` statt `user_profiles`. 

Die API-Endpunkte müssen angepasst werden:
- `user_profiles` → `profiles`

Oder du kannst beide Tabellennamen unterstützen (für Migration).

### Kompatibilität

Falls du bereits `user_profiles` verwendest, kannst du:
1. Eine Migration erstellen: `ALTER TABLE user_profiles RENAME TO profiles;`
2. Oder die API-Endpunkte so anpassen, dass sie beide Namen unterstützen

## 🧪 Testing

### Lokal testen

1. Starte den Dev-Server:
   ```bash
   npm run dev
   ```

2. Teste den Checkout-Flow:
   - Gehe zu `/preise`
   - Wähle einen Plan
   - Melde dich an (falls nicht angemeldet)
   - Wird zu Stripe Checkout weitergeleitet

3. Teste mit Stripe Test-Karten:
   - Erfolgreich: `4242 4242 4242 4242`
   - Fehlgeschlagen: `4000 0000 0000 0002`

### Webhook testen

1. Verwende Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5173/api/stripe-webhook
   ```

2. Oder verwende Stripe Dashboard → **Webhooks** → **Send test webhook**

## 📝 Checkliste

- [ ] `.env` Datei mit allen Werten gefüllt
- [ ] Vercel Environment Variables gesetzt
- [ ] Supabase Schema ausgeführt (`supabase-complete-schema.sql`)
- [ ] Supabase Redirect URLs konfiguriert
- [ ] Stripe Webhook erstellt und konfiguriert
- [ ] Stripe Webhook Secret in Vercel gesetzt
- [ ] API-Endpunkte getestet
- [ ] Frontend-Komponenten getestet
- [ ] PaymentSuccess Route funktioniert

## 🐛 Troubleshooting

### "Profile not found" Fehler
- Prüfe, ob die `profiles` Tabelle existiert
- Prüfe, ob der Trigger für automatische Profil-Erstellung aktiv ist
- Prüfe RLS Policies

### Webhook funktioniert nicht
- Prüfe `STRIPE_WEBHOOK_SECRET` in Vercel
- Prüfe Webhook URL in Stripe Dashboard
- Prüfe Vercel Logs für Fehler

### Checkout funktioniert nicht
- Prüfe Stripe Price IDs in `.env`
- Prüfe `STRIPE_SECRET_KEY` in Vercel
- Prüfe Browser Console für Fehler

## 📚 Weitere Ressourcen

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)



