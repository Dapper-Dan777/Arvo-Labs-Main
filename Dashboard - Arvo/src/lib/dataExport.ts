import { useToast } from "@/hooks/use-toast";

export type ExportFormat = "csv" | "json" | "excel";

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  if (!data || data.length === 0) {
    throw new Error("Keine Daten zum Exportieren");
  }

  const { filename = "export", includeHeaders = true } = options;

  // Erstelle CSV-Header
  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  if (includeHeaders) {
    csvRows.push(headers.join(","));
  }

  // Erstelle CSV-Rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) {
        return "";
      }
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  });

  // Kombiniere alles
  const csvContent = csvRows.join("\n");

  // Erstelle Blob und Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON<T>(data: T, options: ExportOptions = {}): void {
  const { filename = "export" } = options;
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  // Für Excel verwenden wir CSV (Excel kann CSV öffnen)
  // Für echten Excel-Export würde man eine Bibliothek wie xlsx verwenden
  exportToCSV(data, options);
}

export function importFromJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        resolve(json as T);
      } catch (error) {
        reject(new Error("Ungültiges JSON-Format"));
      }
    };
    reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei"));
    reader.readAsText(file);
  });
}

export function importFromCSV<T extends Record<string, any>>(
  file: File
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split("\n");
        if (lines.length < 2) {
          reject(new Error("CSV-Datei ist leer oder hat keine Daten"));
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const data: T[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const row: any = {};
          headers.forEach((header, index) => {
            let value: any = values[index] || "";
            // Versuche JSON zu parsen
            try {
              value = JSON.parse(value);
            } catch {
              // Bleibt String
            }
            row[header] = value;
          });
          data.push(row as T);
        }

        resolve(data);
      } catch (error) {
        reject(new Error("Fehler beim Parsen der CSV-Datei"));
      }
    };
    reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei"));
    reader.readAsText(file);
  });
}

export function createBackup(data: Record<string, any>): string {
  const backup = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    data,
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreFromBackup<T>(backupJson: string): T {
  const backup = JSON.parse(backupJson);
  if (!backup.data) {
    throw new Error("Ungültiges Backup-Format");
  }
  return backup.data as T;
}






