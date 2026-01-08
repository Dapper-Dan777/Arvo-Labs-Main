# Gmail OAuth - Direkter Test in der Browser-Konsole

## 🔍 Problem: Debug-Ausgabe erscheint nicht

Wenn die Debug-Ausgabe nicht erscheint, können wir direkt in der Browser-Konsole testen.

## ✅ Lösung: Direkter Test

### Schritt 1: Browser-Konsole öffnen

1. Öffnen Sie die Developer Tools: `F12`
2. Wechseln Sie zum Tab **"Console"**

### Schritt 2: Environment Variable prüfen

Geben Sie in der Console ein:

```javascript
console.log('Client ID:', import.meta.env.VITE_GMAIL_CLIENT_ID)
```

**Erwartetes Ergebnis:**
```
Client ID: 633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
```

**Falls `undefined` angezeigt wird:**
- Dev Server wurde nicht neu gestartet
- `.env.local` Datei wurde nicht gespeichert
- Falsche Datei wurde geändert

### Schritt 3: Funktion direkt aufrufen

Geben Sie in der Console ein:

```javascript
import('@/lib/gmail/oauth').then(module => {
  console.log('✅ Modul geladen');
  module.startGmailOAuth().catch(err => {
    console.error('❌ Fehler:', err);
  });
});
```

**Erwartetes Ergebnis:**
- Sie werden zu Google OAuth weitergeleitet
- Oder es erscheint eine Fehlermeldung in der Console

### Schritt 4: Prüfen Sie die Network-Anfrage

1. DevTools (F12) → Tab **"Network"**
2. Klicken Sie auf "Gmail verbinden" (oder führen Sie Schritt 3 aus)
3. Suchen Sie nach einer Anfrage zu `accounts.google.com`
4. Klicken Sie darauf
5. Prüfen Sie die **URL** - enthält sie die richtige Client ID?

**Die URL sollte so aussehen:**
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com&redirect_uri=http://localhost:5173/auth/callback&...
```

## 🎯 Was Sie mir sagen sollten

1. **Was zeigt `import.meta.env.VITE_GMAIL_CLIENT_ID`?**
   - Die neue Client ID?
   - `undefined`?
   - Die alte Client ID?

2. **Was passiert wenn Sie die Funktion direkt aufrufen?**
   - Weiterleitung zu Google?
   - Fehlermeldung?
   - Nichts?

3. **Was steht in der Network-Anfrage URL?**
   - Welche Client ID wird verwendet?

## 🔧 Häufige Probleme

### Problem: `undefined` wird angezeigt

**Lösung:**
1. Prüfen Sie `.env.local` - enthält sie die neue Client ID?
2. **Dev Server neu starten** (wichtig!)
3. Browser Cache leeren (`Ctrl+Shift+R`)

### Problem: Alte Client ID wird angezeigt

**Lösung:**
1. Prüfen Sie `.env.local` - wurde sie gespeichert?
2. Dev Server neu starten
3. Browser Cache leeren

### Problem: Funktion wird nicht aufgerufen

**Lösung:**
1. Prüfen Sie ob der Button richtig geklickt wird
2. Prüfen Sie die Console auf JavaScript-Fehler
3. Versuchen Sie die Funktion direkt aufzurufen (Schritt 3)

