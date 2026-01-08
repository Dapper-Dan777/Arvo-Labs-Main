import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  documentType: string;
}

export function AIAnalysisDialog({
  open,
  onOpenChange,
  documentTitle,
  documentType,
}: AIAnalysisDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    // Simuliere KI-Analyse (in Produktion würde hier eine echte API aufgerufen)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generiere realistische Analyse basierend auf Dokument-Typ
    const mockAnalysis = generateMockAnalysis(documentTitle, documentType);
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const generateMockAnalysis = (title: string, type: string): string => {
    const analyses: Record<string, string> = {
      PDF: `Das Dokument "${title}" ist ein PDF-Dokument. Basierend auf der Analyse:

**Zusammenfassung:**
- Dokumenttyp: PDF
- Geschätzter Umfang: Mittel
- Wichtige Themen: Projektmanagement, Planung

**Empfehlungen:**
- Dokument sollte regelmäßig aktualisiert werden
- Enthält wichtige Informationen für das Team
- Empfohlen: Mit Team teilen für bessere Zusammenarbeit

**Nächste Schritte:**
1. Dokument mit relevanten Teammitgliedern teilen
2. Regelmäßige Überprüfung der Inhalte
3. Versionierung für bessere Nachverfolgbarkeit`,

      Excel: `Das Dokument "${title}" ist eine Excel-Datei. Analyse:

**Zusammenfassung:**
- Dokumenttyp: Excel-Tabelle
- Geschätzter Umfang: Datenanalyse
- Wichtige Themen: Zahlen, Statistiken, Berechnungen

**Empfehlungen:**
- Daten sollten regelmäßig aktualisiert werden
- Prüfe auf Formeln und Berechnungen
- Empfohlen: Backup erstellen

**Nächste Schritte:**
1. Datenvalidierung durchführen
2. Formeln überprüfen
3. Regelmäßige Backups einrichten`,

      Word: `Das Dokument "${title}" ist ein Word-Dokument. Analyse:

**Zusammenfassung:**
- Dokumenttyp: Word-Dokument
- Geschätzter Umfang: Textdokument
- Wichtige Themen: Textinhalt, Formatierung

**Empfehlungen:**
- Dokument sollte regelmäßig überarbeitet werden
- Formatierung prüfen
- Empfohlen: Versionierung aktivieren

**Nächste Schritte:**
1. Dokument überprüfen und aktualisieren
2. Formatierung konsistent halten
3. Mit Team teilen für Feedback`,

      PowerPoint: `Das Dokument "${title}" ist eine PowerPoint-Präsentation. Analyse:

**Zusammenfassung:**
- Dokumenttyp: Präsentation
- Geschätzter Umfang: Präsentationsfolien
- Wichtige Themen: Präsentation, Visualisierung

**Empfehlungen:**
- Präsentation sollte regelmäßig aktualisiert werden
- Design konsistent halten
- Empfohlen: Mit Team teilen für Feedback

**Nächste Schritte:**
1. Präsentation überprüfen
2. Design konsistent halten
3. Mit Team teilen für Feedback`,
    };

    return analyses[type] || `Analyse für "${title}" (Typ: ${type}) wird vorbereitet...`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            KI-Analyse: {documentTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {!analysis && !isAnalyzing && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground mb-4">
                Starte die KI-Analyse, um wichtige Erkenntnisse über dieses Dokument zu erhalten.
              </p>
              <Button onClick={handleAnalyze} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Analyse starten
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">
                Analysiere Dokument... Dies kann einen Moment dauern.
              </p>
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground">
                    {analysis}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null);
                    onOpenChange(false);
                  }}
                >
                  Schließen
                </Button>
                <Button
                  onClick={handleAnalyze}
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Erneut analysieren
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
