# 🧪 Test-Checkliste - Schritt für Schritt

Das Schema wurde erfolgreich ausgeführt! Jetzt teste, ob alles funktioniert.

## ✅ Voraussetzungen (bereits erledigt)

- ✅ Supabase Schema ausgeführt
- ✅ Vercel Environment Variables gesetzt
- ✅ Supabase Anon Key in `.env`
- ✅ Stripe Webhook konfiguriert
- ✅ Code auf `profiles` umgestellt

## 🧪 Test 1: Registrierung & Automatische Profil-Erstellung

### Schritte:
1. Gehe zu deiner App: `http://localhost:5173` (oder deine Vercel-URL)
2. Gehe zu `/auth/sign-up`
3. Registriere einen neuen Test-User:
   - Email: z.B. `test@example.com`
   - Passwort: Mindestens 8 Zeichen
4. Nach Registrierung: Du solltest eingeloggt sein

### Prüfen in Supabase:
1. Gehe zu **Supabase Dashboard** → **Table Editor**
2. Klicke auf **profiles** Tabelle
3. Du solltest einen neuen Eintrag sehen:
   - ✅ `id` = User-ID
   - ✅ `plan` = `starter`
   - ✅ `account_type` = `individual`
   - ✅ `full_name` = Email oder Name

**✅ Erfolg:** Profil wurde automatisch erstellt!

---

## 🧪 Test 2: Pricing Page & Checkout

### Schritte:
1. Gehe zu `/preise` (oder `/pricing`)
2. Du solltest die Pricing-Tabelle sehen
3. Wähle einen Plan (z.B. **Pro**)
4. Klicke auf **"Pro abonnieren"** (oder ähnlich)
5. Falls nicht angemeldet: Du wirst zur Login-Seite weitergeleitet
6. Nach Login: Du wirst zu **Stripe Checkout** weitergeleitet

### Stripe Checkout Test:
1. Verwende eine **Stripe Test-Karte**:
   - Karte: `4242 4242 4242 4242`
   - Ablaufdatum: Beliebige zukünftige Datei (z.B. `12/34`)
   - CVC: Beliebige 3 Ziffern (z.B. `123`)
   - Postleitzahl: Beliebige 5 Ziffern (z.B. `12345`)
2. Klicke **"Subscribe"** oder **"Zahlung abschließen"**
3. Du wirst zu `/payment/success` weitergeleitet

### Prüfen in Supabase:
1. **profiles** Tabelle:
   - ✅ `stripe_customer_id` sollte gesetzt sein (beginnt mit `cus_`)
   - ✅ `plan` sollte aktualisiert sein (z.B. `pro`)

2. **subscriptions** Tabelle:
   - ✅ Neuer Eintrag sollte vorhanden sein
   - ✅ `status` = `active` oder `trialing`
   - ✅ `stripe_subscription_id` sollte gesetzt sein (beginnt mit `sub_`)

**✅ Erfolg:** Checkout funktioniert und Daten wurden gespeichert!

---

## 🧪 Test 3: Webhook-Verarbeitung

### Prüfen in Stripe:
1. Gehe zu **Stripe Dashboard** → **Developers** → **Webhooks**
2. Klicke auf deinen Webhook
3. Gehe zu **Events** Tab
4. Du solltest Events sehen:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`

### Prüfen in Vercel:
1. Gehe zu **Vercel Dashboard** → **Dein Projekt** → **Functions**
2. Klicke auf **Logs**
3. Du solltest Logs sehen wie:
   - `✅ Created checkout session...`
   - `✅ Subscription active for user...`

### Prüfen in Supabase:
1. **profiles** Tabelle:
   - ✅ `plan` sollte korrekt sein (z.B. `pro`)
   - ✅ `stripe_customer_id` sollte gesetzt sein

2. **subscriptions** Tabelle:
   - ✅ `status` sollte `active` sein
   - ✅ `current_period_start` und `current_period_end` sollten gesetzt sein

**✅ Erfolg:** Webhook verarbeitet Events korrekt!

---

## 🧪 Test 4: Subscription Management

### Schritte:
1. Gehe zu `/dashboard/billing`
2. Du solltest sehen:
   - ✅ Aktueller Plan (z.B. "Pro Plan")
   - ✅ Status (z.B. "Active")
   - ✅ Nächstes Abrechnungsdatum
   - ✅ Upgrade/Downgrade Buttons
   - ✅ Cancel Subscription Button

### Test Upgrade:
1. Klicke auf **"Zu Enterprise upgraden"**
2. Du wirst zu Stripe Checkout weitergeleitet
3. Verwende wieder Test-Karte
4. Nach Zahlung: Plan sollte aktualisiert sein

### Test Cancel (optional):
1. Klicke auf **"Abonnement kündigen"**
2. Bestätige die Kündigung
3. In Supabase: `subscriptions.cancel_at_period_end` sollte `true` sein

**✅ Erfolg:** Subscription Management funktioniert!

---

## 🧪 Test 5: Payment Success Page

### Schritte:
1. Nach erfolgreichem Checkout wirst du zu `/payment/success` weitergeleitet
2. Du solltest sehen:
   - ✅ "Zahlung erfolgreich!" Meldung
   - ✅ "Dein Abonnement wurde erfolgreich aktiviert"
   - ✅ Buttons: "Zum Dashboard" und "Abonnement verwalten"

### Prüfen:
1. Klicke auf **"Zum Dashboard"**
2. Du solltest zum Dashboard weitergeleitet werden
3. Dein Plan sollte jetzt aktiv sein

**✅ Erfolg:** Payment Success Page funktioniert!

---

## 🐛 Troubleshooting

### Problem: "Profile not found" nach Registrierung

**Lösung:**
1. Prüfe, ob der Trigger `on_auth_user_created` existiert:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Falls nicht: Führe das Schema-Script nochmal aus
3. Oder erstelle das Profil manuell in Supabase

### Problem: Checkout funktioniert nicht

**Lösung:**
1. Prüfe Browser Console (F12) für Fehler
2. Prüfe Vercel Function Logs
3. Prüfe, ob Stripe Price IDs in `.env` korrekt sind
4. Prüfe, ob `STRIPE_SECRET_KEY` in Vercel gesetzt ist

### Problem: Webhook funktioniert nicht

**Lösung:**
1. Prüfe Vercel Logs für Webhook-Fehler
2. Prüfe, ob `STRIPE_WEBHOOK_SECRET` in Vercel gesetzt ist
3. Prüfe Webhook URL in Stripe Dashboard
4. Teste Webhook manuell in Stripe Dashboard → **Send test webhook**

### Problem: Subscription wird nicht aktualisiert

**Lösung:**
1. Prüfe, ob Webhook Events in Stripe ankommen
2. Prüfe Vercel Logs für Webhook-Verarbeitung
3. Prüfe, ob `SUPABASE_SERVICE_ROLE_KEY` in Vercel gesetzt ist
4. Prüfe Supabase Logs für Fehler

---

## ✅ Finale Checkliste

- [ ] Test 1: Registrierung funktioniert, Profil wird erstellt
- [ ] Test 2: Checkout funktioniert, Stripe Redirect funktioniert
- [ ] Test 3: Webhook verarbeitet Events, Daten werden aktualisiert
- [ ] Test 4: Subscription Management zeigt korrekte Daten
- [ ] Test 5: Payment Success Page funktioniert

## 🎉 Fertig!

Wenn alle Tests erfolgreich sind, ist deine SaaS-Plattform vollständig funktionsfähig!

Bei Problemen: Prüfe zuerst die Vercel Logs und Supabase Logs.

