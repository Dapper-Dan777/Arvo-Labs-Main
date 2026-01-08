/**
 * 2FA (Zwei-Faktor-Authentifizierung) Service mit TOTP
 * Verwendet RFC 6238 Time-based One-Time Password (TOTP)
 */

import { authenticator } from "otplib";
import QRCode from "qrcode";

// Konfiguration für TOTP
authenticator.options = {
  step: 30, // Token ist 30 Sekunden gültig
  window: 1, // Erlaubt 1 Token vor/nach dem aktuellen Token
};

export interface TwoFactorSecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

/**
 * Generiert einen neuen 2FA-Secret für einen User
 */
export function generate2FASecret(userEmail: string, serviceName: string = "Arvo Dashboard"): TwoFactorSecret {
  // Generiere Secret
  const secret = authenticator.generateSecret();

  // Erstelle OTPAuth-URL für QR-Code
  const otpAuthUrl = authenticator.keyuri(userEmail, serviceName, secret);

  // Generiere Backup-Codes (10 Codes, je 8 Zeichen)
  const backupCodes = Array.from({ length: 10 }, () => {
    return Array.from({ length: 8 }, () => {
      return Math.floor(Math.random() * 10).toString();
    }).join("");
  });

  return {
    secret,
    qrCodeUrl: otpAuthUrl, // QR-Code wird client-seitig generiert
    backupCodes,
  };
}

/**
 * Generiert QR-Code als Data URL
 */
export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR-Code konnte nicht generiert werden");
  }
}

/**
 * Verifiziert einen TOTP-Code
 */
export function verifyTOTPCode(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error("Error verifying TOTP:", error);
    return false;
  }
}

/**
 * Generiert einen aktuellen TOTP-Code (für Tests)
 */
export function generateTOTPCode(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Validiert einen Backup-Code
 */
export function validateBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code);
}

/**
 * Entfernt einen verwendeten Backup-Code
 */
export function removeUsedBackupCode(code: string, backupCodes: string[]): string[] {
  return backupCodes.filter((c) => c !== code);
}








