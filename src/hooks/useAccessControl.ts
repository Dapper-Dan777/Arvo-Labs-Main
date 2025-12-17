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
    return hasFeatureAccess(plan, accountType, feature);
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

