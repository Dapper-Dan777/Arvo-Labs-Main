export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: "weak",
      score: 0,
      feedback: [],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Länge
  if (password.length >= 8) {
    score += 25;
  } else if (password.length >= 6) {
    score += 15;
    feedback.push("Mindestens 8 Zeichen empfehlenswert");
  } else {
    feedback.push("Zu kurz (mindestens 6 Zeichen)");
  }

  if (password.length >= 12) {
    score += 10;
  }

  // Großbuchstaben
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Großbuchstaben hinzufügen");
  }

  // Kleinbuchstaben
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Kleinbuchstaben hinzufügen");
  }

  // Zahlen
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push("Zahlen hinzufügen");
  }

  // Sonderzeichen
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Sonderzeichen hinzufügen für mehr Sicherheit");
  }

  // Bestimme Stärke
  let strength: PasswordStrength;
  if (score < 40) {
    strength = "weak";
  } else if (score < 60) {
    strength = "fair";
  } else if (score < 80) {
    strength = "good";
  } else {
    strength = "strong";
  }

  return {
    strength,
    score: Math.min(100, score),
    feedback: feedback.slice(0, 2), // Max 2 Feedback-Punkte
  };
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "bg-red-500";
    case "fair":
      return "bg-orange-500";
    case "good":
      return "bg-yellow-500";
    case "strong":
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
}

export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "Schwach";
    case "fair":
      return "Akzeptabel";
    case "good":
      return "Gut";
    case "strong":
      return "Stark";
    default:
      return "";
  }
}

