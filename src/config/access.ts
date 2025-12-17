/**
 * Zentrale Zugriffskonfiguration für Arvo Labs Dashboard
 * Definiert welche Features für welche Pläne verfügbar sind
 */

export type PlanType = 'starter' | 'pro' | 'enterprise' | 'individual';
export type AccountType = 'individual' | 'team';

export type FeatureId = 
  | 'chat'
  | 'documents'
  | 'forms'
  | 'automations'
  | 'quickActions'
  | 'dashboard'
  | 'mail'
  | 'teamActions'
  | 'teamManagement'
  | 'inbox'
  | 'whiteboards'
  | 'goals'
  | 'timesheets';

export interface FeatureAccess {
  feature: FeatureId;
  allowed: boolean;
  requiresUpgrade?: boolean;
  upgradeTo?: PlanType | 'team';
}

export interface PlanAccessConfig {
  plan: PlanType;
  accountType: AccountType;
  features: Record<FeatureId, boolean>;
}

/**
 * Zugriffskonfiguration für alle Pläne
 */
const ACCESS_CONFIG: Record<`${PlanType}_${AccountType}`, PlanAccessConfig> = {
  // Einzelbenutzer-Pläne
  starter_individual: {
    plan: 'starter',
    accountType: 'individual',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: false,
      quickActions: false,
      dashboard: false,
      mail: false,
      teamActions: false,
      teamManagement: false,
      inbox: true,
      whiteboards: false,
      goals: false,
      timesheets: false,
    },
  },
  pro_individual: {
    plan: 'pro',
    accountType: 'individual',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: false,
      quickActions: false,
      dashboard: true, // Bestimmte Dashboard-Funktionen
      mail: true,
      teamActions: false,
      teamManagement: false,
      inbox: true,
      whiteboards: false,
      goals: false,
      timesheets: false,
    },
  },
  enterprise_individual: {
    plan: 'enterprise',
    accountType: 'individual',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: true,
      quickActions: true,
      dashboard: true,
      mail: true,
      teamActions: false, // Nur für Team-Accounts
      teamManagement: false, // Nur für Team-Accounts
      inbox: true,
      whiteboards: true,
      goals: true,
      timesheets: true,
    },
  },
  individual_individual: {
    plan: 'individual',
    accountType: 'individual',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: true,
      quickActions: true,
      dashboard: true,
      mail: true,
      teamActions: false,
      teamManagement: false,
      inbox: true,
      whiteboards: true,
      goals: true,
      timesheets: true,
    },
  },
  // Team-Pläne
  starter_team: {
    plan: 'starter',
    accountType: 'team',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: false,
      quickActions: false,
      dashboard: false,
      mail: false,
      teamActions: true,
      teamManagement: true,
      inbox: true,
      whiteboards: false,
      goals: false,
      timesheets: false,
    },
  },
  pro_team: {
    plan: 'pro',
    accountType: 'team',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: false,
      quickActions: false,
      dashboard: false,
      mail: true,
      teamActions: true,
      teamManagement: true,
      inbox: true,
      whiteboards: false,
      goals: false,
      timesheets: false,
    },
  },
  enterprise_team: {
    plan: 'enterprise',
    accountType: 'team',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: true,
      quickActions: true,
      dashboard: true,
      mail: true,
      teamActions: true,
      teamManagement: true,
      inbox: true,
      whiteboards: true,
      goals: true,
      timesheets: true,
    },
  },
  individual_team: {
    plan: 'individual',
    accountType: 'team',
    features: {
      chat: true,
      documents: true,
      forms: true,
      automations: true,
      quickActions: true,
      dashboard: true,
      mail: true,
      teamActions: true,
      teamManagement: true,
      inbox: true,
      whiteboards: true,
      goals: true,
      timesheets: true,
    },
  },
};

/**
 * Prüft ob ein Feature für einen bestimmten Plan verfügbar ist
 */
