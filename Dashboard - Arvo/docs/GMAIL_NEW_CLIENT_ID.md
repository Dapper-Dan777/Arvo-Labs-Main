# Gmail OAuth - Neue Client ID erstellen

## 🔴 Problem: "invalid_client" trotz korrekter Konfiguration

Da alle Konfigurationen korrekt sind, aber der Fehler weiterhin besteht, erstellen wir eine komplett neue Client ID.

## ✅ Lösung: Neue OAuth Client ID erstellen

### Schritt 1: Alte Client ID löschen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Suchen Sie nach: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com`
3. Klicken Sie darauf
4. Klicken Sie oben rechts auf **"Löschen"**
5. Bestätigen Sie die Löschung

### Schritt 2: Neue Client ID erstellen

1. Klicken Sie auf **"+ Anmeldedaten erstellen"** → **"OAuth-Client-ID"**
2. Falls Sie aufgefordert werden, den OAuth Consent Screen zu konfigurieren:
   - Das sollte bereits erledigt sein, aber prüfen Sie es
3. **Anwendungstyp:** Wählen Sie **"Webanwendung"**
4. **Name:** `Arvo Workflows Gmail NEW`
5. **Autorisierte Weiterleitungs-URIs:**
   ```
   http://localhost:5173/auth/callback
   ```
   - **WICHTIG:** Exakt diese URL, kein trailing slash
6. Klicken Sie auf **"Erstellen"**

### Schritt 3: Neue Client ID kopieren

1. Ein Dialog erscheint mit der neuen Client ID
2. **Kopieren Sie die Client ID** (beginnt mit Zahlen und endet mit `.apps.googleusercontent.com`)
3. **WICHTIG:** Kopieren Sie die komplette Client ID

### Schritt 4: Code aktualisieren

1. Öffnen Sie `src/lib/gmail/oauth.ts`
2. Suchen Sie nach Zeile 81:
   ```typescript
   const clientId = "633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com";
   ```
3. Ersetzen Sie die Client ID mit der neuen:
   ```typescript
   const clientId = "NEUE_CLIENT_ID.apps.googleusercontent.com";
   ```
4. **Speichern Sie die Datei**

### Schritt 5: Testen

1. Warten Sie 1-2 Minuten (damit Google die neue Client ID aktiviert)
2. Klicken Sie auf "Gmail verbinden"
3. Es sollte jetzt funktionieren

## 🎯 Warum eine neue Client ID?

Manchmal kann eine Client ID in einem inkonsistenten Zustand sein, besonders wenn sie mehrfach bearbeitet wurde. Eine neue Client ID startet mit einem sauberen Zustand.

## ⚠️ Wichtig

- Die neue Client ID muss im **gleichen Projekt** erstellt werden
- Die Redirect URI muss **exakt** übereinstimmen
- Warten Sie 1-2 Minuten nach dem Erstellen, bevor Sie testen

