// ============================================================================
// TIME DURATION UTILITIES
// ============================================================================
// Zentrale Funktionen für Zeit-Dauer-Berechnungen

/**
 * Parst eine Dauer-String (z.B. "2h 30m", "3h", "45m") in Minuten
 */
export function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)m?/i);
  if (match) {
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  }
  return 0;
}

/**
 * Parst eine Dauer-String in Stunden (Dezimal)
 */
export function parseDurationToHours(duration: string): number {
  return parseDurationToMinutes(duration) / 60;
}

/**
 * Formatiert Minuten in ein lesbares Format (z.B. "2h 30m")
 */
export function formatMinutesToDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Formatiert Stunden in ein lesbares Format
 */
export function formatHoursToDuration(hours: number): string {
  return formatMinutesToDuration(Math.round(hours * 60));
}

/**
 * Berechnet die Gesamtdauer aus einem Array von Dauer-Strings
 */
export function calculateTotalDuration(durations: string[]): number {
  return durations.reduce((total, duration) => {
    return total + parseDurationToMinutes(duration);
  }, 0);
}

/**
 * Formatiert eine Zeitdifferenz in ein lesbares Format
 */
export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `Vor ${diffMins} Min.`;
  if (diffHours < 24) return `Vor ${diffHours} Std.`;
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return dateObj.toLocaleDateString('de-DE');
}