export function hasFeatureAccess(
  plan: PlanType,
  accountType: AccountType,
  feature: FeatureId
): boolean {
  // Normalisiere Plan (lowercase) für konsistente Prüfung
  const normalizedPlan = plan.toLowerCase().trim() as PlanType;
  const configKey = `${normalizedPlan}_${accountType}` as keyof typeof ACCESS_CONFIG;
  const config = ACCESS_CONFIG[configKey];
  
  // Debug-Logging (immer in Development)
  if (import.meta.env.DEV) {
    console.log(`🔍 [hasFeatureAccess] Checking access for "${feature}":`, {
      plan,
      normalizedPlan,
      accountType,
      configKey,
      configExists: !!config,
      availableKeys: Object.keys(ACCESS_CONFIG),
    });
  }
  
  if (!config) {
    // Debug-Logging wenn Config nicht gefunden
    if (import.meta.env.DEV) {
      console.error(`[hasFeatureAccess] ❌ Config nicht gefunden für:`, {
        plan,
        normalizedPlan,
        accountType,
        configKey,
        availableKeys: Object.keys(ACCESS_CONFIG),
      });
    }
    // Fallback: Starter Individual als Standard
    const fallbackAccess = ACCESS_CONFIG.starter_individual.features[feature] ?? false;
    if (import.meta.env.DEV) {
      console.warn(`[hasFeatureAccess] Using fallback (starter_individual):`, {
        feature,
        fallbackAccess,
      });
    }
    return fallbackAccess;
  }
  
  const hasAccess = config.features[feature] ?? false;
  
  // Debug-Logging (nur in Development)
  if (import.meta.env.DEV) {
    const status = hasAccess ? '✅' : '❌';
    console.log(`🔍 [hasFeatureAccess] ${status} Feature "${feature}":`, {
      plan,
      normalizedPlan,
      accountType,
      configKey,
      hasAccess,
      featureConfig: config.features[feature],
    });
  }
  
  return hasAccess;
}

/**
 * Gibt die Zugriffskonfiguration für einen Plan zurück
 */
export function getPlanAccessConfig(
  plan: PlanType,
  accountType: AccountType
): PlanAccessConfig {
  const configKey = `${plan}_${accountType}` as keyof typeof ACCESS_CONFIG;
  const config = ACCESS_CONFIG[configKey];
  
  if (!config) {
    return ACCESS_CONFIG.starter_individual;
  }
  
  return config;
}

/**
 * Gibt alle Features zurück, die für einen Plan verfügbar sind
 */
export function getAvailableFeatures(
  plan: PlanType,
  accountType: AccountType
): FeatureId[] {
  const config = getPlanAccessConfig(plan, accountType);
  return Object.entries(config.features)
    .filter(([_, allowed]) => allowed)
    .map(([feature]) => feature as FeatureId);
}

/**
 * Gibt alle Features zurück, die für einen Plan NICHT verfügbar sind
 */
export function getUnavailableFeatures(
  plan: PlanType,
  accountType: AccountType
): FeatureId[] {
  const config = getPlanAccessConfig(plan, accountType);
  return Object.entries(config.features)
    .filter(([_, allowed]) => !allowed)
    .map(([feature]) => feature as FeatureId);
}

/**
 * Bestimmt welcher Plan für ein Upgrade benötigt wird
 */
export function getRequiredUpgradePlan(
  currentPlan: PlanType,
  currentAccountType: AccountType,
  feature: FeatureId
): PlanType | 'team' | null {
  // Wenn Feature bereits verfügbar, kein Upgrade nötig
  if (hasFeatureAccess(currentPlan, currentAccountType, feature)) {
    return null;
  }
  
  // Prüfe ob Feature in Team-Plänen verfügbar ist (wenn aktuell Individual)
  if (currentAccountType === 'individual') {
    if (hasFeatureAccess(currentPlan, 'team', feature)) {
      return 'team';
    }
  }
  
  // Prüfe höhere Pläne
  const planOrder: PlanType[] = ['starter', 'pro', 'enterprise', 'individual'];
  const currentIndex = planOrder.indexOf(currentPlan);
  
  for (let i = currentIndex + 1; i < planOrder.length; i++) {
    const testPlan = planOrder[i];
    if (hasFeatureAccess(testPlan, currentAccountType, feature)) {
      return testPlan;
    }
  }
  
  // Wenn kein höherer Plan gefunden, prüfe Team-Varianten
  if (currentAccountType === 'individual') {
    for (let i = 0; i <= currentIndex; i++) {
      const testPlan = planOrder[i];
      if (hasFeatureAccess(testPlan, 'team', feature)) {
        return 'team';
      }
    }
  }
  
  return null;
}

