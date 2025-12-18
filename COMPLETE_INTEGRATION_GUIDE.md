# 🚀 Vollständige Supabase + Stripe Integration - Implementierungs-Guide

## 📋 Übersicht

Dieses Dokument beschreibt die vollständige Implementierung des Authentication- und Subscription-Systems mit Supabase und Stripe.

## ✅ Implementierte Komponenten

### 1. Authentication System
- ✅ Email/Password Sign-up und Login
- ✅ Automatische Session-Verwaltung
- ✅ Protected Routes für authentifizierte Benutzer
- ✅ Redirect nach Login zu `/dashboard` oder `/preise` (je nach Plan)
- ✅ Error Handling für fehlgeschlagene Logins

### 2. Stripe Subscription Integration
- ✅ Customer-Erstellung bei User-Registrierung (`/api/create-stripe-customer`)
- ✅ Checkout-Session für Abonnement-Auswahl (`/api/create-checkout-session`)
- ✅ Webhook-Handler für alle Events (`/api/stripe-webhook`)
- ✅ Synchronisation von Subscription-Status mit Supabase

### 3. Datenbank Schema
- ✅ `profiles` Tabelle (User-Profile mit Stripe-Integration)
- ✅ `subscriptions` Tabelle (Stripe Subscription Management)
- ✅ Automatische Profil-Erstellung bei Registrierung
- ✅ RLS Policies für Sicherheit

## 🔧 Konfiguration

### Supabase Auth Configuration

#### Redirect URLs konfigurieren:
1. Gehe zu **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Füge folgende Redirect URLs hinzu:
   ```
   https://arvo-labs.de/**
   https://www.arvo-labs.de/**
   http://localhost:3000/**
   http://localhost:5173/**
   ```
3. Setze **Site URL** zu: `https://arvo-labs.de`

#### Email-Bestätigung (optional):
- **Empfohlen:** Deaktivieren für automatisches Login nach Registrierung
- **Wo:** Authentication → Settings → "Enable email confirmations"

### Stripe Webhook Configuration

#### Webhook Endpoints:
1. Gehe zu **Stripe Dashboard** → **Developers** → **Webhooks**
2. Haupt-Endpoint: `https://arvo-labs.de/api/stripe-webhook`
3. Backup-Endpoint: `https://arvo-labs-website-p2iy.vercel.app/api/stripe-webhook`

#### Webhook Events aktivieren:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

#### Webhook Secret:
- Kopiere den **Signing secret** (beginnt mit `whsec_`)
- Füge ihn in Vercel als `STRIPE_WEBHOOK_SECRET` hinzu

### Vercel Environment Variables

