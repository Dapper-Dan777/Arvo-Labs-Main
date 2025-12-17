# Clerk Setup-Anleitung für Arvo Labs Dashboard

Diese Anleitung beschreibt alle notwendigen Einstellungen in Clerk, damit die Weiterleitung nach Registrierung/Login korrekt funktioniert.

## Übersicht

Das System leitet Benutzer nach Registrierung/Login wie folgt weiter:
1. **Neuer User ohne Plan** → Weiterleitung zur Billing-Seite (`/dashboard/billing`)
2. **User mit Plan** → Weiterleitung zum passenden Dashboard (`/dashboard/starter`, `/dashboard/pro`, etc.)
3. **Team-User ohne Organization** → Team-Erstellung
4. **Team-User mit Organization aber ohne Plan** → Weiterleitung zur Billing-Seite
5. **Team-User mit Plan** → Weiterleitung zum passenden Dashboard

---

## Schritt 1: Clerk Dashboard öffnen

1. Gehe zu [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Wähle dein Projekt aus

---

## Schritt 2: User Metadata (publicMetadata) konfigurieren

### ⚠️ WICHTIG: Metadata Schema existiert NICHT im Clerk Dashboard

**Clerk verwendet schemaless Metadata** - es gibt keine UI im Dashboard zum Konfigurieren eines Metadata-Schemas. Metadata wird ausschließlich programmatisch über die API oder Webhooks gesetzt.

### 2.1 Metadata-Struktur (nur zur Information)

Die folgenden Metadata-Felder werden verwendet:

#### Metadata-Feld: `plan`
- **Typ**: String
- **Mögliche Werte**: `starter`, `pro`, `enterprise`, `individual`
- **Standardwert**: `starter` (wird automatisch via Webhook gesetzt)

#### Metadata-Feld: `accountType` (optional)
- **Typ**: String
- **Mögliche Werte**: `individual`, `team`
- **Hinweis**: Wird automatisch erkannt, wenn der User zu einer Organization gehört

### 2.2 Metadata via Webhooks setzen (KRITISCH - Muss implementiert werden)

**🔴 KRITISCH: Webhook-Handler muss implementiert werden**

Ohne Webhook-Handler wird die `publicMetadata.plan` NICHT automatisch gesetzt, was bedeutet, dass die Weiterleitung nach Login/Sign-up nicht funktioniert.

**Siehe separate Anleitung:** `WEBHOOK_SETUP.md` für detaillierte Schritt-für-Schritt-Anleitung.

**Kurze Übersicht:**

1. **Für Vercel (Production)**: Die Datei `api/clerk/webhook.ts` wurde bereits erstellt
2. **Für lokale Entwicklung**: Verwende `api/clerk/webhook-nodejs.js` mit ngrok

**Webhook-Handler Code:**
Siehe `api/clerk/webhook.ts` für den vollständigen Webhook-Handler.

**Wichtig**: Die Plan IDs in `PLAN_MAPPING` müssen exakt mit deinen Clerk Plan IDs übereinstimmen:

```typescript
const PLAN_MAPPING = {
  'cplan_36wBO5cFvWQO0wk0scQFdkxTKIA': 'starter',
  'cplan_36wBaMbKGVXAr0axyDtzrL9IpL0': 'pro',
  'cplan_36wBjAYcrxMq3hFreVm5Lil4jSu': 'enterprise',
  // ... etc
};
```

**Option B: Manuell via Clerk Dashboard (Nur für Testing)**

1. Gehe zu **"Users"** im Clerk Dashboard
2. Wähle einen User aus
3. Gehe zu **"Metadata"** Tab
4. Füge in **"Public metadata"** hinzu:
   ```json
   {
     "plan": "pro"
   }
   ```
   
**⚠️ Hinweis**: Manuelle Einstellung ist nur für Testing gedacht. In Production sollte alles via Webhooks automatisch funktionieren.

---

## Schritt 3: Clerk Billing konfigurieren

### 3.1 Plans erstellen

1. Gehe zu **"Billing"** → **"Plans"** im Clerk Dashboard
2. Erstelle folgende Plans:

#### Individual Plans:
- **Starter Plan**
  - Plan ID: `cplan_36wBO5cFvWQO0wk0scQFdkxTKIA` (oder generiere neue)
  - Preis: 0€ (kostenlos)
  
- **Pro Plan**
  - Plan ID: `cplan_36wBaMbKGVXAr0axyDtzrL9IpL0` (oder generiere neue)
  - Preis: 29€/Monat
  
- **Enterprise Plan**
  - Plan ID: `cplan_36wBjAYcrxMq3hFreVm5Lil4jSu` (oder generiere neue)
  - Preis: 150€/Monat

#### Team Plans:
- **Team Starter Plan**
  - Plan ID: `cplan_36wCRSd1BPN9poL5zFMdmSmkoa6` (oder generiere neue)
  - Preis: 0€ (kostenlos)
  
- **Team Pro Plan**
  - Plan ID: `cplan_36wCbGG0jTzcaiOTDS07ECBTkxj` (oder generiere neue)
  - Preis: 29€/Monat
  
- **Team Enterprise Plan**
  - Plan ID: `cplan_36wCgfLxZnWXgz93DYBXExx36O8` (oder generiere neue)
  - Preis: 150€/Monat

### 3.2 Plan IDs aktualisieren

**WICHTIG**: Nachdem du die Plans erstellt hast, musst du die Plan IDs in deinem Code aktualisieren:

1. Öffne `src/lib/clerk-billing.ts`
2. Ersetze die Plan IDs mit den tatsächlichen IDs aus deinem Clerk Dashboard:

```typescript
export const USER_PLAN_IDS = {
  starter: "DEINE_STARTER_PLAN_ID",
  pro: "DEINE_PRO_PLAN_ID",
  enterprise: "DEINE_ENTERPRISE_PLAN_ID",
} as const;

export const ORG_PLAN_IDS = {
  team_starter: "DEINE_TEAM_STARTER_PLAN_ID",
  team_pro: "DEINE_TEAM_PRO_PLAN_ID",
  team_enterprise: "DEINE_TEAM_ENTERPRISE_PLAN_ID",
} as const;
```

---

## Schritt 4: Redirect URLs konfigurieren

### ⚠️ WICHTIG: Redirect URLs existieren NICHT mehr im modernen Clerk Dashboard

**Redirect URLs werden über Environment Variables oder Props im Code konfiguriert** - nicht mehr über das Dashboard.

### 4.1 In main.tsx (bereits konfiguriert ✅)

Die Redirect URLs sind bereits in `src/main.tsx` konfiguriert:
```typescript
<ClerkProvider 
  publishableKey={PUBLISHABLE_KEY} 
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
  afterSignOutUrl="/"
>
```

---

## Schritt 5: Organizations aktivieren (für Teams)

1. Gehe zu **"User & Authentication"** → **"Organizations"**
2. Aktiviere **"Organizations"**
3. Konfiguriere:
   - **"Allow users to create organizations"**: ✅ Aktiviert
   - **"Maximum members per organization"**: Nach Bedarf (z.B. 100)
   - **"Admin roles"**: Optional konfigurieren

---

## Schritt 6: Webhooks für automatische Plan-Zuweisung (🔴 KRITISCH - Muss implementiert werden)

### ⚠️ WICHTIG: Webhooks sind NICHT optional!

Ohne Webhooks wird die `publicMetadata.plan` NICHT automatisch gesetzt, was bedeutet:
- Neue User haben keinen Plan gesetzt
- Nach Checkout wird der Plan nicht aktualisiert
- Die Weiterleitung nach Login funktioniert nicht korrekt

### 6.1 Webhook-Endpoint erstellen

**Siehe separate Anleitung:** `WEBHOOK_SETUP.md` für detaillierte Schritt-für-Schritt-Anleitung.

**Kurze Übersicht:**
- **Für Vercel**: `api/clerk/webhook.ts` wurde bereits erstellt
- **Für lokale Entwicklung**: `api/clerk/webhook-nodejs.js` mit ngrok

**Benötigte Events:**
- ✅ `user.created` - Setzt Default Plan auf 'starter'
- ✅ `checkout.session.completed` - Setzt Plan basierend auf gekauftem Plan
- ✅ `organization.created` - Optional, für Team-Logik
- ✅ `organizationMembership.created` - Optional, für Team-Logik

### 6.2 Webhook-Handler Code

```typescript
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/clerk-react/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    return new Response('Error occured', { status: 400 });
  }

  const eventType = evt.type;
  const { id, ...data } = evt.data;

  // Plan-Zuweisung nach Checkout
  if (eventType === 'checkout.session.completed') {
    const userId = data.userId || data.user_id;
    const planId = data.planId || data.plan_id;
    
    const planMapping: Record<string, string> = {
      'cplan_36wBO5cFvWQO0wk0scQFdkxTKIA': 'starter',
      'cplan_36wBaMbKGVXAr0axyDtzrL9IpL0': 'pro',
      'cplan_36wBjAYcrxMq3hFreVm5Lil4jSu': 'enterprise',
      'cplan_36wCRSd1BPN9poL5zFMdmSmkoa6': 'starter', // Team Starter
      'cplan_36wCbGG0jTzcaiOTDS07ECBTkxj': 'pro', // Team Pro
      'cplan_36wCgfLxZnWXgz93DYBXExx36O8': 'enterprise', // Team Enterprise
    };
    
    const plan = planMapping[planId] || 'starter';
    
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { plan }
    });
  }

  // Default Plan für neue User
  if (eventType === 'user.created') {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: { plan: 'starter' }
    });
  }

  return new Response('', { status: 200 });
}
```

### 6.3 Webhook in Clerk konfigurieren

**Siehe `WEBHOOK_SETUP.md` für detaillierte Anleitung.**

**Kurze Zusammenfassung:**

1. Gehe zu **"Developers"** → **"Webhooks"** im Clerk Dashboard
2. Klicke auf **"+ Add Endpoint"**
3. Gib deine Webhook-URL ein:
   - **Production (Vercel)**: `https://deine-domain.vercel.app/api/clerk/webhook`
   - **Lokal (ngrok)**: `https://abc123.ngrok.io/webhook`
4. Wähle folgende Events:
   - ✅ `user.created`
   - ✅ `checkout.session.completed`
   - ✅ `organization.created` (optional)
   - ✅ `organizationMembership.created` (optional)
5. Klicke auf **"Create"**
6. **Kopiere den Webhook Secret** (beginnt mit `whsec_`)
7. Speichere ihn als `CLERK_WEBHOOK_SECRET` in deiner `.env` oder Vercel Environment Variables

---

## Schritt 7: Environment Variables

Stelle sicher, dass folgende Environment Variables gesetzt sind:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_WEBHOOK_SECRET=whsec_... (für Backend)
```

---

## Schritt 8: Testing

### Test-Szenarien:

1. **Neuer User registriert sich:**
   - ✅ Sollte zu `/dashboard/billing` weitergeleitet werden
   - ✅ Nach Plan-Auswahl sollte zu `/dashboard/{plan}` weitergeleitet werden

2. **User mit Plan loggt sich ein:**
   - ✅ Sollte direkt zu `/dashboard/{plan}` weitergeleitet werden

3. **Team-User ohne Organization:**
   - ✅ Sollte Team-Erstellung sehen
   - ✅ Nach Team-Erstellung sollte zu `/dashboard/billing` weitergeleitet werden

4. **Team-User mit Organization aber ohne Plan:**
   - ✅ Sollte zu `/dashboard/billing` weitergeleitet werden
   - ✅ Nach Plan-Auswahl sollte zu `/dashboard/{plan}` weitergeleitet werden

---

## Wichtige Hinweise

1. **Plan IDs müssen übereinstimmen**: Die Plan IDs in `src/lib/clerk-billing.ts` müssen exakt mit den Plan IDs in Clerk übereinstimmen.

2. **Metadata wird nicht automatisch gesetzt**: Ohne Webhook-Handler wird der Plan nicht automatisch in den Metadata gesetzt. Du musst entweder:
   - Einen Webhook-Handler implementieren (empfohlen)
   - Oder die Metadata manuell im Clerk Dashboard setzen

3. **Team-Erkennung**: Das System erkennt automatisch, ob ein User zu einer Organization gehört. Falls nicht, wird `accountType: 'individual'` verwendet.

4. **Starter Plan als Default**: Wenn kein Plan gesetzt ist, wird `starter` als Default verwendet. Das System behandelt `starter` als "kein Plan gewählt" und leitet zur Billing-Seite weiter.

---

## Troubleshooting

### Problem: User wird nicht weitergeleitet
- ✅ Prüfe ob `publicMetadata.plan` gesetzt ist
- ✅ Prüfe die Browser-Konsole auf Fehler
- ✅ Prüfe ob die Redirect URLs in Clerk korrekt konfiguriert sind

### Problem: Plan wird nicht gesetzt nach Checkout
- ✅ Prüfe ob der Webhook korrekt konfiguriert ist
- ✅ Prüfe ob der Webhook-Handler die Plan IDs korrekt mappt
- ✅ Prüfe die Webhook-Logs im Clerk Dashboard

### Problem: Team-Erkennung funktioniert nicht
- ✅ Prüfe ob Organizations in Clerk aktiviert sind
- ✅ Prüfe ob der User zu einer Organization gehört (`user.organizationMemberships`)

---

## Support

Bei Fragen oder Problemen:
1. Prüfe die Clerk-Dokumentation: [https://clerk.com/docs](https://clerk.com/docs)
2. Prüfe die Webhook-Logs im Clerk Dashboard
3. Prüfe die Browser-Konsole auf Fehler

