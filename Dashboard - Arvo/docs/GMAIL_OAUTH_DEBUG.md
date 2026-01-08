# Gmail OAuth Debug - Was in der Console erscheinen sollte

## ✅ Erwartete Debug-Ausgabe

Wenn Sie auf "Gmail verbinden" klicken, sollten Sie in der **Browser-Konsole** (F12 → Tab "Console") folgendes sehen:

```
🔍 Gmail OAuth Debug:
  - Client ID: 633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
  - Redirect URI: http://localhost:5173/auth/callback
  - Scopes: Array(3) [...]
  - Auth URL: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
  - Environment Check: {VITE_GMAIL_CLIENT_ID: "...", VITE_GMAIL_REDIRECT_URI: "..."}
```

## ⚠️ Unwichtige Fehler (können ignoriert werden)

Diese Fehler sind **NICHT** das Problem:

- `m=_b,_tp:401` - Google interne Nachricht
- `ERR_BLOCKED_BY_CLIENT` - Blockierte Requests (z.B. durch Ad-Blocker)
- `play.google.com/log` - Google Analytics/Tracking (wird blockiert)

## 🔍 Was Sie prüfen sollten

### 1. Erscheint die Debug-Ausgabe?

**Falls NEIN:**
- Prüfen Sie ob der Dev Server läuft
- Prüfen Sie ob Sie auf "Gmail verbinden" geklickt haben
- Prüfen Sie die Console auf andere Fehler

**Falls JA:**
- Prüfen Sie ob die Client ID korrekt ist
- Prüfen Sie ob die Redirect URI korrekt ist

### 2. Client ID prüfen

In der Debug-Ausgabe sollte stehen:
```
Client ID: 633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
```

**Falls eine andere Client ID angezeigt wird:**
- Dev Server wurde nicht neu gestartet
- `.env.local` wurde nicht gespeichert
- Falsche Datei wurde geändert

### 3. Redirect URI prüfen

In der Debug-Ausgabe sollte stehen:
```
Redirect URI: http://localhost:5173/auth/callback
```

**Falls eine andere URI angezeigt wird:**
- Prüfen Sie `.env.local`
- Prüfen Sie ob `VITE_GMAIL_REDIRECT_URI` gesetzt ist

## 🎯 Nächste Schritte

1. **Öffnen Sie die Console** (F12 → Tab "Console")
2. **Klicken Sie auf "Gmail verbinden"**
3. **Suchen Sie nach:** `🔍 Gmail OAuth Debug:`
4. **Kopieren Sie die Debug-Ausgabe** und teilen Sie sie mit mir

Die Debug-Ausgabe zeigt genau, welche Werte verwendet werden, und hilft beim Finden des Problems.

