# Gmail OAuth "invalid_client" Fehler beheben

## 🔴 Problem: "Fehler 401: invalid_client - The OAuth client was not found"

Dieser Fehler tritt auf, wenn Google die Client ID nicht findet oder die Konfiguration nicht korrekt ist.

## ✅ Schritt-für-Schritt Lösung

### Schritt 1: Prüfen Sie die Client ID in Google Cloud Console

1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. **WICHTIG**: Stellen Sie sicher, dass Sie das **richtige Projekt** ausgewählt haben
3. Navigieren Sie zu **"APIs & Services"** → **"Anmeldedaten"**
4. Suchen Sie nach der Client ID: `633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com`

**Falls die Client ID NICHT existiert:**
→ Gehen Sie zu **Schritt 2** (Neue Client ID erstellen)

**Falls die Client ID existiert:**
→ Gehen Sie zu **Schritt 3** (Konfiguration prüfen)

### Schritt 2: Neue OAuth Client ID erstellen

1. In Google Cloud Console: **"APIs & Services"** → **"Anmeldedaten"**
2. Klicken Sie auf **"+ Anmeldedaten erstellen"** → **"OAuth-Client-ID"**
3. Falls Sie noch keinen OAuth Consent Screen haben:
   - Klicken Sie auf **"OAuth-Zustimmungsbildschirm konfigurieren"**
   - Wählen Sie **"Extern"** → **"Erstellen"**
   - Füllen Sie die Pflichtfelder aus:
     - **App-Name**: `Arvo Workflows`
     - **Benutzer-Support-E-Mail**: Ihre E-Mail
     - **Entwickler-E-Mail**: Ihre E-Mail
   - Klicken Sie auf **"Speichern und fortfahren"**
   - Fügen Sie Scopes hinzu (optional, können später hinzugefügt werden)
   - Klicken Sie auf **"Speichern und fortfahren"**
   - Fügen Sie **Testbenutzer** hinzu (Ihre E-Mail)
   - Klicken Sie auf **"Zurück zum Dashboard"**

4. Jetzt erstellen Sie die Client ID:
   - **Anwendungstyp**: Wählen Sie **"Webanwendung"**
   - **Name**: `Arvo Workflows Gmail Client`
   - **Autorisierte JavaScript-Ursprünge**:
     ```
     http://localhost:5173
     ```
   - **Autorisierte Weiterleitungs-URIs**:
     ```
     http://localhost:5173/auth/callback
     ```
   - Klicken Sie auf **"Erstellen"**

5. **Kopieren Sie die Client ID** (beginnt mit Zahlen und endet mit `.apps.googleusercontent.com`)

6. **Aktualisieren Sie `.env.local`**:
   ```env
   VITE_GMAIL_CLIENT_ID=IHRE_NEUE_CLIENT_ID.apps.googleusercontent.com
   ```

7. **Starten Sie den Dev Server neu**

### Schritt 3: Bestehende Client ID prüfen

Falls die Client ID bereits existiert, prüfen Sie:

1. **Öffnen Sie die Client ID** in Google Cloud Console
2. **Prüfen Sie "Autorisierte Weiterleitungs-URIs"**:
   - Muss enthalten: `http://localhost:5173/auth/callback`
   - **WICHTIG**: Exakt diese URL, keine Leerzeichen, kein trailing slash
3. **Prüfen Sie "Autorisierte JavaScript-Ursprünge"**:
   - Muss enthalten: `http://localhost:5173`
4. **Falls nicht vorhanden:**
   - Klicken Sie auf **"Bearbeiten"**
   - Fügen Sie die URIs hinzu
   - Klicken Sie auf **"Speichern"**

### Schritt 4: OAuth Consent Screen prüfen

1. Gehen Sie zu **"APIs & Services"** → **"OAuth-Zustimmungsbildschirm"**
2. **Prüfen Sie:**
   - ✅ App-Status: "In Test" oder "In Produktion"
   - ✅ Alle Pflichtfelder sind ausgefüllt
   - ✅ Ihre E-Mail ist als **Testbenutzer** hinzugefügt (falls "In Test")

### Schritt 5: Gmail API aktivieren

1. Gehen Sie zu **"APIs & Services"** → **"Bibliothek"**
2. Suchen Sie nach **"Gmail API"**
3. Klicken Sie darauf und prüfen Sie:
   - ✅ Status zeigt **"Aktiviert"**
   - Falls nicht: Klicken Sie auf **"Aktivieren"**

### Schritt 6: Debug-Informationen prüfen

1. Öffnen Sie die **Browser-Konsole** (F12)
2. Klicken Sie erneut auf "Gmail verbinden"
3. Prüfen Sie die Debug-Ausgabe:
   ```
   🔍 Gmail OAuth Debug:
     - Client ID: ...
     - Redirect URI: ...
     - Scopes: ...
     - Auth URL: ...
   ```
4. **Prüfen Sie:**
   - ✅ Client ID stimmt mit Google Cloud Console überein
   - ✅ Redirect URI ist exakt `http://localhost:5173/auth/callback`
   - ✅ Keine `undefined` Werte

## 🎯 Schnelllösung: Neue Client ID erstellen

Falls Sie schnell eine neue Client ID erstellen möchten:

1. **Google Cloud Console** → **"APIs & Services"** → **"Anmeldedaten"**
2. **"+ Anmeldedaten erstellen"** → **"OAuth-Client-ID"**
3. **"Webanwendung"** auswählen
4. **Name**: `Arvo Workflows Gmail`
5. **Autorisierte Weiterleitungs-URIs**: `http://localhost:5173/auth/callback`
6. **Erstellen** → Client ID kopieren
7. In `.env.local` eintragen
8. Dev Server neu starten

## ⚠️ Wichtige Hinweise

- **Redirect URI muss exakt übereinstimmen** (keine Leerzeichen, kein trailing slash)
- **Client ID und Secret gehören zusammen** - verwenden Sie immer das richtige Paar
- **Testbenutzer hinzufügen** wenn OAuth Consent Screen "In Test" ist
- **Dev Server neu starten** nach Änderungen in `.env.local`

## 📞 Noch Probleme?

Prüfen Sie:
1. Browser-Konsole für Debug-Ausgabe
2. Network-Tab im DevTools - sehen Sie die OAuth-Anfrage?
3. Google Cloud Console → Dashboard → Logs
4. Versuchen Sie eine komplett neue Client ID zu erstellen