**Backend (Vercel):**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://wncuwnignndwooeazhwr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (Service Role Key!)
APP_URL=https://arvo-labs.de
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://wncuwnignndwooeazhwr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (Anon Key!)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_STARTER=price_...
VITE_STRIPE_PRICE_PRO=price_...
VITE_STRIPE_PRICE_ENTERPRISE=price_...
VITE_STRIPE_PRICE_INDIVIDUAL=price_...
```

## 📊 Datenbank Schema

### profiles Tabelle
```sql
- id (UUID, Primary Key, FK zu auth.users)
- plan (TEXT: 'starter', 'pro', 'enterprise', 'individual')
- account_type (TEXT: 'individual', 'team')
- stripe_customer_id (TEXT)
- subscription_plan (TEXT, default 'free')
- usage_limit (INTEGER, default 1000)
- full_name, avatar_url, username (TEXT)
- created_at, updated_at (TIMESTAMP)
```

### subscriptions Tabelle
```sql
- id (UUID, Primary Key)
- user_id (UUID, FK zu auth.users)
- stripe_customer_id (TEXT)
- stripe_subscription_id (TEXT, UNIQUE)
- plan_id (TEXT) -- Stripe Price ID
- status (TEXT: 'active', 'canceled', 'past_due', etc.)
- current_period_start, current_period_end (TIMESTAMP)
- cancel_at_period_end (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

## 🔄 Authentication Flow

### Registrierung (Sign Up)
1. User füllt Registrierungsformular aus
2. `signUp()` wird aufgerufen → Supabase erstellt User
3. **Automatisch:**
   - Profil wird in `profiles` erstellt (durch Trigger)
   - Stripe Customer wird erstellt (durch API-Call)
4. User wird automatisch eingeloggt (wenn Email-Bestätigung deaktiviert)
5. Weiterleitung zu `/dashboard`

### Anmeldung (Sign In)
1. User gibt Email/Passwort ein
2. `signIn()` wird aufgerufen → Supabase authentifiziert User
3. System prüft Plan in `profiles` Tabelle
4. **Weiterleitung:**
   - Wenn `plan === 'starter'` oder kein Plan → `/preise`
   - Wenn aktiver Plan vorhanden → `/dashboard`

### Protected Routes
- Alle `/dashboard/*` Routen sind geschützt
- Nicht eingeloggte User werden zu `/auth/sign-in` weitergeleitet
- Redirect-URL wird gespeichert für Rückkehr nach Login

## 💳 Subscription Flow

### Plan-Auswahl
1. User geht zu `/preise`
2. Wählt einen Plan (z.B. Pro)
3. Klickt "Subscribe"
4. Frontend ruft `/api/create-checkout-session` auf
5. User wird zu Stripe Checkout weitergeleitet

### Checkout-Prozess
1. User gibt Zahlungsinformationen ein
2. Stripe verarbeitet Zahlung
3. Stripe sendet Webhook-Event `checkout.session.completed`
4. Webhook-Handler aktualisiert `profiles` und `subscriptions`

### Nach erfolgreicher Zahlung
1. User wird zu `/payment/success` weitergeleitet
2. System wartet auf Webhook-Verarbeitung
3. Profil wird aktualisiert
4. Weiterleitung zu `/dashboard`

## 🔔 Webhook Events

### customer.subscription.created
- Erstellt Eintrag in `subscriptions` Tabelle
- Aktualisiert `profiles.plan`
- Setzt `profiles.stripe_customer_id`

### customer.subscription.updated
- Aktualisiert `subscriptions` Status
- Aktualisiert `profiles.plan` (falls geändert)

### customer.subscription.deleted
- Setzt `subscriptions.status` auf 'canceled'
- Setzt `profiles.plan` zurück auf 'starter'

### checkout.session.completed
- Erstellt/aktualisiert Profil mit `stripe_customer_id`
- Startet Subscription-Erstellung

### invoice.payment_succeeded
- Bestätigt aktiven Plan
- Aktualisiert Subscription-Status

### invoice.payment_failed
- Optional: Benachrichtigung an User
- Subscription bleibt aktiv (bis Retry)

## 🛡️ Security

### Row Level Security (RLS)
- Users können nur ihr eigenes Profil sehen/bearbeiten
- Users können nur ihre eigene Subscription sehen
- Subscriptions können nur über Webhook aktualisiert werden

### API Security
- Service Role Key nur im Backend (Vercel)
- Anon Key nur im Frontend
- Webhook-Signatur-Verifizierung
- CORS-Konfiguration in Supabase

## 🧪 Testing

### Test Registrierung
1. Gehe zu `/auth/sign-up`
2. Registriere neuen User
3. Prüfe in Supabase:
   - ✅ `profiles` Tabelle: Neues Profil erstellt
   - ✅ `stripe_customer_id` sollte gesetzt sein

### Test Checkout
1. Gehe zu `/preise`
2. Wähle Plan → "Subscribe"
3. Verwende Test-Karte: `4242 4242 4242 4242`
4. Prüfe in Supabase:
   - ✅ `profiles.plan` aktualisiert
   - ✅ `subscriptions` Tabelle: Neuer Eintrag

### Test Webhook
1. Prüfe Stripe Dashboard → Webhooks → Events
2. Prüfe Vercel Logs für Webhook-Verarbeitung
3. Prüfe Supabase für aktualisierte Daten

## 📝 API Endpunkte

### `/api/create-stripe-customer`
- **Methode:** POST
- **Parameter:** `userId`, `email`, `fullName`
- **Return:** `customerId`, `alreadyExists`

### `/api/create-checkout-session`
- **Methode:** POST
- **Parameter:** `userId`, `priceId`, `accountType`
- **Return:** `sessionId`, `url`

### `/api/create-subscription`
- **Methode:** POST
- **Parameter:** `userId`, `priceId`, `paymentMethodId`, `accountType`
- **Return:** `subscriptionId`, `status`

### `/api/stripe-webhook`
- **Methode:** POST
- **Verifiziert:** Webhook-Signatur
- **Verarbeitet:** Alle Stripe Events

### `/api/cancel-subscription`
- **Methode:** POST
- **Parameter:** `userId`, `subscriptionId`
- **Return:** `success`, `cancelAtPeriodEnd`

## ✅ Checkliste

- [ ] Supabase Schema ausgeführt (`supabase-complete-schema.sql`)
- [ ] Supabase Redirect URLs konfiguriert
- [ ] Email-Bestätigung deaktiviert (optional)
- [ ] Vercel Environment Variables gesetzt
- [ ] Stripe Webhook konfiguriert
- [ ] Stripe Webhook Events aktiviert
- [ ] Frontend .env Datei konfiguriert
- [ ] Protected Routes getestet
- [ ] Registrierung getestet
- [ ] Checkout getestet
- [ ] Webhook getestet

## 🎉 Fertig!

Wenn alle Punkte erledigt sind, ist dein vollständiges Authentication- und Subscription-System einsatzbereit!


