import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/AuthContext';
import { useUserPlan } from './useUserPlan';
import { PlanType } from '@/config/access';
import { supabase } from '@/Integrations/supabase/client';

/**
 * Hook, der auf Plan-Änderungen reagiert und automatisch zum richtigen Dashboard weiterleitet
 * 
 * Verwendung:
 * - In DashboardBilling.tsx: Nach Plan-Wechsel weiterleiten
 * - In UpgradeModal.tsx: Nach Checkout weiterleiten
 */
export function usePlanChangeRedirect(options?: {
  enabled?: boolean;
  redirectDelay?: number;
  onRedirect?: (plan: PlanType) => void;
}) {
  const { enabled = true, redirectDelay = 2000, onRedirect } = options || {};
  const { user, isLoaded } = useUser();
  const { plan, accountType, isSignedIn } = useUserPlan();
  const navigate = useNavigate();
  const previousPlanRef = useRef<PlanType | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isLoaded || !isSignedIn) return;

    const currentPlan = user?.publicMetadata?.plan as PlanType | undefined;
    const hasPlan = currentPlan && currentPlan !== 'starter';

    // Initialisiere previousPlan beim ersten Laden
    if (previousPlanRef.current === null) {
      previousPlanRef.current = plan;
      return;
    }

    // Prüfe ob Plan sich geändert hat
    if (currentPlan && currentPlan !== previousPlanRef.current && hasPlan) {
      // Plan hat sich geändert - bereite Weiterleitung vor
      const newPlan = currentPlan;

      // Callback aufrufen
      if (onRedirect) {
        onRedirect(newPlan);
      }

      // Weiterleitung nach Verzögerung (gibt Zeit für Webhook-Verarbeitung)
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      redirectTimeoutRef.current = setTimeout(() => {
        const dashboardPath = getDashboardPath(newPlan);
        navigate(dashboardPath, { replace: true });
      }, redirectDelay);

      // Update previousPlan
      previousPlanRef.current = newPlan;
    }
  }, [user?.publicMetadata?.plan, plan, isLoaded, isSignedIn, enabled, navigate, redirectDelay, onRedirect]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentPlan: plan,
    accountType,
    isLoaded,
  };
}

/**
 * Gibt den Dashboard-Pfad basierend auf dem Plan zurück
 */
function getDashboardPath(plan: PlanType): string {
  switch (plan) {
    case 'starter':
      return '/dashboard/starter';
    case 'pro':
      return '/dashboard/pro';
    case 'enterprise':
      return '/dashboard/enterprise';
    case 'individual':
      return '/dashboard/individual';
    default:
      return '/dashboard/starter';
  }
}

/**
 * Hook für Polling-basierte Plan-Überwachung
 * Nützlich wenn man auf Plan-Änderungen warten muss (z.B. nach Checkout)
 */
export function usePlanPolling(options?: {
  enabled?: boolean;
  interval?: number;
  onPlanChange?: (plan: PlanType) => void;
}) {
  const { enabled = false, interval = 3000, onPlanChange } = options || {};
  const { user } = useUser();
  const { plan } = useUserPlan();
  const previousPlanRef = useRef<PlanType | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialisiere previousPlan
    if (previousPlanRef.current === null) {
      previousPlanRef.current = plan;
    }

    const pollingInterval = setInterval(async () => {
      // User neu laden, um aktuelle Metadata zu bekommen
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (!updatedUser) return;

      const currentPlan = updatedUser.user_metadata?.plan as PlanType | undefined;
      const hasPlan = currentPlan && currentPlan !== 'starter';

      if (currentPlan && currentPlan !== previousPlanRef.current && hasPlan) {
        previousPlanRef.current = currentPlan;
        if (onPlanChange) {
          onPlanChange(currentPlan);
        }
      }
    }, interval);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [enabled, interval, user, plan, onPlanChange]);

  return {
    currentPlan: plan,
  };
}

