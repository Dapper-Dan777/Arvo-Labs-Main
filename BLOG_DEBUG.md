# Warum werden keine Blog-Posts angezeigt?

## Mögliche Ursachen:

1. **Import-Problem**: Vite kann die `.md` Dateien nicht laden
2. **Pfad-Problem**: Die Dateien sind nicht am erwarteten Ort
3. **Frontmatter-Problem**: Die Markdown-Dateien haben kein korrektes Frontmatter
4. **Render-Problem**: Die Posts werden geladen, aber nicht gerendert

## Debugging-Schritte:

1. Öffne die Browser-Konsole (F12)
2. Prüfe die Meldungen:
   - "Starte Blog-Posts Laden..."
   - "Blog-Posts werden geladen... X Dateien gefunden"
   - "Erfolgreich X Blog-Posts geladen"
   - "✅ Geladene Blog-Posts: X"

3. Prüfe ob Fehler angezeigt werden:
   - Rote Fehlermeldungen?
   - "Cannot find module" Fehler?
   - "Failed to load" Fehler?

## Lösung:

Die Blog-Posts werden über statische Imports in `src/lib/blog-posts-data.ts` geladen.
Wenn diese Imports nicht funktionieren, werden keine Posts angezeigt.

