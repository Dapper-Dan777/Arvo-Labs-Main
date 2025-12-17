# Clerk Setup Status für Arvo Labs Dashboard

**Überprüfungsdatum**: 17. Dezember 2025, 5:00 Uhr CET  
**Projekt**: Arvo Labs Dashboard mit Billing-Integration

---

## ✅ BEREITS ERLEDIGT IM CLERK DASHBOARD

### 1. Clerk Billing - Subscription Plans

Alle benötigten Plans sind erstellt und konfiguriert:

#### Individual/User Plans:

✅ **Starter Plan**
- Plan ID: `cplan_36wBO5cFvWQO0wk0scQFdkxTKIA`
- Key: `starter`
- Preis: $12.00/Monat
- Trial: 3 Tage

✅ **Pro Plan**
- Plan ID: `cplan_36wBaMbKGVXAr0axyDtzrL9IpL0`
- Key: `pro`
- Preis: $34.10/Monat
- Trial: 7 Tage

✅ **Enterprise Plan**
- Plan ID: `cplan_36wBjAYcrxMq3hFreVm5Lil4jSu`
- Key: `enterprise`
- Preis: $176.60/Monat
- Trial: 7 Tage

#### Team/Organization Plans:

✅ **Team Starter Plan**
- Plan ID: `cplan_36wCRSd1BPN9poL5zFMdmSmkoa6`
- Key: `team_starter`
- Trial: 3 Tage

✅ **Team Pro Plan**
- Plan ID: `cplan_36wCbGG0jTzcaiOTDS07ECBTkxj`
- Key: `team_pro`
- Trial: 7 Tage

✅ **Team Enterprise Plan**
- Plan ID: `cplan_36wCgfLxZnWXgz93DYBXExx36O8`
- Key: `team_enterprise`
- Trial: 7 Tage

**✅ Hinweis**: Diese Plan IDs stimmen exakt mit den IDs in `src/lib/clerk-billing.ts` überein!

---

### 2. Organizations (für Teams)

Organizations sind aktiviert und konfiguriert:

✅ "Allow personal accounts" aktiviert  
✅ "Allow user-created organizations" aktiviert  
✅ Membership limit: 5 members  
✅ "Allow users to delete their accounts" aktiviert

---

### 3. User & Authentication

Basis-Authentifizierung ist konfiguriert:

✅ Email Sign-up aktiviert  
✅ Email-Verifizierung aktiviert  
✅ Username Support aktiviert  
✅ Password Authentication aktiviert

---

## ❌ NOCH ZU ERLEDIGEN

### 🔴 KRITISCH: Webhooks für automatische Metadata-Verwaltung

**Problem**: Ohne Webhooks wird die `publicMetadata.plan` nicht automatisch gesetzt, was bedeutet, dass die Weiterleitung nach Login/Sign-up nicht funktioniert.

**Status**: 
- ✅ Webhook-Handler Code wurde erstellt (`api/clerk/webhook.ts` und `api/clerk/webhook-nodejs.js`)
- ❌ Webhook muss noch in Clerk Dashboard registriert werden
- ❌ Dependencies müssen noch installiert werden

**Was du jetzt tun musst:**

#### Schritt 1: Dependencies installieren

```bash
# Für Vercel (Production)
npm install svix @clerk/nextjs

# ODER für Node.js Server (lokale Entwicklung)
npm install svix @clerk/clerk-sdk-node express
```

#### Schritt 2: Webhook in Clerk Dashboard registrieren

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com) → **"Developers"** → **"Webhooks"**
2. Klicke auf **"+ Add Endpoint"**
3. Trage deine Webhook-URL ein:
   - **Production (Vercel)**: `https://deine-domain.vercel.app/api/clerk/webhook`
   - **Lokal (ngrok)**: `https://abc123.ngrok.io/webhook` (siehe `WEBHOOK_SETUP.md`)
