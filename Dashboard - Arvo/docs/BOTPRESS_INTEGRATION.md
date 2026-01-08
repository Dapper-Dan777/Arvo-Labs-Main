# Botpress Integration

Die Botpress-Integration wurde erfolgreich in die bestehende Chatbots-Sektion integriert.

## Übersicht

Botpress wurde als Teil der bestehenden Chatbots-Funktionalität integriert. Jeder Chatbot kann optional eine Botpress Bot ID haben, die dann in der Detail-Ansicht verwaltet werden kann.

## Datenmodell

### ChatbotConfig Interface (erweitert)

```typescript
interface ChatbotConfig {
  // ... bestehende Felder ...
  
  // Botpress Integration
  botpressBotId?: string;
  botpressEmbedConfig?: {
    composerPlaceholder?: string;
    botName?: string;
    botAvatar?: string;
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any; // Für weitere Botpress-Konfigurationen
  };
}
```

## Features

### 1. Botpress Tab in Chatbot-Detail-Seite

Wenn ein Chatbot eine `botpressBotId` hat, wird automatisch ein "Botpress" Tab in der Detail-Seite angezeigt.

**Tab-Funktionen:**
- **In Botpress öffnen**: Öffnet den Botpress Studio für diesen Bot (neuer Tab)
- **Embed-Code generieren**: Generiert eine HTML-Datei mit dem Botpress Webchat Embed-Code
- **Preview öffnen**: Öffnet die Preview-Seite in einem neuen Tab

### 2. Botpress Konfiguration

Im Botpress Tab können folgende Einstellungen vorgenommen werden:
- **Botpress Bot ID**: Die ID des Bots (erforderlich)
- **Composer Placeholder**: Platzhalter-Text für das Eingabefeld
- **Bot Name**: Name des Bots
- **Bot Avatar URL**: URL zum Avatar-Bild des Bots

### 3. Preview-Seite

Die Preview-Seite (`/chatbots/:id/preview`) wurde erweitert, um Botpress Webchat zu rendern:

- Lädt den Botpress Webchat Script von `https://cdn.botpress.cloud/webchat/v3.3/inject.js`
- Initialisiert den Webchat mit `window.botpress.init()`
- Rendert den Webchat im Container `#webchat-container`

### 4. Embed-Code-Generierung

Beim Klick auf "Embed-Code generieren" wird eine HTML-Datei heruntergeladen, die folgendes enthält:

```html
<!-- Botpress Webchat Embed für {Bot-Name} -->
<div id="webchat-container"></div>
<script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
<script>
  window.botpress.init({
    botId: "{BOTPRESS_BOT_ID}",
    clientId: "{BOTPRESS_CLIENT_ID}",
    configuration: { ... }
  });
</script>
```

Die Datei kann direkt in eine Website eingebunden werden (vor dem schließenden `</body>` Tag).

## Environment Variables

Fügen Sie folgende Variable zu Ihrer `.env` Datei hinzu:

```env
# Botpress Configuration
VITE_BOTPRESS_CLIENT_ID=your-botpress-client-id
```

Die Client ID finden Sie im Botpress Studio unter:
**Webchat** > **Erweiterte Einstellungen** > **Client ID**

## Verwendung

### 1. Botpress Bot erstellen

1. Erstellen Sie einen Bot im Botpress Studio (https://studio.botpress.cloud/)
2. Notieren Sie sich die Bot ID
3. Notieren Sie sich die Client ID aus den Webchat-Einstellungen

### 2. Chatbot konfigurieren

1. Navigieren Sie zu `/chatbots`
2. Erstellen Sie einen neuen Chatbot oder bearbeiten Sie einen bestehenden
3. Wechseln Sie zum Tab "Botpress" (wird angezeigt, wenn `botpressBotId` gesetzt ist)
4. Geben Sie die Botpress Bot ID ein
5. Optional: Konfigurieren Sie weitere Einstellungen (Placeholder, Bot Name, Avatar)
6. Klicken Sie auf "Speichern"

### 3. Preview testen

1. Klicken Sie auf "Preview öffnen" im Botpress Tab
2. Der Botpress Webchat wird in einem neuen Tab angezeigt
3. Testen Sie die Konversation mit Ihrem Bot

### 4. Embed-Code verwenden

1. Klicken Sie auf "Embed-Code generieren"
2. Die HTML-Datei wird heruntergeladen
3. Öffnen Sie die Datei und kopieren Sie den Inhalt
4. Fügen Sie den Code vor dem schließenden `</body>` Tag Ihrer Website ein

## Technische Details

### Botpress Webchat Initialisierung

Die Preview-Seite verwendet die offizielle Botpress Webchat-Embed-Variante:

```typescript
window.botpress.init({
  botId: "botpress-bot-id",
  clientId: "botpress-client-id",
  configuration: {
    composerPlaceholder: "Schreibe eine Nachricht...",
    botName: "Support Bot",
    botAvatar: "https://example.com/avatar.png",
    // Weitere Konfigurationen...
  },
  containerId: "webchat-container",
});
```

### Script-Loading

Das Botpress Webchat Script wird dynamisch geladen:
- Script URL: `https://cdn.botpress.cloud/webchat/v3.3/inject.js`
- Wird nur einmal geladen (verwendet `scriptLoadedRef`)
- Initialisierung erfolgt nach erfolgreichem Laden

## Hinweise

- Die Botpress-Integration ist **optional** - Chatbots funktionieren auch ohne Botpress
- Der Botpress Tab wird nur angezeigt, wenn `botpressBotId` gesetzt ist
- Die Client ID muss in der `.env` Datei konfiguriert sein
- Die Preview-Seite zeigt einen Fehler, wenn keine Bot ID konfiguriert ist

## Weiterführende Dokumentation

- Botpress Webchat Dokumentation: https://botpress.com/docs/webchat/get-started
- Botpress Embedding Guide: https://botpress.com/docs/webchat/get-started/embedding-webchat

