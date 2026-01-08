import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, AlertCircle } from "lucide-react";
import { createBackup, restoreFromBackup, exportToJSON, importFromJSON } from "@/lib/dataExport";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BackupRestoreProps {
  onBackup?: (backupData: string) => void;
  onRestore?: (data: any) => void;
  dataSource?: () => Record<string, any>;
}

export function BackupRestore({ onBackup, onRestore, dataSource }: BackupRestoreProps) {
  const { toast } = useToast();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);

  const handleCreateBackup = () => {
    try {
      setIsCreatingBackup(true);
      const data = dataSource ? dataSource() : {};
      const backup = createBackup(data);
      
      // Exportiere als JSON
      exportToJSON(backup, "backup");
      
      onBackup?.(backup);
      
      toast({
        title: "Backup erstellt",
        description: "Ihr Backup wurde erfolgreich erstellt und heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Backup konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackupFile(file);
    }
  };

  const handleRestore = async () => {
    if (!backupFile) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Backup-Datei aus.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRestoring(true);
      const backupJson = await importFromJSON<string>(backupFile);
      const data = restoreFromBackup(backupJson);
      
      onRestore?.(data);
      
      toast({
        title: "Backup wiederhergestellt",
        description: "Ihr Backup wurde erfolgreich wiederhergestellt.",
      });
      
      setBackupFile(null);
    } catch (error) {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Backup konnte nicht wiederhergestellt werden",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup & Wiederherstellung
        </CardTitle>
        <CardDescription>
          Erstellen Sie ein Backup Ihrer Daten oder stellen Sie ein vorhandenes Backup wieder her.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Backup erstellen */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Backup erstellen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Erstellen Sie eine Sicherungskopie Ihrer Daten. Diese kann später wiederhergestellt werden.
            </p>
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
              <Download className="h-4 w-4 mr-2" />
              {isCreatingBackup ? "Backup wird erstellt..." : "Backup erstellen"}
            </Button>
          </div>
        </div>

        {/* Wiederherstellung */}
        <div className="space-y-4 border-t pt-6">
          <div>
            <h3 className="font-semibold mb-2">Backup wiederherstellen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wählen Sie eine Backup-Datei aus, um Ihre Daten wiederherzustellen.
            </p>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warnung:</strong> Das Wiederherstellen eines Backups überschreibt alle aktuellen Daten.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Backup-Datei auswählen</Label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                />
                {backupFile && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{backupFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(backupFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleRestore} 
                disabled={!backupFile || isRestoring}
                variant="destructive"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isRestoring ? "Wird wiederhergestellt..." : "Backup wiederherstellen"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}






