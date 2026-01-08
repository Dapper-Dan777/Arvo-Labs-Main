/**
 * Provisorische Verschlüsselungsbibliothek für Login-Daten
 * WICHTIG: Dies ist eine einfache Verschlüsselung für Demo-Zwecke.
 * In Produktion sollten Sie eine robustere Verschlüsselung verwenden.
 */

// Einfacher Base64-basierter Verschlüsselungsalgorithmus (nur für Demo)
// In Produktion: Verwenden Sie Web Crypto API oder eine Bibliothek wie crypto-js

/**
 * Verschlüsselt einen String mit einem einfachen Algorithmus
 * @param text - Der zu verschlüsselnde Text
 * @param key - Der Verschlüsselungsschlüssel (optional, verwendet einen Default-Key)
 * @returns Verschlüsselter String
 */
export function encrypt(text: string, key: string = "arvo-labs-secret-key-2024"): string {
  try {
    if (!text || text.length === 0) {
      return text;
    }
    
    // Kombiniere Text mit Key für bessere Sicherheit
    const combined = text + key;
    
    // Konvertiere zu Base64
    const encoded = btoa(combined);
    
    // Füge zusätzliche Verwirrung hinzu (einfacher XOR-ähnlicher Prozess)
    const chars = encoded.split('');
    const keyChars = key.split('');
    
    const encrypted = chars.map((char, index) => {
      const keyChar = keyChars[index % keyChars.length];
      const charCode = char.charCodeAt(0);
      const keyCode = keyChar.charCodeAt(0);
      // Einfache XOR-Verschlüsselung
      const encryptedCode = charCode ^ keyCode;
      return String.fromCharCode(encryptedCode);
    }).join('');
    
    // Finale Base64-Kodierung
    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    // Fallback: Einfaches Base64
    try {
      return btoa(text);
    } catch {
      return text;
    }
  }
}

/**
 * Entschlüsselt einen verschlüsselten String
 * @param encryptedText - Der verschlüsselte Text
 * @param key - Der Verschlüsselungsschlüssel (muss derselbe wie beim Verschlüsseln sein)
 * @returns Entschlüsselter String
 */
