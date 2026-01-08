# Gmail OAuth - Finale Lösung

## ✅ Client ID ist bereits hardcoded

Die Client ID `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com` ist bereits im Code hardcoded.

## 🔴 Problem: "invalid_client" Fehler

Da die Client ID hardcoded ist und es immer noch nicht funktioniert, liegt das Problem in **Google Cloud Console**.

## ✅ Lösung: Google Cloud Console prüfen

### Schritt 1: Client ID in Google Cloud Console finden

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. **WICHTIG**: Stellen Sie sicher, dass Sie das **RICHTIGE PROJEKT** ausgewählt haben
3. Suchen Sie nach der Client ID: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com`

### Schritt 2: Client ID öffnen und prüfen

1. Klicken Sie auf die Client ID
2. **Prüfen Sie:**
   - ✅ **Anwendungstyp:** Muss "Webanwendung" sein
   - ✅ **Autorisierte Weiterleitungs-URIs:** Muss enthalten: `http://localhost:5173/auth/callback`
   - ✅ **Exakt diese URL** (kein trailing slash, keine Leerzeichen)

### Schritt 3: Falls die Client ID NICHT existiert

**Die Client ID existiert nicht in diesem Projekt!**

**Lösung:**
1. Erstellen Sie eine neue OAuth Client ID:
   - "+ Anmeldedaten erstellen" → "OAuth-Client-ID"
   - "Webanwendung" wählen
   - Name: `Arvo Workflows Gmail`
   - **Autorisierte Weiterleitungs-URIs:** `http://localhost:5173/auth/callback`
   - "Erstellen"
2. Kopieren Sie die **NEUE** Client ID
3. Aktualisieren Sie `src/lib/gmail/oauth.ts` Zeile 81:
   ```typescript
   const clientId = "IHRE_NEUE_CLIENT_ID.apps.googleusercontent.com";
   ```

### Schritt 4: OAuth Consent Screen prüfen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials/consent
2. **Prüfen Sie:**
   - ✅ App-Status: "In Test" oder "In Produktion"
   - ✅ Ihre E-Mail ist als **Testbenutzer** hinzugefügt (wenn "In Test")

### Schritt 5: Gmail API aktivieren

1. Gehen Sie zu: https://console.cloud.google.com/apis/library/gmail.googleapis.com
2. Prüfen Sie ob Gmail API aktiviert ist
3. Falls nicht: Klicken Sie auf "Aktivieren"

## 🎯 Häufigste Ursache

**Die Client ID existiert nicht in dem Google Cloud Projekt, das Sie gerade verwenden!**

**Lösung:**
- Erstellen Sie eine neue Client ID im aktuellen Projekt
- Oder wechseln Sie zum richtigen Projekt, in dem die Client ID existiert

## 📝 Checkliste

- [ ] Client ID existiert in Google Cloud Console
- [ ] Client ID ist vom Typ "Webanwendung"
- [ ] Redirect URI ist eingetragen: `http://localhost:5173/auth/callback`
- [ ] OAuth Consent Screen ist konfiguriert
- [ ] Gmail API ist aktiviert
- [ ] Testbenutzer hinzugefügt (falls "In Test")

