# Gmail OAuth Troubleshooting: "invalid_client" Fehler

## Problem: "Fehler 401: invalid_client - The OAuth client was not found"

Dieser Fehler bedeutet, dass Google die Client ID nicht findet oder nicht korrekt konfiguriert ist.

## ✅ Lösungsschritte

### 1. Prüfen Sie die Client ID in Google Cloud Console

1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Wählen Sie das richtige Projekt aus
3. Navigieren Sie zu **"APIs & Services"** → **"Anmeldedaten"**
4. Suchen Sie nach der Client ID: `633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com`
5. **Prüfen Sie:**
   - ✅ Existiert die Client ID?
   - ✅ Ist sie vom Typ "Webanwendung"?
   - ✅ Ist sie aktiviert?

### 2. Prüfen Sie die Redirect URI

**WICHTIG**: Die Redirect URI muss **exakt** übereinstimmen!

1. In Google Cloud Console:
   - Öffnen Sie die OAuth Client ID
   - Prüfen Sie **"Autorisierte Weiterleitungs-URIs"**
   - Muss enthalten: `http://localhost:5173/auth/callback`

2. In Ihrer `.env.local`:
   ```env
   VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
   ```

3. **Prüfen Sie:**
   - ✅ Keine Leerzeichen
   - ✅ Kein trailing slash (`/auth/callback` nicht `/auth/callback/`)
   - ✅ Exakt `http://localhost:5173/auth/callback` (nicht `https://`)

### 3. Prüfen Sie den OAuth Consent Screen

1. Gehen Sie zu **"APIs & Services"** → **"OAuth-Zustimmungsbildschirm"**
2. **Prüfen Sie:**
   - ✅ App-Status: "In Test" oder "In Produktion"
   - ✅ Testbenutzer hinzugefügt (falls "In Test")
   - ✅ Ihre E-Mail ist als Testbenutzer eingetragen

### 4. Prüfen Sie ob Gmail API aktiviert ist

1. Gehen Sie zu **"APIs & Services"** → **"Bibliothek"**
2. Suchen Sie nach "Gmail API"
3. **Prüfen Sie:**
   - ✅ Gmail API ist aktiviert
   - ✅ Status zeigt "Aktiviert"

### 5. Prüfen Sie die Scopes

Die folgenden Scopes müssen im OAuth Consent Screen konfiguriert sein:

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.modify`

## 🔍 Debug-Modus

Öffnen Sie die Browser-Konsole (F12) und prüfen Sie die Debug-Ausgabe:

```javascript
🔍 Gmail OAuth Debug:
  - Client ID: 633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
  - Redirect URI: http://localhost:5173/auth/callback
  - Scopes: [...]
  - Auth URL: https://accounts.google.com/o/oauth2/v2/auth?...
```

**Prüfen Sie:**
- ✅ Client ID ist korrekt
- ✅ Redirect URI ist korrekt
- ✅ Keine `undefined` Werte

## 🛠️ Häufige Probleme und Lösungen

### Problem 1: Client ID existiert nicht

**Lösung:**
1. Erstellen Sie eine neue OAuth Client ID in Google Cloud Console
2. Wählen Sie "Webanwendung"
3. Fügen Sie die Redirect URI hinzu
4. Aktualisieren Sie `.env.local` mit der neuen Client ID

### Problem 2: Redirect URI stimmt nicht überein

**Symptom:** Die Redirect URI in der Fehlermeldung unterscheidet sich von der in Google Cloud Console

**Lösung:**
1. Kopieren Sie die **exakte** Redirect URI aus der Fehlermeldung
2. Fügen Sie sie in Google Cloud Console hinzu
3. Oder: Passen Sie `.env.local` an die in Google Cloud Console eingetragene URI an

### Problem 3: OAuth Consent Screen nicht konfiguriert

**Lösung:**
1. Gehen Sie zu "OAuth-Zustimmungsbildschirm"
2. Füllen Sie alle Pflichtfelder aus:
   - App-Name
   - Benutzer-Support-E-Mail
   - Entwickler-E-Mail
3. Fügen Sie die Scopes hinzu
4. Fügen Sie Testbenutzer hinzu (falls "In Test")
5. Speichern Sie

### Problem 4: Falsches Projekt

**Lösung:**
1. Prüfen Sie ob Sie das richtige Google Cloud Projekt ausgewählt haben
2. Die Client ID muss zu dem Projekt gehören, in dem Gmail API aktiviert ist

## 📝 Checkliste

Vor dem Testen:

- [ ] Client ID existiert in Google Cloud Console
- [ ] Client ID ist vom Typ "Webanwendung"
- [ ] Redirect URI ist in Google Cloud Console eingetragen: `http://localhost:5173/auth/callback`
- [ ] Redirect URI in `.env.local` stimmt exakt überein
- [ ] OAuth Consent Screen ist konfiguriert
- [ ] Gmail API ist aktiviert
- [ ] Testbenutzer hinzugefügt (falls "In Test")
- [ ] Dev Server wurde neu gestartet nach Änderungen

## 🔄 Neue Client ID erstellen

Falls die Client ID nicht existiert oder nicht funktioniert:

1. **Google Cloud Console** → **"APIs & Services"** → **"Anmeldedaten"**
2. Klicken Sie auf **"+ Anmeldedaten erstellen"** → **"OAuth-Client-ID"**
3. Wählen Sie **"Webanwendung"**
4. Name: `Arvo Workflows Gmail Client`
5. **Autorisierte JavaScript-Ursprünge:**
   - `http://localhost:5173`
6. **Autorisierte Weiterleitungs-URIs:**
   - `http://localhost:5173/auth/callback`
7. Klicken Sie auf **"Erstellen"**
8. **Kopieren Sie die Client ID** und aktualisieren Sie `.env.local`:
   ```env
   VITE_GMAIL_CLIENT_ID=IHRE_NEUE_CLIENT_ID.apps.googleusercontent.com
   ```
9. **Starten Sie den Dev Server neu**

## 🆘 Noch immer Probleme?

1. **Prüfen Sie die Browser-Konsole** für die Debug-Ausgabe
2. **Prüfen Sie die Network-Tab** im Browser DevTools - sehen Sie die OAuth-Anfrage?
3. **Prüfen Sie Google Cloud Console Logs** unter "APIs & Services" → "Dashboard"
4. **Versuchen Sie eine neue Client ID** zu erstellen

