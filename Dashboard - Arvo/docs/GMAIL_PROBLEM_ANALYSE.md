# Gmail OAuth Problem - Analyse

## 🔍 Das eigentliche Problem

Der "invalid_client" Fehler bedeutet, dass Google die Client ID nicht findet. Das passiert, wenn:

1. **Die Client ID in der URL stimmt nicht mit Google Cloud Console überein**
2. **Die Redirect URI stimmt nicht überein**
3. **Die Client ID existiert nicht in Google Cloud Console**

## ✅ Lösung: Network-Tab prüfen

### Schritt 1: Network-Tab öffnen

1. Öffnen Sie DevTools: `F12`
2. Wechseln Sie zum Tab **"Network"**
3. **WICHTIG**: Aktivieren Sie "Preserve log" (oben in der Network-Toolbar)

### Schritt 2: Auf "Gmail verbinden" klicken

1. Klicken Sie auf "Gmail verbinden"
2. Sie werden zu Google weitergeleitet (oder sehen den Fehler)

### Schritt 3: Die OAuth-URL prüfen

1. In der Network-Tab suchen Sie nach einer Anfrage zu `accounts.google.com`
2. Klicken Sie darauf
3. Schauen Sie sich die **URL** an (im "Headers" Tab oder "Request URL")

**Die URL sollte so aussehen:**
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com&redirect_uri=http://localhost:5173/auth/callback&...
```

### Schritt 4: Prüfen Sie die Client ID in der URL

**Falls die URL die ALTE Client ID enthält:**
```
client_id=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
```
→ Das bedeutet: Die Environment Variable wird nicht geladen!

**Lösung:**
1. Prüfen Sie `.env.local` - enthält sie die neue Client ID?
2. **Dev Server KOMPLETT neu starten:**
   - Stoppen Sie den Server (`Ctrl+C`)
   - Warten Sie 5 Sekunden
   - Starten Sie ihn neu: `npm run dev`
3. Browser Cache leeren: `Ctrl+Shift+R`

**Falls die URL die NEUE Client ID enthält:**
```
client_id=633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
```
→ Das bedeutet: Die Client ID wird korrekt geladen, aber Google findet sie nicht!

**Lösung:**
1. Prüfen Sie Google Cloud Console:
   - Gehen Sie zu: https://console.cloud.google.com/apis/credentials
   - Suchen Sie nach: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com`
   - Existiert sie?
   - Ist die Redirect URI korrekt eingetragen?

## 🎯 Was Sie mir sagen sollten

**Bitte teilen Sie mir mit:**

1. **Welche Client ID steht in der Network-Anfrage URL?**
   - Die neue: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr...`
   - Die alte: `633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2...`
   - Eine andere?

2. **Welche Redirect URI steht in der URL?**
   - `http://localhost:5173/auth/callback`?
   - Etwas anderes?

3. **Existiert die Client ID in Google Cloud Console?**
   - Ja / Nein

Das wird uns zeigen, wo genau das Problem liegt!

