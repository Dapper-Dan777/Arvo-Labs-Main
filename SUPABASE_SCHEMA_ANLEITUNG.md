# 📋 Supabase Schema ausführen - Schritt für Schritt

## 🎯 Ziel
Das Schema-Script in Supabase ausführen, um die `profiles` und `subscriptions` Tabellen zu erstellen.

## 📝 Schritt-für-Schritt Anleitung

### Schritt 1: Datei öffnen
1. Öffne die Datei `supabase-complete-schema.sql` in deinem Projekt
2. Markiere **ALLES** (Strg+A / Cmd+A)
3. Kopiere es (Strg+C / Cmd+C)

### Schritt 2: Supabase Dashboard öffnen
1. Gehe zu [supabase.com](https://supabase.com)
2. Logge dich ein
3. Wähle dein Projekt aus (Arvo Labs / wncuwnignndwooeazhwr)

### Schritt 3: SQL Editor öffnen
1. Klicke in der linken Sidebar auf **SQL Editor**
2. Klicke auf **New query** (oder das "+" Symbol)

### Schritt 4: Script einfügen
1. Füge den kopierten Inhalt in den SQL Editor ein (Strg+V / Cmd+V)
2. Du solltest jetzt das komplette SQL-Script sehen

### Schritt 5: Script ausführen
1. Klicke auf den Button **Run** (rechts oben)
   - Oder drücke **F5**
   - Oder drücke **Strg+Enter** / **Cmd+Enter**
2. Warte auf die Erfolgsmeldung

### Schritt 6: Erfolg prüfen
1. Gehe zu **Table Editor** (linke Sidebar)
2. Du solltest jetzt sehen:
   - ✅ `profiles` Tabelle
   - ✅ `subscriptions` Tabelle

## ✅ Was das Script erstellt

- **profiles** Tabelle:
  - `id` (UUID, Primary Key)
  - `plan` (TEXT, Default: 'starter')
  - `account_type` (TEXT, Default: 'individual')
  - `stripe_customer_id` (TEXT)
  - `subscription_plan` (TEXT)
  - `usage_limit` (INTEGER)
  - `full_name`, `avatar_url`, `username` (TEXT)
  - `created_at`, `updated_at` (TIMESTAMP)

- **subscriptions** Tabelle:
  - `id` (UUID)
  - `user_id` (UUID)
  - `stripe_customer_id` (TEXT)
  - `stripe_subscription_id` (TEXT)
  - `plan_id` (TEXT)
  - `status` (TEXT)
  - `current_period_start`, `current_period_end` (TIMESTAMP)
  - `cancel_at_period_end` (BOOLEAN)

- **RLS Policies**: Nur der User selbst kann sein Profil sehen/bearbeiten
- **Trigger**: Automatische Profil-Erstellung bei Registrierung
- **Funktionen**: Automatische Updates

## 🐛 Falls Fehler auftreten

### Fehler: "relation already exists"
**Lösung:** Die Tabellen existieren bereits. Das ist OK, das Script verwendet `IF NOT EXISTS`.

### Fehler: "function already exists"
**Lösung:** Die Funktionen existieren bereits. Das ist OK, das Script verwendet `CREATE OR REPLACE`.

### Fehler: "permission denied"
**Lösung:** 
- Prüfe, ob du als Projekt-Owner eingeloggt bist
- Prüfe, ob du die richtigen Berechtigungen hast

### Fehler: "extension uuid-ossp does not exist"
**Lösung:** 
- Das sollte nicht passieren, da Supabase das standardmäßig hat
- Falls doch: Kontaktiere Supabase Support

## 📸 Screenshot-Hinweise

Nach dem Ausführen solltest du in **Table Editor** sehen:

```
profiles
├── id (uuid)
├── plan (text)
├── account_type (text)
├── stripe_customer_id (text)
└── ...

subscriptions
├── id (uuid)
├── user_id (uuid)
├── stripe_customer_id (text)
└── ...
```

## ✅ Checkliste

- [ ] Datei `supabase-complete-schema.sql` geöffnet
- [ ] Kompletter Inhalt kopiert
- [ ] Supabase Dashboard geöffnet
- [ ] SQL Editor geöffnet
- [ ] Script eingefügt
- [ ] Script ausgeführt (Run / F5)
- [ ] Erfolgsmeldung erhalten
- [ ] Tabellen in Table Editor geprüft

## 🎉 Fertig!

Wenn du die Tabellen siehst, ist das Schema erfolgreich ausgeführt!

Jetzt kannst du mit dem Testen beginnen (siehe `FINAL_SETUP_CHECKLIST.md`).

