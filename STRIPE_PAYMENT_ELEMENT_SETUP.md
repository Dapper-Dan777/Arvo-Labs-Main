# Stripe Payment Element Setup (Custom UI)

Diese Anleitung zeigt dir, wie du das Stripe Payment Element mit Custom Checkout in deiner Anwendung einrichtest.

## 📋 Übersicht

Statt zum gehosteten Stripe Checkout weiterzuleiten, wird das Zahlungsformular direkt in deine App eingebettet. Dies bietet:
- ✅ Bessere UX (kein Redirect)
- ✅ Vollständige Anpassung des Designs
- ✅ Mehr Kontrolle über den Checkout-Prozess

## 🗂️ Dateien

- `api/create-checkout-session.js` - Erstellt Session mit `ui_mode: 'custom'`
- `src/components/Checkout/CheckoutProvider.tsx` - Wrapper für Stripe CheckoutProvider
- `src/components/Checkout/CheckoutForm.tsx` - Payment Element Formular
- `src/lib/stripe.ts` - Stripe Client Initialisierung

## 🚀 Setup-Schritte

### 1. Pakete installieren

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

✅ Bereits zu `package.json` hinzugefügt

### 2. Stripe Publishable Key konfigurieren

In Vercel Dashboard → **Environment Variables**:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Oder pk_test_xxxxx für Development
```

**Wo finde ich meinen Publishable Key?**
- Stripe Dashboard → **Developers** → **API keys**
- **Publishable key** (beginnt mit `pk_`)

### 3. Environment-Variablen prüfen

Stelle sicher, dass alle Variablen gesetzt sind:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
APP_URL=https://arvo-labs.de
```

### 4. Testen

1. Starte die App: `npm run dev`
2. Gehe zu `/dashboard/billing`
3. Klicke auf "Pro Plan abonnieren"
4. Das Payment Element sollte eingebettet angezeigt werden
5. Teste mit Test-Karte: `4242 4242 4242 4242`

## 🎨 Anpassung

### Payment Element Design anpassen

In `src/components/Checkout/CheckoutForm.tsx`:

```typescript
<PaymentElement 
  options={{
    layout: 'accordion', // oder 'tabs'
    // Weitere Optionen siehe Stripe Dokumentation
  }}
/>
```

### CheckoutProvider Appearance

Du kannst das gesamte Erscheinungsbild anpassen:

```typescript
<StripeCheckoutProvider
  stripe={stripe}
  options={{
    clientSecret: clientSecret,
    appearance: {
      theme: 'stripe', // oder 'night', 'flat'
      variables: {
        colorPrimary: '#4f46e5',
        // Weitere Variablen
      },
    },
  }}
>
```

## 📊 Datenfluss

```
1. User klickt "Plan abonnieren"
   ↓
2. Frontend ruft /api/create-checkout-session auf
   ↓
3. Function erstellt Session mit ui_mode: 'custom'
   ↓
4. Function gibt client_secret zurück
   ↓
5. CheckoutProvider lädt Stripe und initialisiert Checkout
   ↓
6. CheckoutForm zeigt Payment Element
   ↓
7. User gibt Zahlungsdaten ein
   ↓
8. User klickt "Jetzt abonnieren"
   ↓
9. checkout.confirm() wird aufgerufen
   ↓
10. Stripe verarbeitet Zahlung
   ↓
11. Webhook aktualisiert Plan in Supabase
   ↓
12. Frontend zeigt Erfolgsmeldung
```

## 🔧 Verwendung

### In der Billing-Komponente

Die Billing-Seite verwendet bereits das CheckoutProvider:

```typescript
<CheckoutProvider
  priceId={selectedPlan.priceId}
  planName={getPlanName(selectedPlan.plan)}
  userId={user.id}
  onSuccess={handleCheckoutSuccess}
  onCancel={handleCheckoutCancel}
/>
```

### In anderen Komponenten

```typescript
import { CheckoutProvider } from '@/components/Checkout/CheckoutProvider';

function MyComponent() {
  const { user } = useUser();
  
  return (
    <CheckoutProvider
      priceId="price_xxxxx"
      planName="Pro Plan"
      userId={user?.id || ''}
      onSuccess={() => console.log('Success!')}
      onCancel={() => console.log('Canceled')}
    />
  );
}
```

## 🐛 Fehlerbehebung

### Problem: "Stripe konnte nicht geladen werden"

**Lösung:**
1. Prüfe, ob `VITE_STRIPE_PUBLISHABLE_KEY` gesetzt ist
2. Prüfe, ob der Key mit `pk_` beginnt (nicht `sk_`)
3. Prüfe Browser-Konsole auf Fehler

### Problem: "Kein client_secret erhalten"

**Lösung:**
1. Prüfe Vercel Logs: **Deployments** → **Functions** → **create-checkout-session**
2. Stelle sicher, dass `ui_mode: 'custom'` gesetzt ist
3. Prüfe, ob `STRIPE_SECRET_KEY` korrekt ist

### Problem: Payment Element wird nicht angezeigt

**Lösung:**
1. Prüfe, ob `@stripe/react-stripe-js` installiert ist
2. Prüfe Browser-Konsole auf Fehler
3. Stelle sicher, dass `clientSecret` gesetzt ist

### Problem: Zahlung schlägt fehl

**Lösung:**
1. Verwende Test-Karten (siehe unten)
2. Prüfe Stripe Dashboard → **Payments** für Details
3. Prüfe Vercel Logs für Fehler

## 🧪 Test-Karten

| Karte | Szenario |
|-------|----------|
| `4242 4242 4242 4242` | Erfolgreich, keine Authentifizierung |
| `4000 0025 0000 3155` | Erfolgreich, Authentifizierung erforderlich |
| `4000 0000 0000 9995` | Abgelehnt (insufficient_funds) |
| `4000 0000 0000 0002` | Abgelehnt (generic_decline) |

**Beliebige Daten:**
- Gültigkeitsdatum: Jedes zukünftige Datum
- CVC: Beliebige 3 Ziffern
- Postleitzahl: Beliebige 5 Ziffern

## 🔒 Sicherheit

- ✅ Payment Element läuft in Stripe's iframe (PCI-konform)
- ✅ Sensible Daten werden nie an deinen Server gesendet
- ✅ Webhook-Signatur wird verifiziert
- ✅ Service Role Key nur im Backend

## 📝 Unterschiede zum gehosteten Checkout

| Feature | Gehostetes Checkout | Payment Element (Custom) |
|---------|---------------------|--------------------------|
| Redirect | ✅ Ja | ❌ Nein |
| Design-Anpassung | ⚠️ Begrenzt | ✅ Vollständig |
| UX | ⚠️ Verlässt App | ✅ Bleibt in App |
| Setup | ✅ Einfacher | ⚠️ Etwas komplexer |

## 📚 Ressourcen

- [Stripe Payment Element Dokumentation](https://stripe.com/docs/payments/payment-element)
- [Stripe Checkout Custom UI](https://stripe.com/docs/payments/checkout/customization)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)

## ✅ Checkliste

- [ ] `@stripe/stripe-js` installiert
- [ ] `@stripe/react-stripe-js` installiert
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` gesetzt
- [ ] `STRIPE_SECRET_KEY` gesetzt
- [ ] `api/create-checkout-session.js` verwendet `ui_mode: 'custom'`
- [ ] CheckoutProvider funktioniert
- [ ] Payment Element wird angezeigt
- [ ] Test-Zahlung erfolgreich




