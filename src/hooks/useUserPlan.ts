import { useUser } from '@clerk/clerk-react';
import { PlanType, AccountType } from '@/config/access';

export function useUserPlan() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Plan aus publicMetadata lesen
  // Normalisiere den Plan-String (lowercase) um Case-Sensitivity-Probleme zu vermeiden
  const rawPlan = user?.publicMetadata?.plan;
  const normalizedPlan = rawPlan 
    ? (typeof rawPlan === 'string' ? rawPlan.toLowerCase() : rawPlan)
    : undefined;
  
  const plan = (normalizedPlan as PlanType | undefined) ?? 'starter' as PlanType;
  
  // Debug-Logging (nur in Development)
  if (import.meta.env.DEV && user) {
    console.log('[useUserPlan] Debug Info:', {
      rawPlan,
      normalizedPlan,
      plan,
      accountType: user.publicMetadata?.accountType,
      organizationMemberships: user.organizationMemberships?.length || 0,
      publicMetadata: user.publicMetadata,
    });
  }
  
  // AccountType aus publicMetadata lesen (individual oder team)
  // Falls nicht gesetzt, prüfe ob user zu einer Organization gehört
  const accountType: AccountType = (() => {
    const metadataAccountType = user?.publicMetadata?.accountType as AccountType | undefined;
    if (metadataAccountType === 'team' || metadataAccountType === 'individual') {
      return metadataAccountType;
    }
    
    // Fallback: Prüfe ob user zu einer Organization gehört (Clerk Organizations)
    // Wenn user.organizationMemberships existiert und nicht leer ist, dann ist es ein Team
    if (user?.organizationMemberships && user.organizationMemberships.length > 0) {
      return 'team';
    }
    
    return 'individual';
  })();
  
  return {
    user,
    plan,
    accountType,
    isLoaded,
    isSignedIn,
  };
}

