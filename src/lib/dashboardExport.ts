// Dashboard Export Utilities (aus Vite-Dashboard übernommen)
import html2canvas from "html2canvas";
import type { DashboardData } from "./dashboardTypes";

export type { DashboardData as ExportDashboardData };

/**
 * Export Dashboard als PNG Bild
 */
export async function exportDashboardAsImage(
  element: HTMLElement,
  filename: string = "dashboard-export",
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: window.getComputedStyle(document.body).backgroundColor || "#ffffff",
    scale: 2,
    logging: false,
    useCORS: true,
    scrollY: -window.scrollY,
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
}

/**
 * Export Dashboard als PDF (verwendet jsPDF wenn verfügbar, sonst Bild-Export)
 */
export async function exportDashboardAsPDF(
  element: HTMLElement,
  filename: string = "dashboard-export",
): Promise<void> {
  try {
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(element, {
      backgroundColor: window.getComputedStyle(document.body).backgroundColor || "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 297; // A4 width in mm
    const pageHeight = 210; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.warn("jsPDF nicht verfügbar, verwende Bild-Export:", error);
    await exportDashboardAsImage(element, filename);
    throw new Error("PDF-Export benötigt jsPDF. Bitte installieren Sie jspdf mit: npm install jspdf");
  }
}

/**
 * Export Dashboard-Daten als Excel (CSV Format)
 */
export function exportDashboardToExcel(
  data: DashboardData,
  filename: string = "dashboard-export",
): void {
  const csvRows: string[] = [];

  if (data.stats && data.stats.length > 0) {
    csvRows.push("=== STATISTIKEN ===");
    csvRows.push("Titel,Wert,Änderung,Trend");
    data.stats.forEach((stat) => {
      csvRows.push(`"${stat.title}","${stat.value}","${stat.change}","${stat.trend}"`);
    });
    csvRows.push("");
  }

  if (data.chartData && data.chartData.length > 0) {
    csvRows.push("=== CHART-DATEN ===");
    csvRows.push("Name,Workflows,Ausführungen");
    data.chartData.forEach((chart) => {
      csvRows.push(`"${chart.name}",${chart.workflows || 0},${chart.executions || 0}`);
    });
    csvRows.push("");
  }

  if (data.activities && data.activities.length > 0) {
    csvRows.push("=== AKTIVITÄTEN ===");
    csvRows.push("Workflow,Status,Zeit");
    data.activities.forEach((activity) => {
      csvRows.push(`"${activity.workflow}","${activity.status}","${activity.time}"`);
    });
    csvRows.push("");
  }

  if (data.topWorkflows && data.topWorkflows.length > 0) {
    csvRows.push("=== TOP WORKFLOWS ===");
    csvRows.push("Name,Ausführungen,Erfolgsrate");
    data.topWorkflows.forEach((workflow) => {
      csvRows.push(`"${workflow.name}",${workflow.executions || 0},${workflow.success || 0}%`);
    });
  }

  const csvContent = csvRows.join("\n");
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



