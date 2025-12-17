import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useOrganizationList } from '@clerk/clerk-react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { PlanType } from '@/config/access';

export default function DashboardRedirect() {
  const { plan, accountType, isLoaded, isSignedIn } = useUserPlan();
  const { user } = useUser();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (isRedirecting) return;

    // Prüfe ob ein Plan gesetzt ist
    const userPlan = user?.publicMetadata?.plan as PlanType | undefined;
    const hasPlan = userPlan && userPlan !== 'starter'; // 'starter' ist der Default, zählen wir als "kein Plan gewählt"

    // Für Team-Benutzer: Prüfe ob Organization vorhanden ist
    if (accountType === 'team') {
      if (!orgListLoaded) return; // Warte auf Organization-Liste

      const hasOrganization = organizationList && organizationList.length > 0;

      if (!hasOrganization) {
        // Keine Organization vorhanden → Team-Erstellung
        // Weiterleitung zur Billing-Seite, die das Organization Creation Modal öffnet
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
      if (plan === 'starter') {
        navigate('/dashboard/starter', { replace: true });
      } else if (plan === 'pro') {
        navigate('/dashboard/pro', { replace: true });
      } else if (plan === 'enterprise') {
        navigate('/dashboard/enterprise', { replace: true });
      } else {
        navigate('/dashboard/individual', { replace: true });
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
    if (plan === 'starter') {
      navigate('/dashboard/starter', { replace: true });
    } else if (plan === 'pro') {
      navigate('/dashboard/pro', { replace: true });
    } else if (plan === 'enterprise') {
      navigate('/dashboard/enterprise', { replace: true });
    } else {
      navigate('/dashboard/individual', { replace: true });
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
