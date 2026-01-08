# Clerk + Next.js App Router Integration

## ✅ Erstellte Dateien

### 1. `.env.local`
Erstelle diese Datei im Projekt-Root mit folgenden Inhalten:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm90YWJzS1tb25rZXktMjYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_PXqi6IM0cCQ83Xp06ILsaoZnVgn1mJNQHybTxjbXqH
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Configuration (falls bereits vorhanden, behalten)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### 2. `app/layout.tsx`
Root-Layout mit ClerkProvider Integration

### 3. `app/providers.tsx`
Client-Side Provider für Theme, Language, React Query

### 4. `middleware.ts`
Middleware für geschützte Routen (`/dashboard(.*)`)

### 5. `app/sign-in/[[...sign-in]]/page.tsx`
Sign-In Seite mit Clerk Component

### 6. `app/sign-up/[[...sign-up]]/page.tsx`
Sign-Up Seite mit Clerk Component

### 7. `app/dashboard/page.tsx`
Dashboard-Seite mit Plan-Logik (Starter, Pro, Enterprise, Individual)

### 8. `app/globals.css`
Globale CSS-Datei für Next.js

### 9. `next.config.js`
Next.js Konfiguration

## 📦 Package Installation

Füge folgende Packages zu deiner `package.json` hinzu:

```bash
npm install @clerk/nextjs next@latest react@latest react-dom@latest
```

Oder manuell in `package.json`:

```json
{
  "dependencies": {
    "@clerk/nextjs": "^5.0.0",
    "next": "^14.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

## 🔄 Migration von Vite zu Next.js

**WICHTIG:** Das Projekt verwendet aktuell Vite + React Router. Für die vollständige Migration zu Next.js App Router müssen folgende Schritte durchgeführt werden:

1. **Package.json aktualisieren:**
   - Next.js Scripts hinzufügen
   - Vite Scripts entfernen oder als Backup behalten

2. **Routing migrieren:**
   - React Router Routes → Next.js App Router Struktur
   - `src/pages/*` → `app/*/page.tsx`

3. **Komponenten anpassen:**
   - Client Components mit `"use client"` markieren
   - Server Components wo möglich nutzen

## 🧪 Test-Checkliste

### Lokale Entwicklung

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Development Server starten:**
   ```bash
   npm run dev
   # Oder für Next.js:
   npx next dev
   ```

3. **Browser öffnen:**
   - http://localhost:3000 (Next.js)
   - Oder http://localhost:8080 (Vite, falls noch aktiv)

4. **Sign-In testen:**
   - Navigiere zu `/sign-in`
   - Erstelle einen Test-Account oder logge dich ein
   - Sollte automatisch zu `/dashboard` weiterleiten

5. **Dashboard testen:**
   - Prüfe, ob der Plan korrekt angezeigt wird
   - Teste die Begrüßung mit Vorname

6. **Protected Routes testen:**
   - Versuche ohne Login auf `/dashboard` zuzugreifen
   - Sollte zu `/sign-in` weiterleiten

## 📝 Plan-Verwaltung

Pläne werden aus `user.publicMetadata.plan` gelesen. Um einen Plan zu setzen:

1. In Clerk Dashboard → Users → User auswählen
2. Public Metadata → `plan` hinzufügen
3. Wert: `"starter"`, `"pro"`, `"enterprise"` oder `"individual"`

Oder programmatisch via Clerk API:

```typescript
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    plan: "pro"
  }
});
```

## 🚀 Nächste Schritte

1. **Weitere Dashboard-Routen erstellen:**
   - `app/dashboard/starter/page.tsx`
   - `app/dashboard/pro/page.tsx`
   - `app/dashboard/enterprise/page.tsx`
   - `app/dashboard/individual/page.tsx`

2. **Marketing-Seiten migrieren:**
   - Bestehende `src/pages/*` nach `app/*/page.tsx` migrieren

3. **Supabase Integration:**
   - Falls Supabase weiterhin genutzt wird, in Server Components integrieren

## ⚠️ Wichtige Hinweise

- **Middleware:** Die Middleware schützt automatisch alle `/dashboard(.*)` Routen
- **Public Routes:** Alle Marketing-Seiten sind öffentlich zugänglich
- **Client Components:** ThemeProvider, LanguageProvider müssen "use client" sein
- **Server Components:** Dashboard-Seite ist ein Server Component (kann `currentUser` direkt nutzen)



