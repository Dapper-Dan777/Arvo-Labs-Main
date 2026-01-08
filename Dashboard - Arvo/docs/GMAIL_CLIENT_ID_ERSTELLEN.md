# Gmail OAuth Client ID erstellen - Schritt für Schritt

## 🎯 Ziel: Neue OAuth Client ID in Google Cloud Console erstellen

Da die angegebene Client ID nicht gefunden wird, erstellen wir eine neue.

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Google Cloud Console öffnen

1. Gehen Sie zu: https://console.cloud.google.com/
2. **Melden Sie sich mit Ihrem Google-Konto an**

### Schritt 2: Projekt auswählen oder erstellen

**Option A: Bestehendes Projekt verwenden**
- Klicken Sie oben auf das Projekt-Dropdown
- Wählen Sie ein bestehendes Projekt aus

**Option B: Neues Projekt erstellen**
- Klicken Sie auf das Projekt-Dropdown
- Klicken Sie auf **"Neues Projekt"**
- Name: `Arvo Workflows` (oder ein anderer Name)
- Klicken Sie auf **"Erstellen"**
- Warten Sie bis das Projekt erstellt ist
- Wählen Sie das neue Projekt aus

### Schritt 3: Gmail API aktivieren

1. Im linken Menü: **"APIs & Services"** → **"Bibliothek"**
2. Suchen Sie nach: **"Gmail API"**
3. Klicken Sie auf **"Gmail API"**
4. Klicken Sie auf **"Aktivieren"**
5. Warten Sie bis die API aktiviert ist

### Schritt 4: OAuth Consent Screen konfigurieren

1. Im linken Menü: **"APIs & Services"** → **"OAuth-Zustimmungsbildschirm"**
2. Falls noch nicht konfiguriert:
   - Wählen Sie **"Extern"** aus
   - Klicken Sie auf **"Erstellen"**
3. **App-Informationen ausfüllen:**
   - **App-Name**: `Arvo Workflows`
   - **Benutzer-Support-E-Mail**: Wählen Sie Ihre E-Mail aus dem Dropdown
   - **App-Logo**: (optional, kann übersprungen werden)
   - **App-Domäne**: (kann leer bleiben)
   - **Autorisierte Domänen**: (kann leer bleiben)
   - **Entwickler-Kontaktinformationen**: Ihre E-Mail
4. Klicken Sie auf **"Speichern und fortfahren"**

5. **Scopes (Berechtigungen):**
   - Klicken Sie auf **"Scopes hinzufügen oder entfernen"**
   - Suchen Sie nach: `gmail`
   - Aktivieren Sie:
     - ✅ `.../auth/gmail.readonly`
     - ✅ `.../auth/gmail.send`
     - ✅ `.../auth/gmail.modify`
   - Klicken Sie auf **"Aktualisieren"**
   - Klicken Sie auf **"Speichern und fortfahren"**

6. **Testbenutzer:**
   - Klicken Sie auf **"+ Testbenutzer hinzufügen"**
   - Geben Sie **Ihre E-Mail-Adresse** ein
   - Klicken Sie auf **"Hinzufügen"**
   - Klicken Sie auf **"Speichern und fortfahren"**

7. **Zusammenfassung:**
   - Prüfen Sie die Zusammenfassung
   - Klicken Sie auf **"Zurück zum Dashboard"**

### Schritt 5: OAuth Client ID erstellen

1. Im linken Menü: **"APIs & Services"** → **"Anmeldedaten"**
2. Klicken Sie oben auf **"+ Anmeldedaten erstellen"**
3. Wählen Sie **"OAuth-Client-ID"** aus

4. Falls Sie aufgefordert werden, den OAuth Consent Screen zu konfigurieren:
   - Klicken Sie auf **"OAuth-Zustimmungsbildschirm konfigurieren"**
   - Folgen Sie Schritt 4 oben
   - Kehren Sie dann hierher zurück

