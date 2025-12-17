import { useUserPlan } from './useUserPlan';
import { 
  hasFeatureAccess, 
  getRequiredUpgradePlan,
  type FeatureId,
  type PlanType,
} from '@/config/access';

/**
 * Hook für Feature-Zugriffskontrolle
 * Prüft ob ein Feature für den aktuellen Benutzer verfügbar ist
 */
export function useAccessControl() {
  const { plan, accountType, isLoaded } = useUserPlan();
  
  /**
   * Prüft ob ein Feature verfügbar ist
   */
  const canAccess = (feature: FeatureId): boolean => {
    if (!isLoaded) return false;
    
    // Prüfe ob Plan "enterprise" ist (case-insensitive)
    const isEnterprise = plan.toLowerCase() === 'enterprise' || 
                        plan.toLowerCase().includes('enterprise');
    
    // Sonderbehandlung für Enterprise-Plan: Alle Features außer Team-spezifische sind verfügbar
    if (isEnterprise) {
      // Team-Features nur für Team-Accounts
      if (feature === 'teamActions' || feature === 'teamManagement') {
        return accountType === 'team';
      }
      // Alle anderen Features sind für Enterprise verfügbar
      console.log(`✅ [useAccessControl] Enterprise Plan - Feature "${feature}" granted`);
      return true;
    }
    
    // Für andere Pläne: Normale Prüfung
    const hasAccess = hasFeatureAccess(plan, accountType, feature);
    
    // Debug-Logging (nur in Development)
    if (import.meta.env.DEV) {
      console.log(`[useAccessControl] Feature "${feature}":`, {
        plan,
        accountType,
        hasAccess,
        isEnterprise,
      });
    }
    
    return hasAccess;
  };
  
  /**
   * Gibt zurück, welcher Plan für ein Feature benötigt wird
   */
  const getRequiredPlan = (feature: FeatureId): PlanType | 'team' | null => {
    if (!isLoaded) return null;
    return getRequiredUpgradePlan(plan, accountType, feature);
  };
  
  /**
   * Prüft ob ein Upgrade nötig ist
   */
  const requiresUpgrade = (feature: FeatureId): boolean => {
    return !canAccess(feature);
  };
  
  return {
    canAccess,
    getRequiredPlan,
    requiresUpgrade,
    plan,
    accountType,
    isLoaded,
  };
}

