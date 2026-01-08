# API Keys & Integration Setup Guide

Dieser Guide erklärt Schritt für Schritt, wie Sie API-Keys für die verschiedenen Integrationen erhalten und konfigurieren.

## 📋 Inhaltsverzeichnis

- [Gmail API](#gmail-api)
- [Slack API](#slack-api)
- [Google Sheets API](#google-sheets-api)
- [Notion API](#notion-api)
- [Webhooks](#webhooks)
- [Allgemeine Sicherheitshinweise](#allgemeine-sicherheitshinweise)

---

## 📧 Gmail API

### Schritt 1: Google Cloud Console Projekt erstellen
1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Klicken Sie auf das Projekt-Dropdown oben
3. Wählen Sie "Neues Projekt" aus
4. Geben Sie einen Projektnamen ein (z.B. "Arvo Workflows")
5. Klicken Sie auf "Erstellen"

### Schritt 2: Gmail API aktivieren
1. Navigieren Sie zu "APIs & Services" > "Bibliothek"
2. Suchen Sie nach "Gmail API"
3. Klicken Sie auf "Gmail API" und dann auf "Aktivieren"

### Schritt 3: OAuth Consent Screen konfigurieren
1. Gehen Sie zu "APIs & Services" > "OAuth-Zustimmungsbildschirm"
2. Wählen Sie "Extern" aus und klicken Sie auf "Erstellen"
3. Füllen Sie die Pflichtfelder aus:
   - App-Name: "Arvo Workflows"
   - Benutzer-Support-E-Mail: Ihre E-Mail
   - Entwickler-E-Mail: Ihre E-Mail
4. Klicken Sie auf "Speichern und fortfahren"
5. Fügen Sie Scopes hinzu:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
6. Klicken Sie auf "Speichern und fortfahren"
7. Fügen Sie Testbenutzer hinzu (Ihre E-Mail)
8. Klicken Sie auf "Zurück zum Dashboard"

### Schritt 4: OAuth 2.0 Credentials erstellen
1. Gehen Sie zu "APIs & Services" > "Anmeldedaten"
2. Klicken Sie auf "+ Anmeldedaten erstellen" > "OAuth-Client-ID"
3. Wählen Sie "Webanwendung" als Anwendungstyp
4. Geben Sie einen Namen ein (z.B. "Arvo Workflows Client")
5. Fügen Sie autorisierte JavaScript-Ursprünge hinzu:
   - `http://localhost:5173` (für Entwicklung)
   - Ihre Produktions-URL
6. Fügen Sie autorisierte Weiterleitungs-URIs hinzu:
   - `http://localhost:5173/auth/callback`
   - Ihre Produktions-Callback-URL
7. Klicken Sie auf "Erstellen"
8. **WICHTIG**: Kopieren Sie die Client-ID und den Client-Geheimcode

### Schritt 5: API-Key in Arvo Workflows eintragen
1. Öffnen Sie die Integrations-Seite in Arvo Workflows
2. Klicken Sie auf "Gmail" > "Settings"
3. Fügen Sie folgende Informationen ein:
   - **Client ID**: Ihre OAuth Client-ID
   - **Client Secret**: Ihr OAuth Client-Secret
4. Klicken Sie auf "Speichern"
5. Klicken Sie auf "Verbinden", um die OAuth-Autorisierung durchzuführen

---

## 💬 Slack API

### Schritt 1: Slack App erstellen
1. Gehen Sie zu [Slack API](https://api.slack.com/apps)
2. Klicken Sie auf "Create New App" > "From scratch"
3. Geben Sie einen App-Namen ein (z.B. "Arvo Workflows")
4. Wählen Sie Ihren Workspace aus
5. Klicken Sie auf "Create App"

### Schritt 2: Bot Token Scopes hinzufügen
1. Gehen Sie zu "OAuth & Permissions" im linken Menü
2. Scrollen Sie zu "Scopes" > "Bot Token Scopes"
3. Fügen Sie folgende Berechtigungen hinzu:
   - `chat:write` - Nachrichten senden
   - `chat:write.public` - Öffentliche Nachrichten senden
   - `channels:read` - Kanäle lesen
   - `channels:history` - Kanal-Verlauf lesen
   - `im:read` - Direktnachrichten lesen
   - `im:history` - Direktnachrichten-Verlauf lesen

### Schritt 3: App installieren
1. Scrollen Sie nach oben zu "OAuth Tokens for Your Workspace"
2. Klicken Sie auf "Install to Workspace"
3. Überprüfen Sie die Berechtigungen
4. Klicken Sie auf "Allow"
5. **WICHTIG**: Kopieren Sie den "Bot User OAuth Token" (beginnt mit `xoxb-`)

### Schritt 4: API-Key in Arvo Workflows eintragen
1. Öffnen Sie die Integrations-Seite in Arvo Workflows
2. Klicken Sie auf "Slack" > "Settings"
3. Fügen Sie den Bot Token ein:
   - **Bot Token**: `xoxb-your-token-here`
4. Klicken Sie auf "Speichern"
5. Klicken Sie auf "Verbinden", um die Verbindung zu testen

---

## 📊 Google Sheets API

### Schritt 1: Google Cloud Console Projekt (wie bei Gmail)
Falls Sie noch kein Projekt haben, folgen Sie den Schritten 1-2 aus dem Gmail Guide.

### Schritt 2: Google Sheets API aktivieren
1. Navigieren Sie zu "APIs & Services" > "Bibliothek"
2. Suchen Sie nach "Google Sheets API"
3. Klicken Sie auf "Google Sheets API" und dann auf "Aktivieren"

### Schritt 3: Service Account erstellen (empfohlen)
1. Gehen Sie zu "APIs & Services" > "Anmeldedaten"
2. Klicken Sie auf "+ Anmeldedaten erstellen" > "Servicekonto"
3. Geben Sie einen Namen ein (z.B. "Arvo Sheets Service")
4. Klicken Sie auf "Erstellen und fortfahren"
5. Überspringen Sie Rollen (optional)
6. Klicken Sie auf "Fertig"

### Schritt 4: Service Account Key generieren
1. Klicken Sie auf das erstellte Servicekonto
2. Gehen Sie zum Tab "Keys"
3. Klicken Sie auf "Add Key" > "Create new key"
4. Wählen Sie "JSON" aus
5. Klicken Sie auf "Erstellen"
6. **WICHTIG**: Die JSON-Datei wird heruntergeladen - speichern Sie sie sicher!

### Schritt 5: Google Sheet freigeben
1. Öffnen Sie die Google Sheet, die Sie verwenden möchten
2. Klicken Sie auf "Teilen" (oben rechts)
3. Fügen Sie die E-Mail-Adresse des Service Accounts ein (finden Sie in der JSON-Datei unter `client_email`)
4. Geben Sie "Bearbeiter"-Berechtigung
5. Klicken Sie auf "Senden"

### Schritt 6: API-Key in Arvo Workflows eintragen
1. Öffnen Sie die Integrations-Seite in Arvo Workflows
2. Klicken Sie auf "Google Sheets" > "Settings"
3. Laden Sie die JSON-Datei hoch oder fügen Sie den Inhalt ein
4. Klicken Sie auf "Speichern"

**Alternativ: OAuth (wie Gmail)**
- Folgen Sie den Gmail OAuth-Schritten (Schritt 3-5)
- Verwenden Sie die gleichen Credentials

---

## 📝 Notion API

### Schritt 1: Notion Integration erstellen
1. Gehen Sie zu [Notion Integrations](https://www.notion.so/my-integrations)
2. Klicken Sie auf "+ New integration"
3. Geben Sie einen Namen ein (z.B. "Arvo Workflows")
4. Wählen Sie Ihren Workspace aus
5. Wählen Sie die gewünschten Capabilities:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
6. Klicken Sie auf "Submit"
7. **WICHTIG**: Kopieren Sie den "Internal Integration Token" (beginnt mit `secret_`)

### Schritt 2: Notion Seite/Datenbank freigeben
1. Öffnen Sie die Notion-Seite oder -Datenbank, die Sie verwenden möchten
2. Klicken Sie auf die drei Punkte oben rechts
3. Wählen Sie "Connections"
4. Suchen Sie nach Ihrer Integration ("Arvo Workflows")
5. Klicken Sie darauf, um sie zu verbinden

### Schritt 3: API-Key in Arvo Workflows eintragen
1. Öffnen Sie die Integrations-Seite in Arvo Workflows
2. Klicken Sie auf "Notion" > "Settings"
3. Fügen Sie den Integration Token ein:
   - **API Key**: `secret_your-token-here`
4. Klicken Sie auf "Speichern"
5. Klicken Sie auf "Verbinden", um die Verbindung zu testen

### Schritt 4: Datenbank-ID finden
1. Öffnen Sie Ihre Notion-Datenbank in einem Browser
2. Die URL sieht so aus: `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. Kopieren Sie die `DATABASE_ID` (32 Zeichen, Hex-String)
4. Verwenden Sie diese ID in Ihren Workflows

---

## 🔗 Webhooks

Webhooks benötigen keine API-Keys, da Sie URLs verwenden.

### Schritt 1: Webhook-URL erhalten
1. Identifizieren Sie den Service, der Webhooks senden soll
2. Erstellen Sie eine Webhook-URL in Ihrem Ziel-Service
3. Kopieren Sie die Webhook-URL

### Schritt 2: Webhook in Arvo Workflows konfigurieren
1. Erstellen Sie einen neuen Workflow
2. Wählen Sie "Webhook" als Trigger
3. Kopieren Sie die generierte Webhook-URL
4. Fügen Sie diese URL in Ihrem externen Service ein

### Schritt 3: Webhook als Action verwenden
1. Fügen Sie eine "Webhook"-Action zu Ihrem Workflow hinzu
2. Geben Sie die Ziel-URL ein
3. Wählen Sie die HTTP-Methode (GET, POST, PUT, DELETE)
4. Fügen Sie optional Headers hinzu
5. Konfigurieren Sie den Body (JSON, Form-Data, etc.)

---

## 🔒 Allgemeine Sicherheitshinweise

### ✅ Best Practices

1. **API-Keys niemals committen**
   - Fügen Sie `.env` zu Ihrer `.gitignore` hinzu
   - Verwenden Sie Umgebungsvariablen für API-Keys

2. **Regelmäßig rotieren**
   - Ändern Sie API-Keys regelmäßig (alle 90 Tage)
   - Überwachen Sie API-Key-Verwendung

3. **Minimale Berechtigungen**
   - Gewähren Sie nur die notwendigsten Scopes/Berechtigungen
   - Prüfen Sie regelmäßig, welche Berechtigungen aktiv sind

4. **Sichere Speicherung**
   - Verwenden Sie verschlüsselte Speicherung für Credentials
   - Nutzen Sie Secrets Management Tools (z.B. AWS Secrets Manager)

5. **Monitoring**
   - Überwachen Sie API-Key-Verwendung auf verdächtige Aktivitäten
   - Setzen Sie Rate Limits, wo möglich

### ⚠️ Was zu vermeiden ist

- ❌ API-Keys in öffentlichen Repositories speichern
- ❌ API-Keys in Client-seitigem Code verwenden
- ❌ API-Keys per E-Mail oder unverschlüsselte Kommunikation teilen
- ❌ Übermäßige Berechtigungen gewähren
- ❌ API-Keys in Log-Dateien ausgeben

### 🔐 Credential-Management in Arvo Workflows

Arvo Workflows speichert Ihre Credentials verschlüsselt:
- Credentials werden lokal in Ihrem Browser gespeichert
- Für Produktionsumgebungen: Verwenden Sie einen Backend-Service für Credential-Management

---

## 🆘 Fehlerbehebung

### Gmail: "Access blocked: This app's request is invalid"
- **Lösung**: Überprüfen Sie die autorisierten Redirect URIs in der Google Cloud Console

### Slack: "invalid_auth"
- **Lösung**: Überprüfen Sie, ob der Bot Token korrekt ist und die App im Workspace installiert ist

### Google Sheets: "The caller does not have permission"
- **Lösung**: Stellen Sie sicher, dass das Service Account Zugriff auf die Sheet hat

### Notion: "Unauthorized"
- **Lösung**: Überprüfen Sie, ob die Integration mit der Notion-Seite verbunden ist

---

## 📞 Support

Bei Problemen mit API-Keys oder Integrationen:
1. Überprüfen Sie die offizielle Dokumentation des Services
2. Kontaktieren Sie den Support über die Settings-Seite
3. Überprüfen Sie die Fehlerprotokolle in der Browser-Konsole

---

**Letzte Aktualisierung**: 2024
**Version**: 1.0

