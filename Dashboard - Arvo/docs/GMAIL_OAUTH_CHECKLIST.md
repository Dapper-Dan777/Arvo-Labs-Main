# Gmail OAuth Checkliste - "invalid_client" Fehler beheben

## ✅ Schritt-für-Schritt Prüfung

### 1. .env.local Datei prüfen

**Datei öffnen:** `C:\Users\adria\Dashboard - Arvo\.env.local`

**Muss enthalten:**
```env
VITE_GMAIL_CLIENT_ID=633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
```

**Prüfen Sie:**
- ✅ Keine Leerzeichen um das `=` Zeichen
- ✅ Keine Anführungszeichen
- ✅ Exakt diese Client ID (nicht die alte)
- ✅ Datei wurde gespeichert

### 2. Dev Server neu gestartet?

**WICHTIG:** Nach Änderungen in `.env.local` MUSS der Dev Server neu gestartet werden!

```bash
# 1. Stoppen Sie den Server (Ctrl+C im Terminal)
# 2. Starten Sie ihn neu:
npm run dev
```

### 3. Google Cloud Console prüfen

**Gehen Sie zu:** https://console.cloud.google.com/apis/credentials

**Prüfen Sie die Client ID:**
1. Suchen Sie nach: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com`
2. Klicken Sie darauf
3. **Prüfen Sie:**
   - ✅ **Anwendungstyp:** "Webanwendung"
   - ✅ **Autorisierte Weiterleitungs-URIs:** Enthält `http://localhost:5173/auth/callback`
   - ✅ **Exakt diese URL** (kein trailing slash, keine Leerzeichen)

### 4. OAuth Consent Screen prüfen

**Gehen Sie zu:** https://console.cloud.google.com/apis/credentials/consent

**Prüfen Sie:**
- ✅ App-Status: "In Test" oder "In Produktion"
- ✅ Ihre E-Mail ist als **Testbenutzer** hinzugefügt (wenn "In Test")
- ✅ Alle Pflichtfelder sind ausgefüllt

### 5. Browser Cache leeren

Manchmal werden alte Werte gecacht:

1. Öffnen Sie DevTools (F12)
2. Rechtsklick auf den Reload-Button
3. Wählen Sie "Leeren und harte Aktualisierung" oder "Empty Cache and Hard Reload"
4. Oder: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### 6. Browser-Konsole prüfen

1. Öffnen Sie DevTools (F12) → Tab "Console"
2. Klicken Sie auf "Gmail verbinden"
3. Prüfen Sie die Debug-Ausgabe:
   ```
   🔍 Gmail OAuth Debug:
     - Client ID: 633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
     - Redirect URI: http://localhost:5173/auth/callback
   ```
4. **Prüfen Sie:**
   - ✅ Client ID stimmt mit Google Cloud Console überein
   - ✅ Keine `undefined` Werte

### 7. Network-Tab prüfen

1. DevTools (F12) → Tab "Network"
2. Klicken Sie auf "Gmail verbinden"
3. Suchen Sie nach der Anfrage zu `accounts.google.com`
4. Klicken Sie darauf → Tab "Payload" oder "Query String Parameters"
5. **Prüfen Sie:**
   - ✅ `client_id` Parameter enthält die neue Client ID
   - ✅ `redirect_uri` ist `http://localhost:5173/auth/callback`

## 🔧 Häufige Probleme

### Problem: Alte Client ID wird noch verwendet

**Lösung:**
1. Prüfen Sie `.env.local` - enthält sie die neue Client ID?
2. Dev Server neu starten
3. Browser Cache leeren

### Problem: Redirect URI stimmt nicht überein

**Lösung:**
1. In Google Cloud Console: Client ID öffnen
2. Prüfen Sie "Autorisierte Weiterleitungs-URIs"
3. Muss exakt sein: `http://localhost:5173/auth/callback`
4. Falls nicht: Bearbeiten → Hinzufügen → Speichern

### Problem: OAuth Consent Screen nicht konfiguriert

**Lösung:**
1. Gehen Sie zu OAuth Consent Screen
2. Füllen Sie alle Pflichtfelder aus
3. Fügen Sie Testbenutzer hinzu (Ihre E-Mail)
4. Speichern Sie

### Problem: Falsches Google Cloud Projekt

**Lösung:**
1. Prüfen Sie oben in Google Cloud Console welches Projekt ausgewählt ist
2. Stellen Sie sicher, dass die Client ID zu diesem Projekt gehört
3. Falls nicht: Wechseln Sie zum richtigen Projekt oder erstellen Sie die Client ID im richtigen Projekt

## 🎯 Schnelltest

1. **Browser-Konsole öffnen** (F12)
2. **Eingeben:**
   ```javascript
   console.log(import.meta.env.VITE_GMAIL_CLIENT_ID)
   ```
3. **Sollte ausgeben:**
   ```
   633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com
   ```
4. **Falls `undefined`:**
   - `.env.local` prüfen
   - Dev Server neu starten

## 📞 Noch immer Probleme?

Falls nach allen Schritten immer noch "invalid_client" erscheint:

1. **Erstellen Sie eine komplett neue Client ID:**
   - Löschen Sie die alte in Google Cloud Console
   - Erstellen Sie eine neue
   - Aktualisieren Sie `.env.local`
   - Dev Server neu starten

2. **Prüfen Sie ob Sie im richtigen Google Cloud Projekt sind**

3. **Prüfen Sie die Browser-Konsole** für weitere Fehlermeldungen

