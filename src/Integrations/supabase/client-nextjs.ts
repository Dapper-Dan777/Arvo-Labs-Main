// Next.js compatible Supabase client
// This file uses process.env instead of import.meta.env for Next.js compatibility
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// In Next.js, use process.env instead of import.meta.env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if Supabase is configured (nur in Development warnen)
if (process.env.NODE_ENV === 'development' && (!SUPABASE_URL || !SUPABASE_KEY)) {
  console.error(
    '⚠️ Supabase ist nicht konfiguriert. Bitte setze die Umgebungsvariablen:\n' +
    'NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in einer .env.local Datei.\n' +
    '(Diese Warnung wird nur in Development angezeigt)'
  );
}

// Debug: Zeige Konfiguration in Development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Supabase Config (Next.js):', {
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'NICHT GESETZT',
    hasKey: !!SUPABASE_KEY,
    keyLength: SUPABASE_KEY?.length || 0,
  });
}

// Create client with fallback values to prevent runtime errors
export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_KEY || 'placeholder-key',
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: true,
    }
  }
);
