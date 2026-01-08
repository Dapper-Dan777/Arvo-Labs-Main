import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, FileJson, AlertCircle } from "lucide-react";
import { importFromJSON, importFromCSV } from "@/lib/dataExport";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
  title?: string;
  acceptedFormats?: string[];
}

export function ImportDialog({ 
  open, 
  onOpenChange, 
  onImport, 
  title = "Daten importieren",
  acceptedFormats = [".json", ".csv"]
}: ImportDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!acceptedFormats.some(format => selectedFile.name.toLowerCase().endsWith(format))) {
      setError(`Ungültiges Dateiformat. Erlaubt: ${acceptedFormats.join(", ")}`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Bitte wählen Sie eine Datei aus.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      let data: any[];

      if (extension === "json") {
        const imported = await importFromJSON(file);
        data = Array.isArray(imported) ? imported : [imported];
      } else if (extension === "csv") {
        data = await importFromCSV(file);
      } else {
        throw new Error("Ungültiges Dateiformat");
      }

      onImport(data);
      toast({
        title: "Import erfolgreich",
        description: `${data.length} Einträge wurden importiert.`,
      });
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Importieren");
      toast({
        title: "Import fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Datei zum Importieren. Unterstützte Formate: {acceptedFormats.join(", ")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Datei auswählen</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept={acceptedFormats.join(",")}
                onChange={handleFileSelect}
                className="flex-1"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                {file.name.endsWith(".json") ? (
                  <FileJson className="h-4 w-4 text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setFile(null);
            setError(null);
          }}>
            Abbrechen
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            <Upload className="h-4 w-4 mr-2" />
            {isLoading ? "Importiere..." : "Importieren"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}






