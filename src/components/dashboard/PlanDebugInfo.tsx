import React, { useEffect } from 'react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAccessControl } from '@/hooks/useAccessControl';
import { getPlanAccessConfig } from '@/config/access';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Debug-Komponente zur Anzeige von Plan-Informationen
 * Nur in Development-Modus sichtbar
 */
export function PlanDebugInfo() {
  if (!import.meta.env.DEV) {
    return null;
  }

  const { plan, accountType, user, isLoaded, isSignedIn } = useUserPlan();
  const { canAccess } = useAccessControl();
  const config = getPlanAccessConfig(plan, accountType);

  const rawPlan = user?.publicMetadata?.plan;
  const rawAccountType = user?.publicMetadata?.accountType;
  
  // Debug-Log in Console (immer ausgeben)
  useEffect(() => {
    console.log('🔍 [PlanDebugInfo] ============================================');
    console.log('🔍 [PlanDebugInfo] Plan Debug Information:');
    console.log('🔍 [PlanDebugInfo] - isLoaded:', isLoaded);
    console.log('🔍 [PlanDebugInfo] - isSignedIn:', isSignedIn);
    console.log('🔍 [PlanDebugInfo] - Raw Plan from Metadata:', rawPlan);
    console.log('🔍 [PlanDebugInfo] - Normalized Plan:', plan);
    console.log('🔍 [PlanDebugInfo] - AccountType:', accountType);
    console.log('🔍 [PlanDebugInfo] - Full publicMetadata:', user?.publicMetadata);
    console.log('🔍 [PlanDebugInfo] ============================================');
  }, [isLoaded, isSignedIn, plan, accountType, rawPlan, user]);

  return (
    <Card className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Plan Debug Info (Development Only)</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Raw Metadata:</strong>
          <pre className="mt-1 p-2 bg-white dark:bg-slate-900 rounded text-xs overflow-auto">
            {JSON.stringify({ plan: rawPlan, accountType: rawAccountType }, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Normalized:</strong> Plan = <code className="bg-white dark:bg-slate-900 px-1 rounded">{plan}</code>, 
          AccountType = <code className="bg-white dark:bg-slate-900 px-1 rounded">{accountType}</code>
        </div>
        <div>
          <strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Available Features:</strong>
          <ul className="mt-1 list-disc list-inside">
            {Object.entries(config.features).map(([feature, allowed]) => (
              <li key={feature} className={allowed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {feature}: {allowed ? '✅' : '❌'} (canAccess: {canAccess(feature as any) ? '✅' : '❌'})
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