4. Wähle folgende Events:
   - ✅ `user.created`
   - ✅ `checkout.session.completed`
   - ✅ `organization.created` (optional)
   - ✅ `organizationMembership.created` (optional)
5. Klicke auf **"Create"**
6. **Kopiere den Webhook Secret** (beginnt mit `whsec_`)
7. Füge ihn zu deinen Environment Variables hinzu:
   - **Vercel**: Settings → Environment Variables → `CLERK_WEBHOOK_SECRET`
   - **Lokal**: `.env` Datei → `CLERK_WEBHOOK_SECRET=whsec_...`

#### Schritt 3: Testing

Siehe `WEBHOOK_SETUP.md` für detaillierte Testing-Anleitung.

---

## 📝 WICHTIGE HINWEISE

### Metadata Schema - WICHTIG!

⚠️ **Die Cursor-Anleitung erwähnt "User & Authentication → Metadata", aber dieser Bereich existiert NICHT im Clerk Dashboard**

- Clerk verwendet **schemaless Metadata** (du kannst beliebige JSON-Daten speichern)
- Metadata wird ausschließlich programmatisch über die API oder Webhooks gesetzt
- Es gibt **KEINE UI** im Dashboard zum Konfigurieren eines Metadata-Schemas

### Redirect URLs

⚠️ **Die Cursor-Anleitung erwähnt "Paths → Redirect URLs", aber dieser Bereich existiert NICHT mehr im modernen Clerk Dashboard**

- Redirect URLs werden über Environment Variables oder Props im Code konfiguriert
- Du hast das bereits korrekt in `main.tsx` mit `afterSignInUrl="/dashboard"` gemacht ✅

### Testing mit lokaler Entwicklung

Für lokale Webhook-Tests brauchst du:

1. **ngrok** oder **Cloudflare Tunnel** um deinen localhost öffentlich zugänglich zu machen
2. Befehl: `ngrok http 8080` (oder dein lokaler Port)
3. Die ngrok-URL dann im Clerk Dashboard als Webhook-Endpoint eintragen

**Siehe `WEBHOOK_SETUP.md` für detaillierte Anleitung.**

---

## 🎯 NÄCHSTE SCHRITTE - PRIORITÄT

1. **[KRITISCH]** Dependencies installieren: `npm install svix @clerk/nextjs`
2. **[KRITISCH]** Webhook im Clerk Dashboard registrieren (siehe Schritt 2 oben)
3. **[KRITISCH]** Webhook Secret zu Environment Variables hinzufügen
4. **[EMPFOHLEN]** Webhook lokal mit ngrok testen (siehe `WEBHOOK_SETUP.md`)
5. **[OPTIONAL]** Zusätzliche Event-Handler für `organizationMembership.created` hinzufügen

---

## ✅ TESTING CHECKLIST

Nach Webhook-Implementierung teste:

- [ ] **Neuer User ohne Plan:**
  - [ ] Registrierung durchführen
  - [ ] Prüfen ob `publicMetadata.plan = 'starter'` gesetzt wurde
  - [ ] Sollte zu `/dashboard/billing` weitergeleitet werden

- [ ] **User kauft Plan:**
  - [ ] Checkout-Flow durchlaufen
  - [ ] Prüfen ob `publicMetadata.plan` aktualisiert wurde (z.B. zu `'pro'`)
  - [ ] Sollte zu `/dashboard/pro` weitergeleitet werden

- [ ] **Team-User:**
  - [ ] Organization erstellen
  - [ ] Prüfen ob Organization-Metadata gesetzt wurde
  - [ ] Team-Billing testen

---

## 📚 Weitere Ressourcen

- **Webhook Setup**: Siehe `WEBHOOK_SETUP.md`
- **Clerk Setup**: Siehe `CLERK_SETUP_ANLEITUNG.md`
- [Clerk Webhooks Dokumentation](https://clerk.com/docs/integrations/webhooks/overview)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)