export function decrypt(encryptedText: string, key: string = "arvo-labs-secret-key-2024"): string {
  try {
    // Prüfe ob der Text überhaupt verschlüsselt ist (beginnt mit Base64-Charakteren)
    if (!encryptedText || encryptedText.length === 0) {
      return encryptedText;
    }
    
    try {
      // Erste Base64-Dekodierung
      const firstDecoded = atob(encryptedText);
      
      // Rückgängigmachen der XOR-Verschlüsselung
      const keyChars = key.split('');
      const decrypted = firstDecoded.split('').map((char, index) => {
        const keyChar = keyChars[index % keyChars.length];
        const charCode = char.charCodeAt(0);
        const keyCode = keyChar.charCodeAt(0);
        // XOR ist reversibel
        const decryptedCode = charCode ^ keyCode;
        return String.fromCharCode(decryptedCode);
      }).join('');
      
      // Zweite Base64-Dekodierung
      const secondDecoded = atob(decrypted);
      
      // Entferne den Key vom Ende
      if (secondDecoded.endsWith(key)) {
        return secondDecoded.slice(0, -key.length);
      }
      
      return secondDecoded;
    } catch (decodeError) {
      // Falls Dekodierung fehlschlägt, gebe den ursprünglichen Text zurück
      console.warn("Decryption failed, returning original:", decodeError);
      return encryptedText;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    // Bei Fehler gebe den ursprünglichen Text zurück
    return encryptedText;
  }
}

/**
 * Speichert verschlüsselte Daten im localStorage
 * @param key - Der localStorage-Schlüssel
 * @param value - Der zu speichernde Wert
 * @param encryptionKey - Optionaler Verschlüsselungsschlüssel
 */
export function setEncryptedItem(key: string, value: string, encryptionKey?: string): void {
  try {
    const encrypted = encrypt(value, encryptionKey);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error("Error setting encrypted item:", error);
    // Fallback: Speichere unverschlüsselt wenn Verschlüsselung fehlschlägt
    try {
      localStorage.setItem(key, value);
    } catch (fallbackError) {
      console.error("Fallback storage also failed:", fallbackError);
      throw error;
    }
  }
}

/**
 * Liest und entschlüsselt Daten aus localStorage
 * @param key - Der localStorage-Schlüssel
 * @param encryptionKey - Optionaler Verschlüsselungsschlüssel (muss derselbe sein wie beim Speichern)
 * @returns Entschlüsselter Wert oder null, wenn nicht gefunden
 */
export function getEncryptedItem(key: string, encryptionKey?: string): string | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return null;
    }
    
    try {
      return decrypt(encrypted, encryptionKey);
    } catch {
      // Falls Entschlüsselung fehlschlägt, versuche unverschlüsselt zu lesen
      return encrypted;
    }
  } catch (error) {
    console.error("Error getting encrypted item:", error);
    // Versuche unverschlüsselt zu lesen
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

/**
 * Entfernt verschlüsselte Daten aus localStorage
 * @param key - Der localStorage-Schlüssel
 */
export function removeEncryptedItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Verschlüsselt ein Objekt und speichert es im localStorage
 * @param key - Der localStorage-Schlüssel
 * @param value - Das zu speichernde Objekt
 * @param encryptionKey - Optionaler Verschlüsselungsschlüssel
 */
export function setEncryptedObject<T>(key: string, value: T, encryptionKey?: string): void {
  try {
    const jsonString = JSON.stringify(value);
    try {
      setEncryptedItem(key, jsonString, encryptionKey);
    } catch (encryptionError) {
      console.warn("Encryption failed, using unencrypted storage:", encryptionError);
      // Fallback: Speichere unverschlüsselt wenn Verschlüsselung fehlschlägt
      localStorage.setItem(key, jsonString);
    }
  } catch (error) {
    console.error("Error setting encrypted object:", error);
    // Versuche unverschlüsselt zu speichern als letzter Fallback
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (fallbackError) {
      console.error("Fallback storage also failed:", fallbackError);
      throw error;
    }
  }
}

/**
 * Liest und entschlüsselt ein Objekt aus localStorage
 * @param key - Der localStorage-Schlüssel
 * @param encryptionKey - Optionaler Verschlüsselungsschlüssel
 * @returns Entschlüsseltes Objekt oder null, wenn nicht gefunden
 */
export function getEncryptedObject<T>(key: string, encryptionKey?: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    
    // Versuche zuerst verschlüsselt zu lesen
    try {
      const decrypted = getEncryptedItem(key, encryptionKey);
      if (decrypted) {
        return JSON.parse(decrypted) as T;
      }
    } catch {
      // Falls Entschlüsselung fehlschlägt, versuche unverschlüsselt zu lesen
      try {
        return JSON.parse(item) as T;
      } catch {
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting encrypted object:", error);
    // Versuche unverschlüsselt zu lesen
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch {
      return null;
    }
    return null;
  }
}

/**
 * Generiert einen zufälligen Verschlüsselungsschlüssel
 * @param length - Die Länge des Schlüssels (Standard: 32)
 * @returns Zufälliger Schlüssel als String
 */
export function generateKey(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * Hasht ein Passwort (einfacher Hash für Demo)
 * WICHTIG: In Produktion sollten Sie bcrypt oder ähnliche verwenden
 * @param password - Das zu hashende Passwort
 * @returns Gehashtes Passwort
 */
export function hashPassword(password: string): string {
  try {
    // Einfacher Hash-Algorithmus (nur für Demo)
    // In Produktion: Verwenden Sie bcrypt oder Argon2
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Konvertiere zu positiver Zahl und dann zu Hex
    const positiveHash = Math.abs(hash).toString(16);
    // Verschlüssele zusätzlich
    try {
      return encrypt(positiveHash);
    } catch {
      // Fallback: Nur Base64 wenn Verschlüsselung fehlschlägt
      return btoa(positiveHash);
    }
  } catch (error) {
    console.error("Error hashing password:", error);
    // Fallback: Einfaches Base64
    return btoa(password);
  }
}

/**
 * Vergleicht ein Passwort mit einem Hash
 * @param password - Das zu prüfende Passwort
 * @param hashedPassword - Der gespeicherte Hash
 * @returns true, wenn das Passwort übereinstimmt
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    if (!password || !hashedPassword) {
      return false;
    }
    const passwordHash = hashPassword(password);
    return passwordHash === hashedPassword;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

