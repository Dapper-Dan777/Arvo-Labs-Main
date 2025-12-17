import { useUser } from '@clerk/clerk-react';
import { PlanType, AccountType } from '@/config/access';

export function useUserPlan() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Plan aus publicMetadata lesen
  // Normalisiere den Plan-String (lowercase) um Case-Sensitivity-Probleme zu vermeiden
  const rawPlan = user?.publicMetadata?.plan;
  
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
  const plan: PlanType = (validPlans.includes(normalizedPlan as PlanType) 
    ? normalizedPlan 
    : 'starter') as PlanType;
  
  // Debug-Logging (nur in Development)
  if (import.meta.env.DEV && user) {
    console.log('[useUserPlan] Debug Info:', {
      rawPlan,
      normalizedPlan,
      plan,
      isValidPlan: validPlans.includes(plan),
      accountType: user.publicMetadata?.accountType,
      organizationMemberships: user.organizationMemberships?.length || 0,
      publicMetadata: user.publicMetadata,
      fullUserObject: user,
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

