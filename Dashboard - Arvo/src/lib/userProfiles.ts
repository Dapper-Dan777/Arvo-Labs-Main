import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { User as AuthUser } from '@supabase/supabase-js';

/**
 * User Profile Interface für Supabase
 */
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string | null;
  avatar: string | null;
  is_admin: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  two_factor_backup_codes: string[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Konvertiert Supabase UserProfile zu App User Interface
 */
export function profileToUser(profile: UserProfile, authUser: AuthUser | null): any {
  return {
    id: profile.id,
    username: profile.username,
    name: profile.name,
    email: profile.email || authUser?.email || '',
    avatar: profile.avatar,
    isAdmin: profile.is_admin,
    emailVerified: profile.email_verified,
    twoFactorEnabled: profile.two_factor_enabled,
    twoFactorSecret: profile.two_factor_secret,
    twoFactorBackupCodes: profile.two_factor_backup_codes,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

/**
 * Lädt User Profile aus Supabase
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

/**
 * Erstellt User Profile in Supabase
 */
export async function createUserProfile(
  userId: string,
  profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      ...profile,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

/**
 * Aktualisiert User Profile in Supabase
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

