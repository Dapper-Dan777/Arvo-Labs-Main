# Gmail OAuth - OAuth Consent Screen Sicherheitsproblem beheben

## 🔴 Problem: "Detailanforderung" Warnung von Google

Google zeigt eine Sicherheitswarnung, weil der OAuth Consent Screen nicht vollständig konfiguriert ist.

## ✅ Lösung: OAuth Consent Screen vollständig konfigurieren

### Schritt 1: OAuth Consent Screen öffnen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials/consent
2. **WICHTIG:** Stellen Sie sicher, dass das Projekt "Arvo Workflows" ausgewählt ist

### Schritt 2: App-Informationen ausfüllen

1. Klicken Sie auf **"Bearbeiten"** (wenn bereits konfiguriert) oder **"Konfigurieren"** (wenn neu)
2. **App-Informationen:**
   - **App-Name:** `Arvo Workflows` (oder ein anderer Name)
   - **Benutzer-Support-E-Mail:** Ihre E-Mail-Adresse
   - **App-Logo:** (optional, kann übersprungen werden)
   - **App-Domäne:** (kann leer bleiben für Entwicklung)
   - **Autorisierte Domänen:** (kann leer bleiben für Entwicklung)
   - **Entwickler-Kontaktinformationen:** Ihre E-Mail-Adresse
3. Klicken Sie auf **"Speichern und fortfahren"**

### Schritt 3: Scopes hinzufügen

1. **Scopes:** Klicken Sie auf **"Scopes hinzufügen oder entfernen"**
2. **WICHTIG:** Fügen Sie diese Scopes hinzu:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
3. Falls die Scopes nicht in der Liste sind:
   - Klicken Sie auf **"Scopes hinzufügen"**
   - Geben Sie die Scope-URLs manuell ein
4. Klicken Sie auf **"Aktualisieren"**
5. Klicken Sie auf **"Speichern und fortfahren"**

### Schritt 4: Testbenutzer hinzufügen (wenn im Testmodus)

**Falls die App im Testmodus ist:**
1. **Testbenutzer:**
   - Klicken Sie auf **"+ Testbenutzer hinzufügen"**
   - Geben Sie **Ihre E-Mail-Adresse** ein
   - Klicken Sie auf **"Hinzufügen"**
2. Klicken Sie auf **"Speichern und fortfahren"**

**Falls die App im Produktionsmodus ist:**
- Testbenutzer sind nicht erforderlich
- Aber die App muss verifiziert sein

### Schritt 5: Zusammenfassung prüfen

1. Prüfen Sie die Zusammenfassung
2. Klicken Sie auf **"Zurück zum Dashboard"**

### Schritt 6: App-Verifizierung (für Produktionsmodus)

**Falls die App im Produktionsmodus ist:**
1. Google kann eine Verifizierung verlangen
2. Für Entwicklung können Sie die App auf **"Testmodus"** umstellen:
   - OAuth Consent Screen → **"Zurück zum Test"** (falls verfügbar)
   - Oder: Erstellen Sie eine neue App im Testmodus

## 🎯 Schnelllösung: App auf Testmodus umstellen

Falls Sie schnell testen möchten:

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials/consent
2. Klicken Sie auf **"Zurück zum Test"** (falls verfügbar)
3. Fügen Sie Ihre E-Mail als Testbenutzer hinzu
4. Speichern Sie

## 📝 Checkliste

- [ ] App-Name ist ausgefüllt
- [ ] Benutzer-Support-E-Mail ist ausgefüllt
- [ ] Entwickler-E-Mail ist ausgefüllt
- [ ] Gmail Scopes sind hinzugefügt:
  - [ ] `https://www.googleapis.com/auth/gmail.readonly`
  - [ ] `https://www.googleapis.com/auth/gmail.send`
  - [ ] `https://www.googleapis.com/auth/gmail.modify`
- [ ] Testbenutzer hinzugefügt (wenn im Testmodus)
- [ ] Alle Änderungen gespeichert

## ⚠️ Wichtig

Nach Änderungen am OAuth Consent Screen kann es bis zu 5-10 Minuten dauern, bis die Änderungen aktiv sind. Warten Sie ein paar Minuten und versuchen Sie es erneut.

