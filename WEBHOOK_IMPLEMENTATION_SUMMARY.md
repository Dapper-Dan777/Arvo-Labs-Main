# Webhook-Implementation & Onboarding - Zusammenfassung

## ✅ Implementierte Features

### 1. Webhook-Handler erweitert (`/app/api/webhooks/clerk/route.ts`)

**Bereits vorhanden:**
- ✅ Subscription Events (subscription.created, subscription.updated, checkout.session.completed)
- ✅ Automatische Organization-Erstellung für Team-Pläne
- ✅ User Metadata Updates

**Neu hinzugefügt:**
- ✅ `organization.created` → Speichert Organization in Supabase
- ✅ `organization.updated` → Aktualisiert Organization in Supabase
- ✅ `organization.deleted` → Löscht Organization aus Supabase
- ✅ `organizationMembership.created` → Speichert Membership in Supabase
- ✅ `organizationMembership.updated` → Aktualisiert Membership in Supabase
- ✅ `organizationMembership.deleted` → Löscht Membership aus Supabase
- ✅ `subscription.active` → Setzt subscription_status auf "active"
- ✅ `subscription.pastDue` → Setzt subscription_status auf "past_due"
- ✅ `user.created` → Speichert User in Supabase
- ✅ `user.updated` → Aktualisiert User in Supabase
- ✅ Subscription Sync → Synchronisiert subscription_tier zu Supabase

### 2. Onboarding-Seite (`/app/onboarding/page.tsx`)

**Funktionalität:**
- ✅ Prüft ob User Teil einer Organization ist
- ✅ Weiterleitung zu `/dashboard/org/${orgId}` wenn Organization vorhanden
- ✅ Weiterleitung zu `/dashboard/user` wenn keine Organization
- ✅ Loading-State mit Spinner
- ✅ Clean UI mit Shadcn/UI Komponenten

### 3. Dashboard-Placeholder-Seiten

**Erstellt:**
- ✅ `/app/(app)/dashboard/user/page.tsx` - Individual User Dashboard
- ✅ `/app/(app)/dashboard/org/[orgId]/page.tsx` - Organization Dashboard

**Features:**
- ✅ Zeigen User/Organization Informationen
- ✅ "Coming Soon" Message
- ✅ Verwenden DashboardLayout für konsistentes Design

## 📋 Environment Variables

### Erforderliche Variablen in `.env.local`:

```env
# Clerk
CLERK_WEBHOOK_SECRET=whsec_4uHxj5coL7H1TfKu6XMvzARTzqvRjBT9
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase (für Webhook)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (Service Role Key, NICHT anon key!)
```

## 🗄️ Datenbankstruktur

### Erforderliche Tabellen in Supabase:

**`users`:**
```sql
- id (uuid, primary key)
- clerk_id (text, unique)
- email (text)
- name (text)
- subscription_tier (text)
- subscription_status (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**`organizations`:**
```sql
- id (uuid, primary key)
- clerk_org_id (text, unique)
- name (text)
- subscription_tier (text)
- subscription_status (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**`organization_memberships`:**
```sql
- id (uuid, primary key)
- organization_id (uuid, FK zu organizations.id)
- user_id (uuid, FK zu users.id)
- role (text)
- created_at (timestamp)
```

## 🔧 Setup-Schritte

### 1. Environment Variables setzen

Füge die oben genannten Variablen zu `.env.local` hinzu.

### 2. Supabase Tabellen erstellen

Führe das SQL-Script in Supabase SQL Editor aus (siehe `supabase-complete-schema.sql`).

### 3. Webhook in Clerk Dashboard einrichten

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com) → **Developers** → **Webhooks**
2. Klicke auf **"+ Add Endpoint"**
3. **Endpoint URL**: `https://deine-domain.vercel.app/api/webhooks/clerk`
4. **Events auswählen**:
   - ✅ `organization.created`
   - ✅ `organization.updated`
   - ✅ `organization.deleted`
   - ✅ `organizationMembership.created`
   - ✅ `organizationMembership.updated`
   - ✅ `organizationMembership.deleted`
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscription.active`
   - ✅ `subscription.pastDue`
   - ✅ `user.created`
   - ✅ `user.updated`
5. Klicke auf **"Create"**
6. **Kopiere den Webhook Secret** (beginnt mit `whsec_`)
7. Füge ihn in `.env.local` als `CLERK_WEBHOOK_SECRET` ein

### 4. Clerk Redirect URLs anpassen

In Clerk Dashboard → **Settings** → **Paths**:
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding`

## 🧪 Testing

### 1. Webhook Testing

1. Gehe zu Clerk Dashboard → **Developers** → **Webhooks** → **Testing**
2. Wähle ein Event (z.B. `user.created`)
3. Klicke auf **"Send test event"**
4. Prüfe Vercel Logs oder Supabase Tabelle

### 2. Onboarding Flow Testing

1. Erstelle einen neuen User über Sign-Up
2. Nach Sign-Up sollte automatisch zu `/onboarding` weitergeleitet werden
3. Onboarding-Seite sollte prüfen und weiterleiten:
   - Wenn Organization → `/dashboard/org/{orgId}`
   - Wenn keine Organization → `/dashboard/user`

### 3. Database Sync Testing

1. Erstelle einen User in Clerk
2. Prüfe ob User in Supabase `users` Tabelle erscheint
3. Erstelle eine Organization in Clerk
4. Prüfe ob Organization in Supabase `organizations` Tabelle erscheint
5. Füge User zu Organization hinzu
6. Prüfe ob Membership in Supabase `organization_memberships` Tabelle erscheint

## 📝 Wichtige Hinweise

1. **Service Role Key**: Verwende NUR den Service Role Key für Webhooks, NICHT den anon key!
2. **Error-Handling**: Alle Webhook-Events haben try-catch, Fehler werden geloggt aber nicht weitergegeben (verhindert Retries)
3. **Idempotency**: Webhooks können mehrmals feuern, aber die Datenbank-Operationen sind idempotent (upsert statt insert)
4. **Race Conditions**: Beim Erstellen von Organizations/Memberships kann es zu Race Conditions kommen, aber die Prüfungen minimieren das Risiko

## 🚀 Nächste Schritte

1. ✅ Environment Variables setzen
2. ✅ Supabase Tabellen erstellen
3. ✅ Webhook in Clerk Dashboard einrichten
4. ✅ Testen mit Clerk's Webhook Testing Tool
5. ✅ Onboarding Flow testen

