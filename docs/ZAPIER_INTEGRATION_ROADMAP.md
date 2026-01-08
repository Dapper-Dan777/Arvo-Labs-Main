# Zapier Integration Roadmap

Vollständige Integration aller Zapier-Funktionen in die Automations-Seite.

## 🎯 Ziel

Alle Zapier-Funktionen direkt im Dashboard verwenden:
- ✅ Zaps erstellen, bearbeiten, aktivieren/deaktivieren
- ✅ Alle verfügbaren Apps/Triggers/Actions aus Zapier laden
- ✅ Task History und Logs anzeigen
- ✅ Webhooks senden/empfangen
- ✅ Tables verwalten
- ✅ Code Steps erstellen
- ✅ Paths (Conditional Logic)

## 📋 Komponenten

### 1. Zapier API Client (`src/lib/zapier/api.ts`)
- Authentifizierung mit Zapier API Key
- Wrapper für alle Zapier API Endpoints
- Error Handling & Retry Logic

### 2. API Routes
- `/api/zapier/zaps` - Zaps verwalten (GET, POST, PUT, DELETE)
- `/api/zapier/apps` - Apps auflisten
- `/api/zapier/triggers` - Trigger für App auflisten
- `/api/zapier/actions` - Actions für App auflisten
- `/api/zapier/tasks` - Task History abrufen
- `/api/zapier/webhooks` - Webhooks verwalten
- `/api/zapier/tables` - Tables verwalten (erweitern)

### 3. Hooks
- `useZaps` - Zaps laden und verwalten
- `useZapierApps` - Apps/Triggers/Actions laden
- `useZapTasks` - Task History laden
- `useZapierWebhooks` - Webhooks verwalten

### 4. Komponenten
- `ZapList` - Liste aller Zaps
- `ZapEditor` - Zap erstellen/bearbeiten (erweitern mit Zapier API)
- `TaskHistoryView` - Task Runs anzeigen
- `WebhookManager` - Webhooks verwalten
- `CodeStepEditor` - Code Steps bearbeiten
- `AppSelector` - Apps aus Zapier laden (statt statisch)

### 5. Environment Variables
```env
ZAPIER_API_KEY=your_zapier_api_key
ZAPIER_ACCOUNT_ID=your_account_id
```

## 🔧 Zapier Platform API Endpoints

### Zaps
- `GET /v1/zaps` - Alle Zaps auflisten
- `GET /v1/zaps/{zap_id}` - Zap Details
- `POST /v1/zaps` - Zap erstellen
- `PUT /v1/zaps/{zap_id}` - Zap aktualisieren
- `DELETE /v1/zaps/{zap_id}` - Zap löschen
- `POST /v1/zaps/{zap_id}/turn-on` - Zap aktivieren
- `POST /v1/zaps/{zap_id}/turn-off` - Zap deaktivieren

### Apps
- `GET /v1/apps` - Alle Apps auflisten
- `GET /v1/apps/{app_id}` - App Details
- `GET /v1/apps/{app_id}/triggers` - Trigger für App
- `GET /v1/apps/{app_id}/actions` - Actions für App

### Tasks
- `GET /v1/zaps/{zap_id}/task-history` - Task History für Zap
- `GET /v1/tasks/{task_id}` - Task Details

### Webhooks
- `POST /v1/webhooks` - Webhook erstellen
- `GET /v1/webhooks/{webhook_id}` - Webhook Details
- `DELETE /v1/webhooks/{webhook_id}` - Webhook löschen

### Tables
- `GET /v1/tables` - Alle Tables auflisten
- `GET /v1/tables/{table_id}` - Table Details
- `GET /v1/tables/{table_id}/rows` - Rows abrufen
- `POST /v1/tables/{table_id}/rows` - Row erstellen

## 🚀 Implementierungsreihenfolge

### Phase 1: Grundlagen
1. ✅ Zapier API Client erstellen
2. ✅ Environment Variables Setup
3. ✅ Authentifizierung

### Phase 2: Apps & Actions
4. ✅ Apps aus Zapier API laden
5. ✅ Triggers/Actions dynamisch laden
6. ✅ AppSelector Komponente

### Phase 3: Zap Management
7. ✅ Zaps auflisten
8. ✅ Zap erstellen (aus Canvas)
9. ✅ Zap bearbeiten
10. ✅ Zap aktivieren/deaktivieren
11. ✅ Zap löschen

### Phase 4: Monitoring
12. ✅ Task History anzeigen
13. ✅ Task Details
14. ✅ Error Handling

### Phase 5: Erweitert
15. ✅ Webhooks verwalten
16. ✅ Tables erweitern
17. ✅ Code Steps Editor
18. ✅ Path Logic erweitern

## 📚 Dokumentation

- [Zapier Platform API Docs](https://platform.zapier.com/docs/api)
- [Zapier Authentication](https://platform.zapier.com/docs/oauth)
- [Zapier Webhooks](https://zapier.com/help/create/catch/webhooks)

