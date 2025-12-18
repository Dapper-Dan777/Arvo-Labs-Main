# Stripe Checkout Session Setup

Diese Anleitung zeigt dir, wie du Stripe Checkout Sessions in deiner Anwendung einrichtest.

## 📋 Übersicht

Die Checkout-Session-Funktion ermöglicht es Usern, direkt aus deiner App heraus einen Plan zu abonnieren:
1. User klickt auf "Plan abonnieren"
2. Frontend ruft `/api/create-checkout-session` auf
3. Function erstellt Stripe Checkout Session
4. User wird zu Stripe Checkout weitergeleitet
5. Nach erfolgreicher Zahlung → Webhook aktualisiert Plan

## 🗂️ Dateien

- `api/create-checkout-session.js` - Vercel Serverless Function
- `src/config/stripe.ts` - Stripe Price IDs Konfiguration
- `src/pages/dashboard/DashboardBilling.tsx` - Billing-Seite mit Checkout-Integration

## 🚀 Setup-Schritte

### 1. Stripe Price IDs konfigurieren

#### Option A: Über Environment-Variablen (empfohlen)

In Vercel Dashboard → **Settings** → **Environment Variables**:

```env
VITE_STRIPE_PRICE_STARTER=price_xxxxx
VITE_STRIPE_PRICE_PRO=price_yyyyy
VITE_STRIPE_PRICE_ENTERPRISE=price_zzzzz
VITE_STRIPE_PRICE_INDIVIDUAL=price_aaaaa
```

#### Option B: Direkt in `src/config/stripe.ts`

```typescript
export const STRIPE_PRICE_IDS = {
  starter: 'price_xxxxx', // Deine Stripe Price ID
  pro: 'price_yyyyy',
  enterprise: 'price_zzzzz',
  individual: 'price_aaaaa',
};
```

**Wo finde ich meine Price IDs?**
1. Gehe zu Stripe Dashboard → **Products**
2. Klicke auf einen Product
3. Unter **Pricing** findest du die **Price ID** (beginnt mit `price_`)

### 2. Environment-Variablen in Vercel setzen

Zusätzlich zu den Webhook-Variablen:

```env
# App URL (für Redirects)
APP_URL=https://arvo-labs.de  # Oder deine Domain

# Stripe (bereits vorhanden)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Supabase (bereits vorhanden)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Stripe Products & Prices erstellen

In Stripe Dashboard:

1. **Products** → **Add product**
2. Erstelle für jeden Plan ein Product:
   - **Starter Plan**
   - **Pro Plan**
   - **Enterprise Plan**
   - **Individual Plan**
3. Für jedes Product:
   - **Pricing**: Wähle "Recurring" (Subscription)
   - **Billing period**: Monthly oder Yearly
   - **Price**: Setze den Preis
   - **Metadata** (optional): Füge `plan: "pro"` hinzu für automatische Zuordnung

### 4. Testen

#### Lokal testen

```bash
# Development Server starten
npm run dev

# In der App:
# 1. Gehe zu /dashboard/billing
# 2. Klicke auf "Pro Plan abonnieren"
# 3. Du solltest zu Stripe Checkout weitergeleitet werden
```

#### Test-Modus

Für Tests verwende Stripe Test Keys:
- `STRIPE_SECRET_KEY=sk_test_xxxxx`
- Test Price IDs (beginnt mit `price_`)

Test-Kreditkarten:
- `4242 4242 4242 4242` - Erfolgreich
- `4000 0000 0000 0002` - Abgelehnt

## 🔧 Verwendung

### In der Billing-Komponente

Die Billing-Seite (`/dashboard/billing`) hat bereits Buttons für jeden Plan:

```typescript
// Automatisch integriert in DashboardBilling.tsx
<Button onClick={() => handleCreateCheckout('pro')}>
  Pro Plan abonnieren
</Button>
```

### In anderen Komponenten

```typescript
import { getStripePriceId, isValidPriceId } from '@/config/stripe';
import { useUser } from '@/contexts/AuthContext';

function MyComponent() {
  const { user } = useUser();
  
  const handleSubscribe = async (plan: 'pro' | 'enterprise') => {
    const priceId = getStripePriceId(plan);
    
    if (!isValidPriceId(priceId)) {
      console.error('Price ID not configured');
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        priceId,
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return <button onClick={() => handleSubscribe('pro')}>Abonnieren</button>;
}
```

## 📊 Datenfluss

```
1. User klickt "Plan abonnieren"
   ↓
2. Frontend ruft /api/create-checkout-session auf
   ↓
3. Function:
   - Findet/erstellt Stripe Customer
   - Erstellt Checkout Session
   - Gibt Checkout URL zurück
   ↓
4. Frontend redirectet zu Stripe Checkout
   ↓
5. User zahlt bei Stripe
   ↓
6. Stripe sendet Webhook → api/stripe-webhook.js
   ↓
7. Webhook aktualisiert:
   - user_profiles.plan
   - subscriptions Tabelle
   ↓
8. User wird zu /dashboard/billing?success=true weitergeleitet
   ↓
9. Frontend zeigt Erfolgsmeldung
   ↓
10. Plan wird automatisch aktualisiert (via useUserPlan Hook)
```

## 🐛 Fehlerbehebung

### Problem: "Price ID not configured"

**Lösung:**
1. Prüfe `src/config/stripe.ts`
2. Stelle sicher, dass die Price IDs korrekt sind
3. Prüfe Environment-Variablen in Vercel

### Problem: "Profile not found"

**Lösung:**
1. Stelle sicher, dass der User eingeloggt ist
2. Prüfe, ob ein Profil in `user_profiles` existiert
3. Der Trigger sollte automatisch ein Profil erstellen

### Problem: Checkout Session wird nicht erstellt

**Lösung:**
1. Prüfe Vercel Logs: **Deployments** → **Functions** → **create-checkout-session**
2. Prüfe, ob `STRIPE_SECRET_KEY` korrekt ist
3. Prüfe, ob `SUPABASE_SERVICE_ROLE_KEY` korrekt ist

### Problem: Redirect funktioniert nicht

**Lösung:**
1. Prüfe `APP_URL` in Vercel Environment Variables
2. Stelle sicher, dass die URL mit `https://` beginnt
3. Prüfe, ob die Success/Cancel URLs korrekt sind

## 🔒 Sicherheit

- ✅ User-ID wird vom Backend validiert
- ✅ Service Role Key nur im Backend
- ✅ Stripe Customer wird automatisch erstellt/verknüpft
- ✅ Metadata für User-Zuordnung

## 📝 Nächste Schritte

1. **Price IDs konfigurieren**: Setze deine Stripe Price IDs
2. **Testen**: Teste den Checkout-Flow
3. **Success-Page**: Erstelle eine dedizierte Success-Seite (optional)
4. **Cancel-Page**: Erstelle eine Cancel-Seite mit Retry-Option (optional)

## 📚 Ressourcen

- [Stripe Checkout Dokumentation](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Management](https://stripe.com/docs/api/customers)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)


