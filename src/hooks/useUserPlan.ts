import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/AuthContext';
import { PlanType, AccountType } from '@/config/access';
import { getUserProfile, type UserProfile } from '@/lib/user-profile';

export function useUserPlan() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Lade User-Profil aus der Datenbank
  useEffect(() => {
    if (!isLoaded || !user?.id) {
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      const profile = await getUserProfile(user.id);
      if (!cancelled) {
        setUserProfile(profile);
        setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, user?.id]);

  // Plan aus profiles Tabelle lesen
  const rawPlan = userProfile?.plan;
  
  // Normalisiere den Plan-String
  let normalizedPlan: string | undefined;
  if (rawPlan) {
    if (typeof rawPlan === 'string') {
      // Normalisiere: "Enterprise" -> "enterprise", "enterprise" -> "enterprise"
      normalizedPlan = rawPlan.toLowerCase().trim();
      
      // Mappe mögliche Varianten
      if (normalizedPlan === 'enterprise' || normalizedPlan === 'enterprise_individual' || normalizedPlan === 'enterprise_team') {
        normalizedPlan = 'enterprise';
      } else if (normalizedPlan === 'pro' || normalizedPlan === 'pro_individual' || normalizedPlan === 'pro_team') {
        normalizedPlan = 'pro';
      } else if (normalizedPlan === 'starter' || normalizedPlan === 'starter_individual' || normalizedPlan === 'starter_team') {
        normalizedPlan = 'starter';
      } else if (normalizedPlan === 'individual' || normalizedPlan === 'individual_individual' || normalizedPlan === 'individual_team') {
        normalizedPlan = 'individual';
      }
    } else {
      normalizedPlan = rawPlan as string;
    }
  }
  
  // Validiere, dass der Plan ein gültiger PlanType ist
  const validPlans: PlanType[] = ['starter', 'pro', 'enterprise', 'individual'];
  
  // Erweiterte Plan-Erkennung: Prüfe auch auf Varianten
  let finalPlan: PlanType = 'starter';
  if (normalizedPlan) {
    if (normalizedPlan.includes('enterprise')) {
      finalPlan = 'enterprise';
    } else if (normalizedPlan.includes('pro')) {
      finalPlan = 'pro';
    } else if (normalizedPlan.includes('individual')) {
      finalPlan = 'individual';
    } else if (normalizedPlan.includes('starter')) {
      finalPlan = 'starter';
    } else if (validPlans.includes(normalizedPlan as PlanType)) {
      finalPlan = normalizedPlan as PlanType;
    }
  }
  
  const plan: PlanType = finalPlan;
  
  // Debug-Logging (IMMER in Development, auch wenn user noch nicht geladen)
  if (import.meta.env.DEV) {
    console.log('🔍 [useUserPlan] Debug Info:', {
      isLoaded,
      isSignedIn,
      hasUser: !!user,
      rawPlan,
      normalizedPlan,
      plan,
      isValidPlan: validPlans.includes(plan),
      accountType: user?.publicMetadata?.accountType,
      userMetadata: user?.publicMetadata,
      fullUserObject: user,
    });
  }
  
  // AccountType aus profiles Tabelle lesen
  const accountType: AccountType = userProfile?.account_type || 'individual';
  
  // Kombiniere Loading-States
  const fullyLoaded = isLoaded && !profileLoading;
  
  // Debug-Logging (IMMER in Development)
  if (import.meta.env.DEV) {
    console.log('🔍 [useUserPlan] Debug Info:', {
      isLoaded,
      profileLoading,
      fullyLoaded,
      isSignedIn,
      hasUser: !!user,
      userId: user?.id,
      rawPlan,
      normalizedPlan,
      plan,
      accountType,
      userProfile,
    });
  }
  
  return {
    user,
    plan,
    accountType,
    isLoaded: fullyLoaded,
    isSignedIn,
    userProfile, // Expose für direkten Zugriff
  };
}

