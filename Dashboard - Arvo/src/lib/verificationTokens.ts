/**
 * Verwaltung von Verifizierungs-Tokens
 * Für E-Mail-Verifizierung, Passwort-Reset, etc.
 */

import { setEncryptedItem, getEncryptedItem, removeEncryptedItem } from "./crypto";

export interface VerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
  type: "email_verification" | "password_reset" | "email_update";
  used?: boolean;
}

const TOKEN_EXPIRY = {
  email_verification: 24 * 60 * 60 * 1000, // 24 Stunden
  password_reset: 1 * 60 * 60 * 1000, // 1 Stunde
  email_update: 1 * 60 * 60 * 1000, // 1 Stunde
};

/**
 * Generiert einen sicheren Verifizierungs-Token
 */
export function generateVerificationToken(): string {
  // Generiere einen sicheren Token (32 Zeichen)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 32 }, () => {
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
}

/**
 * Erstellt einen Verifizierungs-Token und speichert ihn verschlüsselt
 */
export function createVerificationToken(
  userId: string,
  email: string,
  type: VerificationToken["type"]
): string {
  const token = generateVerificationToken();
  const expiresAt = Date.now() + TOKEN_EXPIRY[type];

  const tokenData: VerificationToken = {
    token,
    userId,
    email,
    expiresAt,
    type,
    used: false,
  };

  // Speichere Token verschlüsselt
  setEncryptedItem(`verification_token_${token}`, JSON.stringify(tokenData));

  // Setze auch Index für schnelle Suche
  const tokens = getVerificationTokensByUser(userId);
  tokens.push(token);
  setEncryptedItem(`verification_tokens_${userId}`, JSON.stringify(tokens));

  return token;
}

/**
 * Verifiziert einen Token
 */
export function verifyToken(token: string): VerificationToken | null {
  try {
    const tokenDataStr = getEncryptedItem(`verification_token_${token}`);
    if (!tokenDataStr) {
      return null;
    }

    const tokenData: VerificationToken = JSON.parse(tokenDataStr);

    // Prüfe ob Token bereits verwendet wurde
    if (tokenData.used) {
      return null;
    }

    // Prüfe ob Token abgelaufen ist
    if (Date.now() > tokenData.expiresAt) {
      // Lösche abgelaufenen Token
      removeVerificationToken(token);
      return null;
    }

    return tokenData;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

/**
 * Markiert einen Token als verwendet
 */
export function markTokenAsUsed(token: string): boolean {
  try {
    const tokenDataStr = getEncryptedItem(`verification_token_${token}`);
    if (!tokenDataStr) {
      return false;
    }

    const tokenData: VerificationToken = JSON.parse(tokenDataStr);
    tokenData.used = true;

    setEncryptedItem(`verification_token_${token}`, JSON.stringify(tokenData));
    return true;
  } catch (error) {
    console.error("Error marking token as used:", error);
    return false;
  }
}

/**
 * Entfernt einen Verifizierungs-Token
 */
export function removeVerificationToken(token: string): void {
  try {
    const tokenData = verifyToken(token);
    if (tokenData) {
      removeEncryptedItem(`verification_token_${token}`);
      
      // Entferne aus Index
      const tokens = getVerificationTokensByUser(tokenData.userId);
      const updatedTokens = tokens.filter((t) => t !== token);
      setEncryptedItem(`verification_tokens_${tokenData.userId}`, JSON.stringify(updatedTokens));
    } else {
      // Versuche trotzdem zu entfernen (falls Token ungültig ist)
      removeEncryptedItem(`verification_token_${token}`);
    }
  } catch (error) {
    console.error("Error removing token:", error);
  }
}

/**
 * Holt alle Tokens eines Users (für Verwaltung)
 */
function getVerificationTokensByUser(userId: string): string[] {
  try {
    const tokensStr = getEncryptedItem(`verification_tokens_${userId}`);
    if (!tokensStr) {
      return [];
    }
    return JSON.parse(tokensStr);
  } catch (error) {
    console.error("Error getting tokens by user:", error);
    return [];
  }
}

/**
 * Bereinigt abgelaufene Tokens eines Users
 */
export function cleanupExpiredTokens(userId: string): void {
  try {
    const tokens = getVerificationTokensByUser(userId);
    const validTokens: string[] = [];

    for (const token of tokens) {
      const tokenData = verifyToken(token);
      if (tokenData) {
        validTokens.push(token);
      }
    }

    setEncryptedItem(`verification_tokens_${userId}`, JSON.stringify(validTokens));
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
  }
}








