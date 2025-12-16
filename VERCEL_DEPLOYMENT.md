# Vercel Deployment Anleitung

## Problem: Weiße Seite nach Deployment

Wenn deine Website auf Vercel weiß angezeigt wird, liegt das meist an fehlenden Umgebungsvariablen oder Build-Fehlern.

## Lösung

### 1. Umgebungsvariablen in Vercel setzen

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Settings** → **Environment Variables**
4. Füge folgende Umgebungsvariable hinzu:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YWJsZS1jcmF3ZGFkLTcuY2xlcmsuYWNjb3VudHMuZGV2JA
```

**Wichtig:**
- Setze die Variable für **Production**, **Preview** und **Development**
- Verwende deinen echten Clerk Publishable Key (nicht den Test-Key, wenn du in Production bist)

### 2. Build-Logs überprüfen

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt → **Deployments**
3. Klicke auf das neueste Deployment
4. Prüfe die **Build Logs** auf Fehler

### 3. Browser-Konsole prüfen

1. Öffne deine deployed Website
2. Öffne die Browser-Konsole (F12)
3. Prüfe auf JavaScript-Fehler

### 4. Neues Deployment auslösen

Nach dem Setzen der Umgebungsvariablen:
1. Gehe zu **Deployments**
2. Klicke auf **Redeploy** beim neuesten Deployment
3. Oder pushe einen neuen Commit

## Häufige Probleme

### Problem: "Missing Clerk Publishable Key"
**Lösung:** Setze `VITE_CLERK_PUBLISHABLE_KEY` in Vercel Environment Variables

### Problem: Routing funktioniert nicht
**Lösung:** Die `vercel.json` ist bereits korrekt konfiguriert mit Rewrites

### Problem: Assets werden nicht geladen
**Lösung:** Prüfe, ob der Build erfolgreich war und ob alle Assets im `dist` Ordner sind

## Build-Konfiguration

Die `vercel.json` ist bereits korrekt konfiguriert:
- Build Command: `npm run build`
- Output Directory: `dist`
- Rewrites für React Router sind konfiguriert

## Testen

Nach dem Deployment:
1. Prüfe, ob die Website lädt
2. Teste die Navigation zwischen Seiten
3. Prüfe, ob Clerk-Authentifizierung funktioniert
4. Prüfe die Browser-Konsole auf Fehler

