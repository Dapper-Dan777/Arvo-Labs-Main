// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================
// Zentrale Funktionen für Datum- und Zeit-Berechnungen

/**
 * Gibt das heutige Datum im ISO-Format zurück (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Berechnet ein Datum vor X Tagen
 */
export function getDateDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Berechnet ein Datum vor X Tagen im ISO-Format
 */
export function getDateDaysAgoISO(days: number): string {
  return getDateDaysAgo(days).toISOString().split('T')[0];
}

/**
 * Prüft, ob ein Datum heute ist
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayISO();
}

/**
 * Prüft, ob ein Datum in der letzten Woche liegt
 */
export function isInLastWeek(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const weekAgo = getDateDaysAgo(7);
  return dateObj >= weekAgo;
}

/**
 * Prüft, ob ein Datum in einem bestimmten Zeitraum liegt
 */
export function isInDateRange(
  date: Date | string,
  startDate: Date,
  endDate: Date
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj >= startDate && dateObj <= endDate;
}

/**
 * Formatiert ein Datum für die Anzeige (de-DE)
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return dateObj.toLocaleDateString('de-DE', options || defaultOptions);
}

/**
 * Formatiert eine Zeit für die Anzeige
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Berechnet die Anzahl der Tage zwischen zwei Datumsangaben
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gibt die Wochentage der letzten 7 Tage zurück
 */
export function getLast7Days(): Array<{ date: string; dayName: string; dayShort: string }> {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = getDateDaysAgo(i);
    const dateStr = date.toISOString().split('T')[0];
    const dayIndex = date.getDay();
    
    result.push({
      date: dateStr,
      dayName: dayNames[dayIndex],
      dayShort: days[dayIndex],
    });
  }
  
  return result;
}

/**
 * Berechnet den Start einer Woche (Montag)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Montag als Wochenstart
  return new Date(d.setDate(diff));
}

/**
 * Berechnet den Start eines Monats
 */
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Berechnet den Start eines Jahres
 */
export function getYearStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 0, 1);
}
