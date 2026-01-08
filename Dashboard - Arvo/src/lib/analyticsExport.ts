import { useToast } from "@/hooks/use-toast";

export function exportToCSV(data: any[], filename: string = "analytics-export") {
  if (!data || data.length === 0) {
    throw new Error("Keine Daten zum Exportieren");
  }

  // Erstelle CSV-Header
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");
  
  // Erstelle CSV-Rows
  const csvRows = data.map((row) => {
    return headers.map((header) => {
      const value = row[header];
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }
      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
      }
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",");
  });
  
  // Kombiniere alles
  const csvContent = [csvHeaders, ...csvRows].join("\n");
  
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

export function exportToJSON(data: any, filename: string = "analytics-export") {
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

export async function exportChartAsImage(
  chartElement: HTMLElement | null,
  filename: string = "chart-export"
): Promise<void> {
  if (!chartElement) {
    throw new Error("Chart-Element nicht gefunden");
  }

  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(chartElement, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Konnte Bild nicht erstellen");
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (error) {
    console.error("Fehler beim Export:", error);
    throw new Error("Screenshot-Export fehlgeschlagen");
  }
}

export function exportToExcel(data: any[], filename: string = "analytics-export"): void {
  // Für Excel-Export verwenden wir CSV (Excel kann CSV öffnen)
  // Für echten Excel-Export würde man eine Bibliothek wie xlsx verwenden
  exportToCSV(data, filename);
}

