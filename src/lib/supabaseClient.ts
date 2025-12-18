import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Unterstütze beide Variablennamen für Kompatibilität
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn(
      '⚠️ Supabase ist nicht konfiguriert. Bitte setze die Umgebungsvariablen:\n' +
      'VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY (oder VITE_SUPABASE_PUBLISHABLE_KEY) in einer .env Datei.\n' +
      '(Diese Warnung wird nur in Development angezeigt)'
    );
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);




