import { supabase } from '@/Integrations/supabase/client';
import { PlanType, AccountType } from '@/config/access';

export interface UserProfile {
  id: string;
  plan: PlanType;
  account_type: AccountType;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Lädt das User-Profil aus der profiles Tabelle
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Wenn kein Profil existiert, erstelle eines mit Standardwerten
      if (error.code === 'PGRST116') {
        return {
          id: userId,
          plan: 'starter',
          account_type: 'individual',
        };
      }
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Aktualisiert den Plan eines Users
 */
export async function updateUserPlan(
  userId: string,
  plan: PlanType,
  accountType?: AccountType
): Promise<boolean> {
  try {
    const updateData: Partial<UserProfile> = { plan };
    if (accountType) {
      updateData.account_type = accountType;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user plan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserPlan:', error);
    return false;
  }
}

/**
 * Aktualisiert das gesamte User-Profil
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
}