5. **OAuth-Client-ID erstellen:**
   - **Anwendungstyp**: Wählen Sie **"Webanwendung"**
   - **Name**: `Arvo Workflows Gmail Client` (oder ein anderer Name)

6. **Autorisierte JavaScript-Ursprünge:**
   - Klicken Sie auf **"+ URI hinzufügen"**
   - Geben Sie ein: `http://localhost:5173`
   - (Für Production später: `https://ihre-domain.com`)

7. **Autorisierte Weiterleitungs-URIs:**
   - Klicken Sie auf **"+ URI hinzufügen"**
   - Geben Sie **exakt** ein: `http://localhost:5173/auth/callback`
   - **WICHTIG**: 
     - Kein trailing slash (`/auth/callback` nicht `/auth/callback/`)
     - Keine Leerzeichen
     - Exakt `http://localhost:5173/auth/callback`

8. Klicken Sie auf **"Erstellen"**

9. **WICHTIG**: Ein Dialog erscheint mit:
   - **Ihre Client-ID**: `123456789-abc...def.apps.googleusercontent.com`
   - **Ihr Client-Geheimcode**: `GOCSPX-...`

10. **Kopieren Sie die Client-ID** (Sie brauchen sie gleich!)

### Schritt 6: Client ID in .env.local eintragen

1. Öffnen Sie die Datei `.env.local` im Projekt-Root
2. Aktualisieren Sie die Zeile:
   ```env
   VITE_GMAIL_CLIENT_ID=IHRE_NEUE_CLIENT_ID.apps.googleusercontent.com
   ```
   (Ersetzen Sie `IHRE_NEUE_CLIENT_ID` mit der kopierten Client ID)

3. **Speichern Sie die Datei**

### Schritt 7: Dev Server neu starten

1. Stoppen Sie den laufenden Dev Server (falls aktiv): `Ctrl+C`
2. Starten Sie ihn neu:
   ```bash
   npm run dev
   ```

### Schritt 8: Testen

1. Gehen Sie zu `/integrations`
2. Klicken Sie auf "Gmail verbinden"
3. Sie sollten jetzt zu Google weitergeleitet werden
4. Melden Sie sich mit Ihrem Google-Konto an (das als Testbenutzer eingetragen ist)
5. Erlauben Sie die Berechtigungen
6. Sie werden zurück zu `/auth/callback` weitergeleitet

## 🔍 Screenshots-Hinweise

**Wo finde ich "APIs & Services"?**
- Im linken Menü der Google Cloud Console
- Oder über die Suche oben: "APIs & Services" eingeben

**Wo finde ich "Anmeldedaten"?**
- Unter "APIs & Services" → "Anmeldedaten"
- Oder direkt über die Suche: "Anmeldedaten" eingeben

**Wo finde ich "OAuth-Zustimmungsbildschirm"?**
- Unter "APIs & Services" → "OAuth-Zustimmungsbildschirm"
- Oder über die Suche: "OAuth consent" eingeben

## ⚠️ Wichtige Hinweise

1. **Client Secret**: Das Client Secret wird NUR in Supabase Edge Functions verwendet, nicht im Frontend!
2. **Redirect URI**: Muss exakt übereinstimmen - keine Leerzeichen, kein trailing slash
3. **Testbenutzer**: Wenn der OAuth Consent Screen "In Test" ist, müssen Sie als Testbenutzer eingetragen sein
4. **Dev Server**: Nach Änderungen in `.env.local` immer neu starten!

## 🆘 Probleme?

**"OAuth-Zustimmungsbildschirm konfigurieren" wird angezeigt:**
→ Folgen Sie Schritt 4 oben

**"Gmail API ist nicht aktiviert":**
→ Folgen Sie Schritt 3 oben

**"Keine Berechtigung":**
→ Stellen Sie sicher, dass Sie der Projektbesitzer sind oder Berechtigungen haben

**"Testbenutzer nicht gefunden":**
→ Fügen Sie Ihre E-Mail als Testbenutzer hinzu (Schritt 4, Punkt 6)

