/**
 * Simple encryption/decryption utilities for localStorage
 * Uses base64 encoding (not secure, but sufficient for non-sensitive data)
 */

const ENCRYPTION_KEY = "arvo-labs-dashboard-key";

function simpleEncrypt(text: string): string {
  try {
    // Simple base64 encoding (not real encryption, but obfuscates data)
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
}

function simpleDecrypt(encrypted: string): string {
  try {
    return decodeURIComponent(escape(atob(encrypted)));
  } catch (error) {
    console.error("Decryption error:", error);
    return encrypted;
  }
}

/**
 * Store encrypted object in localStorage
 */
export function setEncryptedObject<T>(key: string, value: T): void {
  try {
    const json = JSON.stringify(value);
    const encrypted = simpleEncrypt(json);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error("Error storing encrypted object:", error);
  }
}

/**
 * Retrieve and decrypt object from localStorage
 */
export function getEncryptedObject<T>(key: string): T | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = simpleDecrypt(encrypted);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error("Error retrieving encrypted object:", error);
    return null;
  }
}

/**
 * Remove encrypted item from localStorage
 */
export function removeEncryptedItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing encrypted item:", error);
  }
}

