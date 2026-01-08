# Comet Status Check Prompt

Kopiere diesen Prompt und gib ihn an Comet, um den aktuellen Stand der Zapier-Integration zu prüfen:

---

**Prompt für Comet:**

```
Analysiere bitte den aktuellen Stand meiner Zapier-Integration in meinem Next.js Dashboard-Projekt und erstelle mir einen Status-Report.

Bitte prüfe folgende Punkte:

1. **Zapier API Setup:**
   - Sind Environment Variables für Zapier vorhanden? (ZAPIER_API_KEY, ZAPIER_ACCOUNT_ID, etc.)
   - Gibt es bereits eine Zapier API Client Implementation?
   - Wo befinden sich die Dateien? (Pfade)

2. **Aktueller Implementierungsstand:**
   - Welche Zapier-Funktionen sind bereits implementiert?
   - Was fehlt noch?
   - Welche Dateien existieren bereits für Zapier-Integration?

3. **Struktur-Analyse:**
   - Welche API Routes existieren für Zapier?
   - Welche Hooks/Komponenten gibt es bereits?
   - Welche Dokumentation existiert?

4. **Nächste Schritte:**
   - Was sollte als nächstes implementiert werden?
   - Welche Abhängigkeiten fehlen noch?

Bitte erstelle mir einen strukturierten Report mit:
- ✅ Was bereits vorhanden ist
- ⚠️ Was teilweise vorhanden ist
- ❌ Was noch fehlt
- 📋 Konkrete nächste Schritte
- 💡 Ein kurzer Prompt, den ich an meinen AI-Assistenten geben kann, um genau da weiterzumachen wo ich stehe

Formatiere den Report übersichtlich und gebe am Ende einen fertigen Prompt aus, den ich direkt verwenden kann.
```

---

## Verwendung

1. Kopiere den Prompt oben
2. Gib ihn an Comet
3. Comet analysiert dein Projekt
4. Du bekommst einen Status-Report und einen fertigen Prompt
5. Gib den fertigen Prompt an mich (Auto), dann kann ich genau da weitermachen, wo du stehst

## Beispiel-Output (was du erwarten könntest)

```
STATUS REPORT - Zapier Integration

✅ Vorhanden:
- Monitoring-Seite: /dashboard/team/automations/monitoring
- API Route: /api/automations/monitoring-logs
- Hook: use-monitoring-data.ts
- Dokumentation: ZAPIER_MONITORING_SETUP.md, ZAPIER_INTEGRATION_ROADMAP.md

⚠️ Teilweise:
- Zapier API Integration: Nur für Monitoring-Logs (Tables), keine vollständige API Client

❌ Fehlt:
- Zapier API Client Service
- Zap Management (Erstellen/Bearbeiten/Aktivieren)
- Apps/Triggers/Actions aus Zapier API laden
- Task History Integration
- Webhook Management

📋 Nächste Schritte:
1. Zapier API Client erstellen (src/lib/zapier/api.ts)
2. Environment Variables Setup dokumentieren
3. Zap Management API Routes erstellen

---

FERTIGER PROMPT FÜR AI-ASSISTENTEN:
[Hier kommt der Prompt, den du direkt verwenden kannst]
```

