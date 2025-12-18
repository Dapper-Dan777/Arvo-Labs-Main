# ✅ Finale Setup-Checkliste

Du hast bereits alle Konfigurationen gemacht. Hier ist die finale Checkliste, was noch zu tun ist:

## 🔴 KRITISCH: Supabase Schema ausführen

**Das ist der wichtigste Schritt!**

1. Gehe zu **Supabase Dashboard** → **SQL Editor**
2. Öffne die Datei `supabase-complete-schema.sql`
3. Kopiere den gesamten Inhalt
4. Füge ihn in den SQL Editor ein
5. Klicke **Run** (oder F5)
6. Warte auf Erfolgsmeldung

**Wichtig:** Das Script erstellt:
- ✅ `profiles` Tabelle (mit allen Feldern)
- ✅ `subscriptions` Tabelle
- ✅ RLS Policies
- ✅ Trigger für automatische Profil-Erstellung
- ✅ Funktionen für automatische Updates

## ✅ Bereits erledigt (von dir)

- ✅ Vercel Environment Variables gesetzt
- ✅ Supabase Anon Key in `.env` eingetragen
- ✅ Supabase Redirect URLs konfiguriert
- ✅ Stripe Webhook konfiguriert
- ✅ Stripe Webhook Events aktiviert

## 🔧 Code-Änderungen (von mir erledigt)

- ✅ API-Endpunkte verwenden jetzt `profiles` statt `user_profiles`
- ✅ Frontend-Code verwendet jetzt `profiles` statt `user_profiles`
- ✅ Alle Komponenten sind erstellt und integriert

## 🧪 Test-Checkliste

Nachdem du das Schema ausgeführt hast, teste folgendes:

### 1. Test Registrierung
- [ ] Gehe zu `/auth/sign-up`
- [ ] Registriere einen neuen User
- [ ] Prüfe in Supabase: **Table Editor** → **profiles**
- [ ] Es sollte automatisch ein Profil erstellt sein mit `plan: 'starter'`

### 2. Test Checkout
- [ ] Gehe zu `/preise`
- [ ] Wähle einen Plan (z.B. Pro)
- [ ] Klicke "Subscribe"
- [ ] Du wirst zu Stripe Checkout weitergeleitet
- [ ] Verwende Test-Karte: `4242 4242 4242 4242`
- [ ] Nach Zahlung: Redirect zu `/payment/success`
- [ ] Prüfe in Supabase: **profiles** Tabelle → `stripe_customer_id` sollte gesetzt sein
- [ ] Prüfe in Supabase: **subscriptions** Tabelle → Neuer Eintrag sollte vorhanden sein

### 3. Test Webhook
- [ ] Nach erfolgreichem Checkout
- [ ] Gehe zu Stripe Dashboard → **Webhooks** → **Events**
- [ ] Es sollten Events erscheinen:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.created`
- [ ] Prüfe in Supabase: **profiles** → `plan` sollte aktualisiert sein
- [ ] Prüfe in Supabase: **subscriptions** → Status sollte `active` sein

### 4. Test Subscription Management
- [ ] Gehe zu `/dashboard/billing`
- [ ] Du solltest deinen aktuellen Plan sehen
- [ ] Teste "Upgrade" Button
- [ ] Teste "Cancel Subscription" Button (falls vorhanden)

## 🐛 Troubleshooting

### Problem: "Profile not found" Fehler

**Lösung:**
1. Prüfe, ob die `profiles` Tabelle existiert (Supabase → Table Editor)
2. Prüfe, ob der Trigger `on_auth_user_created` existiert:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
3. Falls nicht: Führe das Schema-Script nochmal aus

### Problem: Webhook funktioniert nicht

**Lösung:**
1. Prüfe Vercel Logs: **Vercel Dashboard** → **Dein Projekt** → **Functions** → **Logs**
2. Prüfe, ob `STRIPE_WEBHOOK_SECRET` in Vercel gesetzt ist
3. Prüfe Webhook URL in Stripe Dashboard
4. Teste Webhook manuell in Stripe Dashboard → **Send test webhook**

### Problem: Checkout funktioniert nicht

**Lösung:**
1. Prüfe Browser Console (F12) für Fehler
2. Prüfe, ob Stripe Price IDs in `.env` korrekt sind
3. Prüfe, ob `STRIPE_SECRET_KEY` in Vercel gesetzt ist
4. Prüfe Vercel Function Logs

### Problem: "Table 'profiles' does not exist"

**Lösung:**
- Das Schema wurde noch nicht ausgeführt
- Führe `supabase-complete-schema.sql` im SQL Editor aus

## 📝 Wichtige Hinweise

1. **Tabellennamen:** Der Code verwendet jetzt `profiles` (nicht `user_profiles`)
2. **Automatische Profil-Erstellung:** Beim Registrieren wird automatisch ein Profil erstellt
3. **Webhook:** Aktualisiert automatisch `profiles.plan` und `subscriptions` Tabelle
4. **RLS Policies:** Nur der User selbst kann sein Profil sehen/bearbeiten

## 🎉 Fertig!

Wenn alle Tests erfolgreich sind, ist deine SaaS-Plattform vollständig eingerichtet!

Bei Problemen: Prüfe zuerst die Vercel Logs und Supabase Logs.

