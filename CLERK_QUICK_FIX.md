# Clerk Login funktioniert nicht - Quick Fix

## Problem
Der Clerk Login erscheint nicht, weil das Projekt noch mit **Vite** läuft, nicht mit **Next.js**.

## Lösung

### 1. Next.js Development Server starten

Stoppe den aktuellen Vite-Server (falls läuft) und starte Next.js:

```bash
# Stoppe Vite (Ctrl+C)

# Starte Next.js
npm run dev
```

**Wichtig:** Der `npm run dev` Befehl startet jetzt Next.js (Port 3000), nicht mehr Vite!

### 2. Prüfe .env.local

Stelle sicher, dass `.env.local` im Projekt-Root existiert mit:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm90YWJzS1tb25rZXktMjYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_PXqi6IM0cCQ83Xp06ILsaoZnVgn1mJNQHybTxjbXqH
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Browser öffnen

- Gehe zu: **http://localhost:3000** (nicht 8080!)
- Navigiere zu: **http://localhost:3000/sign-in**

### 4. Falls immer noch nicht funktioniert

#### Prüfe ob Next.js installiert ist:
```bash
npm list next
```

Falls nicht installiert:
```bash
npm install next@latest react@latest react-dom@latest
```

#### Prüfe ob Clerk installiert ist:
```bash
npm list @clerk/nextjs
```

Falls nicht installiert:
```bash
npm install @clerk/nextjs
```

#### Prüfe die Browser-Konsole
- Öffne Developer Tools (F12)
- Prüfe Console auf Fehler
- Prüfe Network Tab auf fehlgeschlagene Requests

### 5. Alternative: Vite weiter nutzen (nicht empfohlen)

Falls du vorerst bei Vite bleiben willst, kannst du die alte Route nutzen:
- **http://localhost:8080/auth/sign-in** (alte Supabase Auth)

Aber für Clerk brauchst du Next.js!

## Unterschiede

| Vite (alt) | Next.js (neu) |
|------------|---------------|
| Port 8080 | Port 3000 |
| `/auth/sign-in` | `/sign-in` |
| React Router | App Router |
| Supabase Auth | Clerk Auth |

## Nächste Schritte

1. ✅ Next.js starten: `npm run dev`
2. ✅ Browser: http://localhost:3000/sign-in
3. ✅ Clerk Login sollte erscheinen
4. ✅ Nach Login → Redirect zu /dashboard



