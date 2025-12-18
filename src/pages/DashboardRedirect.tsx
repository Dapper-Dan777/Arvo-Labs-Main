import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePlanChangeRedirect } from '@/hooks/usePlanChangeRedirect';
import { PlanType } from '@/config/access';

export default function DashboardRedirect() {
  const { plan, accountType, isLoaded, isSignedIn } = useUserPlan();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Für Supabase: Organisationen werden über user_metadata oder eine separate Tabelle verwaltet
  // Hier verwenden wir user_metadata für accountType
  const orgListLoaded = isLoaded; // Vereinfacht, da wir keine separate Organisation-Liste haben
  const organizationList: any[] = []; // Leer, da Supabase keine direkte Organisation-Funktionalität hat

  // Plan-Change-Redirect aktivieren (für automatische Weiterleitung nach Plan-Wechsel)
  usePlanChangeRedirect({
    enabled: true,
    redirectDelay: 1000,
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (isRedirecting) return;

    // User-Objekt neu laden, um sicherzustellen, dass user_metadata aktuell ist
    // (wird automatisch durch AuthContext aktualisiert)

    // Prüfe ob ein Plan gesetzt ist - direkt aus user_metadata lesen und normalisieren
    const rawPlan = user?.publicMetadata?.plan;
    let normalizedUserPlan: PlanType | undefined;
    
    if (rawPlan) {
      if (typeof rawPlan === 'string') {
        const lowerPlan = rawPlan.toLowerCase().trim();
        // Mappe mögliche Varianten
        if (lowerPlan === 'enterprise' || lowerPlan.includes('enterprise')) {
          normalizedUserPlan = 'enterprise';
        } else if (lowerPlan === 'pro' || lowerPlan.includes('pro')) {
          normalizedUserPlan = 'pro';
        } else if (lowerPlan === 'starter' || lowerPlan.includes('starter')) {
          normalizedUserPlan = 'starter';
        } else if (lowerPlan === 'individual' || lowerPlan.includes('individual')) {
          normalizedUserPlan = 'individual';
        }
      }
    }
    
    // Debug-Logging
    if (import.meta.env.DEV) {
      console.log('[DashboardRedirect] Plan Check:', {
        rawPlan,
        normalizedUserPlan,
        planFromHook: plan,
        accountType,
        userMetadata: user?.publicMetadata,
      });
    }
    
    const hasPlan = normalizedUserPlan && normalizedUserPlan !== 'starter'; // 'starter' ist der Default, zählen wir als "kein Plan gewählt"
    
    // Verwende den normalisierten Plan für die Weiterleitung
    const planToUse = normalizedUserPlan || plan;

    // Für Team-Benutzer: Prüfe ob Organization vorhanden ist
    if (accountType === 'team') {
      if (!orgListLoaded) return; // Warte auf Organization-Liste

      const hasOrganization = organizationList && organizationList.length > 0;

      if (!hasOrganization) {
        // Keine Organization vorhanden → Team-Erstellung
        // Weiterleitung zur Billing-Seite für Team-Erstellung
        setIsRedirecting(true);
        navigate('/dashboard/billing?createOrganization=true', { replace: true });
        return;
      }

      // Organization vorhanden, prüfe Plan
      if (!hasPlan) {
        // Kein Plan gewählt → Weiterleitung zur Billing-Seite
        setIsRedirecting(true);
        // Öffne Clerk User Profile Modal mit Billing Tab
        // Da wir keine direkte API haben, leiten wir zu einer Billing-Seite weiter
        navigate('/dashboard/billing', { replace: true });
        return;
      }

      // Plan vorhanden → Weiterleitung zum passenden Team-Dashboard
      setIsRedirecting(true);
      if (planToUse === 'enterprise') {
        navigate('/dashboard/enterprise', { replace: true });
      } else if (planToUse === 'pro') {
        navigate('/dashboard/pro', { replace: true });
      } else if (planToUse === 'individual') {
        navigate('/dashboard/individual', { replace: true });
      } else {
        navigate('/dashboard/starter', { replace: true });
      }
      return;
    }

    // Für Individual-Benutzer
    if (!hasPlan) {
      // Kein Plan gewählt → Weiterleitung zur Billing-Seite
      setIsRedirecting(true);
      navigate('/dashboard/billing', { replace: true });
      return;
    }

    // Plan vorhanden → Weiterleitung zum passenden Dashboard
    setIsRedirecting(true);
    if (planToUse === 'enterprise') {
      navigate('/dashboard/enterprise', { replace: true });
    } else if (planToUse === 'pro') {
      navigate('/dashboard/pro', { replace: true });
    } else if (planToUse === 'individual') {
      navigate('/dashboard/individual', { replace: true });
    } else {
      navigate('/dashboard/starter', { replace: true });
    }
  }, [isLoaded, isSignedIn, plan, accountType, user, organizationList, orgListLoaded, navigate, isRedirecting]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Lade...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Weiterleitung...</p>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
