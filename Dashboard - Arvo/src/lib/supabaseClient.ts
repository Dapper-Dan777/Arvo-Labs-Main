import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Konfiguration aus Umgebungsvariablen (Vite verwendet VITE_ Präfix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: Zeige geladene Werte (ohne den kompletten Key)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Config Check:');
  console.log('  - VITE_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NICHT GESETZT');
  console.log('  - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NICHT GESETZT');
}

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
if (import.meta.env.DEV && !isSupabaseConfigured) {
  console.warn('⚠️ Supabase ist NICHT konfiguriert:');
  if (!hasUrl) console.warn('  ❌ VITE_SUPABASE_URL fehlt oder ist leer');
  if (!hasKey) console.warn('  ❌ VITE_SUPABASE_ANON_KEY fehlt oder ist leer');
  if (hasUrl && !urlValid) console.warn('  ❌ VITE_SUPABASE_URL ist keine gültige URL');
}

// Erstelle Supabase Client (nur wenn korrekt konfiguriert)
// Wichtig: Für Auth müssen wir persistSession aktivieren
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
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

