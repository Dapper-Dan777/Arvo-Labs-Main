// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validiert das Dauer-Format für TimeEntries
 * Akzeptiert: "2h 30m", "3h", "45m", "1h 15m"
 */
export function validateDuration(duration: string): { valid: boolean; error?: string } {
  if (!duration || !duration.trim()) {
    return { valid: false, error: 'Dauer ist erforderlich' };
  }

  const trimmed = duration.trim();
  const durationRegex = /^(\d+h\s*)?(\d+m?)?$/i;
  
  if (!durationRegex.test(trimmed)) {
    return { 
      valid: false, 
      error: 'Ungültiges Format. Verwende "2h 30m", "3h" oder "45m"' 
    };
  }

  // Prüfe, ob mindestens Stunden oder Minuten angegeben sind
  const hasHours = /\d+h/i.test(trimmed);
  const hasMinutes = /\d+m/i.test(trimmed);
  
  if (!hasHours && !hasMinutes) {
    return { 
      valid: false, 
      error: 'Bitte gib mindestens Stunden oder Minuten an' 
    };
  }

  return { valid: true };
}

/**
 * Validiert einen Task-Titel
 */
export function validateTaskTitle(title: string): { valid: boolean; error?: string } {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Titel ist erforderlich' };
  }

  const trimmed = title.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Titel muss mindestens 3 Zeichen lang sein' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: 'Titel darf maximal 200 Zeichen lang sein' };
  }

  return { valid: true };
}

/**
 * Validiert einen Projektnamen
 */
export function validateProjectName(project: string): { valid: boolean; error?: string } {
  if (!project || !project.trim()) {
    return { valid: false, error: 'Projektname ist erforderlich' };
  }

  const trimmed = project.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Projektname muss mindestens 3 Zeichen lang sein' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Projektname darf maximal 100 Zeichen lang sein' };
  }

  return { valid: true };
}

/**
 * Validiert ein Datum
 */
export function validateDate(date: string): { valid: boolean; error?: string } {
  if (!date) {
    return { valid: false, error: 'Datum ist erforderlich' };
  }

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Ungültiges Datum' };
  }

  // Prüfe, ob Datum nicht in der Zukunft liegt (für TimeEntries)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (dateObj > today) {
    return { valid: false, error: 'Datum darf nicht in der Zukunft liegen' };
  }

  return { valid: true };
}
