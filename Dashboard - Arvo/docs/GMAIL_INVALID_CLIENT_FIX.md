# Gmail OAuth "invalid_client" - Finale Lösung

## ✅ Bestätigt: Client ID und Redirect URI sind korrekt

- Client ID: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com` ✓
- Redirect URI: `http://localhost:5173/auth/callback` ✓
- Google Cloud Console: Beide Client IDs existieren und sind korrekt konfiguriert ✓

## 🔴 Problem: "invalid_client" Fehler trotz korrekter Konfiguration

Wenn alles korrekt konfiguriert ist und es immer noch nicht funktioniert, gibt es nur noch **eine mögliche Ursache**:

## ✅ Lösung: Prüfen Sie das Google Cloud Projekt

### Schritt 1: Projekt prüfen

1. Gehen Sie zu: https://console.cloud.google.com/
2. **Prüfen Sie oben links:** Welches Projekt ist ausgewählt?
3. **Muss sein:** "Arvo Workflows"

### Schritt 2: Client ID im richtigen Projekt prüfen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. **WICHTIG:** Stellen Sie sicher, dass das Projekt "Arvo Workflows" ausgewählt ist
3. Suchen Sie nach: `633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com`
4. **Falls die Client ID NICHT erscheint:**
   - Sie sind im falschen Projekt!
   - Wechseln Sie zum Projekt "Arvo Workflows"
   - Oder erstellen Sie die Client ID im aktuellen Projekt

### Schritt 3: Client ID Status prüfen

1. Klicken Sie auf die Client ID
2. **Prüfen Sie:**
   - ✅ Status: Aktiv (nicht gelöscht/deaktiviert)
   - ✅ Anwendungstyp: Webanwendung
   - ✅ Redirect URI: `http://localhost:5173/auth/callback` (exakt)

### Schritt 4: OAuth Consent Screen Projekt prüfen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials/consent
2. **Prüfen Sie oben:** Ist das Projekt "Arvo Workflows" ausgewählt?
3. **Falls nicht:** Wechseln Sie zum richtigen Projekt

## 🎯 Häufigste Ursache

**Die Client ID existiert in einem anderen Google Cloud Projekt!**

**Lösung:**
- Wechseln Sie zum Projekt, in dem die Client ID erstellt wurde
- Oder erstellen Sie eine neue Client ID im aktuellen Projekt

## 📝 Alternative: Neue Client ID im aktuellen Projekt erstellen

Falls Sie nicht sicher sind, welches Projekt das richtige ist:

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Klicken Sie auf "+ Anmeldedaten erstellen" → "OAuth-Client-ID"
3. Wählen Sie "Webanwendung"
4. Name: `Arvo Workflows Gmail Test`
5. Redirect URI: `http://localhost:5173/auth/callback`
6. Erstellen
7. Kopieren Sie die neue Client ID
8. Aktualisieren Sie `src/lib/gmail/oauth.ts` Zeile 81:
   ```typescript
   const clientId = "NEUE_CLIENT_ID.apps.googleusercontent.com";
   ```

## 🔍 Debug: Vollständige URL prüfen

Nach dem nächsten Klick auf "Gmail verbinden" wird im Alert die vollständige OAuth URL angezeigt. 

**Prüfen Sie:**
- Enthält die URL die richtige Client ID?
- Enthält die URL die richtige Redirect URI?
- Gibt es andere Parameter, die falsch sein könnten?

