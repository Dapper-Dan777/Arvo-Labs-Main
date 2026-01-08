/**
 * Supabase Client for Automation API Routes
 * Uses Clerk for authentication and Supabase for data
 */

import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function getSupabaseClient() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Use admin client with user_id filter for RLS
  return supabaseAdmin;
}

export async function getUserId(): Promise<string> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}

