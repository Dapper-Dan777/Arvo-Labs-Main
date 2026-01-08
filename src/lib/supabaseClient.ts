import { createClient } from '@supabase/supabase-js';

// Next.js verwendet process.env für Umgebungsvariablen
const supabaseUrl = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '');
  
// Unterstütze beide Variablennamen für Kompatibilität
const supabaseAnonKey = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Supabase ist nicht konfiguriert. Bitte setze die Umgebungsvariablen:\n' +
      'NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in einer .env Datei.\n' +
      '(Diese Warnung wird nur in Development angezeigt)'
    );
  }
}

import type { SupabaseClient } from '@supabase/supabase-js';

// Validiere, ob die URL eine gültige HTTP/HTTPS URL ist
function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

// Prüfe ob Supabase korrekt konfiguriert ist
const hasUrl = Boolean(supabaseUrl && supabaseUrl.trim());
const hasKey = Boolean(supabaseAnonKey && supabaseAnonKey.trim());
const urlValid = hasUrl && isValidUrl(supabaseUrl);

export const isSupabaseConfigured = Boolean(hasUrl && hasKey && urlValid);

// Debug: Zeige Konfigurationsstatus
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && !isSupabaseConfigured) {
  console.warn('⚠️ Supabase ist NICHT konfiguriert:');
  if (!hasUrl) console.warn('  ❌ NEXT_PUBLIC_SUPABASE_URL fehlt oder ist leer');
  if (!hasKey) console.warn('  ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt oder ist leer');
  if (hasUrl && !urlValid) console.warn('  ❌ NEXT_PUBLIC_SUPABASE_URL ist keine gültige URL');
}

// Erstelle Supabase Client (nur wenn korrekt konfiguriert)
export const supabase: SupabaseClient | null = isSupabaseConfigured && typeof window !== 'undefined'
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Custom Field Definition
export interface CustomFieldDefinition {
  id: string;
  name: string; // Anzeigename (z.B. "Status", "Priorität")
  key: string; // Technischer Schlüssel (z.B. "status", "priority")
  type: "text" | "number" | "dropdown" | "date" | "boolean";
  options?: string[]; // Für dropdown-Felder
  required?: boolean;
  order: number; // Reihenfolge der Anzeige
}

// TypeScript Interface für Customer
export interface Customer {
  id: string;
  owner_id: string;
  company_name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  custom_fields?: Record<string, any>; // JSON für benutzerdefinierte Felder
  created_at: string;
  updated_at: string;
}

// Input-Typ für das Erstellen/Aktualisieren (ohne owner_id, id, timestamps)
export interface CustomerInput {
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
}




