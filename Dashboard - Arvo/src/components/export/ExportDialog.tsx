import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { exportToCSV, exportToJSON, exportToExcel, type ExportFormat } from "@/lib/dataExport";
import { useToast } from "@/hooks/use-toast";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
  filename?: string;
  title?: string;
}

export function ExportDialog({ open, onOpenChange, data, filename = "export", title = "Daten exportieren" }: ExportDialogProps) {
  const { toast } = useToast();
  const [format, setFormat] = useState<ExportFormat>("csv");

  const handleExport = () => {
    try {
      switch (format) {
        case "csv":
          exportToCSV(data, { filename });
          break;
        case "json":
          exportToJSON(data, { filename });
          break;
        case "excel":
          exportToExcel(data, { filename });
          break;
      }
      toast({
        title: "Export erfolgreich",
        description: `Daten wurden als ${format.toUpperCase()} exportiert.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Wählen Sie das Format für den Export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Export-Format</Label>
            <Select value={format} onValueChange={(value: ExportFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV (Comma Separated Values)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON (JavaScript Object Notation)
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel (CSV-Format)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{data.length} Einträge werden exportiert.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}






