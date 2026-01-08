import { getEncryptedObject, setEncryptedObject } from './crypto';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { CustomFieldDefinition } from './supabaseClient';

const STORAGE_KEY = 'arvo_customer_fields';

/**
 * Lädt alle benutzerdefinierten Felder für einen Benutzer
 */
export async function getCustomFields(userId: string): Promise<CustomFieldDefinition[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Verwende user_profiles table oder eine separate custom_fields Tabelle
      // Für jetzt: lokaler Storage pro User
      // TODO: Optional: Separate Supabase Tabelle erstellen
    } catch (error) {
      console.error('Error loading custom fields from Supabase:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, CustomFieldDefinition[]>>(STORAGE_KEY);
    return stored?.[userId] || [];
  } catch (error) {
    console.error('Error loading custom fields from local storage:', error);
    return [];
  }
}

/**
 * Speichert benutzerdefinierte Felder
 */
export async function saveCustomFields(
  userId: string,
  fields: CustomFieldDefinition[]
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      // TODO: Optional: Separate Supabase Tabelle verwenden
    } catch (error) {
      console.error('Error saving custom fields to Supabase:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, CustomFieldDefinition[]>>(STORAGE_KEY) || {};
    stored[userId] = fields;
    setEncryptedObject(STORAGE_KEY, stored);
  } catch (error) {
    console.error('Error saving custom fields to local storage:', error);
    throw error;
  }
}

/**
 * Erstellt ein neues benutzerdefiniertes Feld
 */
export async function createCustomField(
  userId: string,
  field: Omit<CustomFieldDefinition, 'id' | 'order'>
): Promise<CustomFieldDefinition> {
  const fields = await getCustomFields(userId);
  const newField: CustomFieldDefinition = {
    ...field,
    id: crypto.randomUUID(),
    order: fields.length,
  };

  await saveCustomFields(userId, [...fields, newField]);
  return newField;
}

/**
 * Aktualisiert ein benutzerdefiniertes Feld
 */
export async function updateCustomField(
  userId: string,
  fieldId: string,
  updates: Partial<CustomFieldDefinition>
): Promise<void> {
  const fields = await getCustomFields(userId);
  const updated = fields.map((f) =>
    f.id === fieldId ? { ...f, ...updates } : f
  );
  await saveCustomFields(userId, updated);
}

/**
 * Löscht ein benutzerdefiniertes Feld
 */
export async function deleteCustomField(userId: string, fieldId: string): Promise<void> {
  const fields = await getCustomFields(userId);
  const filtered = fields.filter((f) => f.id !== fieldId);
  await saveCustomFields(userId, filtered);
}

/**
 * Aktualisiert die Reihenfolge der Felder
 */
export async function reorderCustomFields(
  userId: string,
  fieldIds: string[]
): Promise<void> {
  const fields = await getCustomFields(userId);
  const reordered = fieldIds.map((id, index) => {
    const field = fields.find((f) => f.id === id);
    return field ? { ...field, order: index } : null;
  }).filter((f): f is CustomFieldDefinition => f !== null);

  // Füge alle Felder hinzu, die nicht in der neuen Reihenfolge sind
  const remaining = fields.filter((f) => !fieldIds.includes(f.id));
  reordered.push(...remaining.map((f, idx) => ({ ...f, order: fieldIds.length + idx })));

  await saveCustomFields(userId, reordered);
}

