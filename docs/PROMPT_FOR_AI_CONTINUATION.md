# Prompt-Vorlage für AI-Assistenten

Dies ist eine Vorlage, die du verwenden kannst, nachdem Comet den Status-Check durchgeführt hat.

---

## Standard-Format:

```
Hier ist der aktuelle Stand meiner Zapier-Integration:

[FÜGE HIER DEN STATUS-REPORT VON COMET EIN]

Bitte fahre mit der Implementierung dort fort, wo ich gerade stehe. 
Konkret sollst du:

[FÜGE HIER DIE NÄCHSTEN SCHRITTE VON COMET EIN]

Beginne mit [ERSTER PUNKT] und arbeite dich dann durch die Liste.
```

---

## Beispiel (ausgefüllt):

```
Hier ist der aktuelle Stand meiner Zapier-Integration:

✅ Vorhanden:
- Monitoring-Seite: /dashboard/team/automations/monitoring
- API Route: /api/automations/monitoring-logs
- Hook: use-monitoring-data.ts

❌ Fehlt:
- Zapier API Client Service
- Zap Management
- Apps/Triggers/Actions aus Zapier API laden

Bitte fahre mit der Implementierung dort fort, wo ich gerade stehe.
Konkret sollst du:

1. Zapier API Client erstellen (src/lib/zapier/api.ts)
   - Authentifizierung mit ZAPIER_API_KEY
   - Wrapper für alle Zapier API Endpoints
   - GET /v1/zaps, POST /v1/zaps, etc.

2. Environment Variables Setup dokumentieren
   - Welche Variablen werden benötigt?
   - Wo finde ich die Werte?

3. Erste API Route für Zap Management erstellen
   - GET /api/zapier/zaps (Liste aller Zaps)

Beginne mit dem Zapier API Client und arbeite dich dann durch die Liste.
```

