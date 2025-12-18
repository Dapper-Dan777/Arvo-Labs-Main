import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePlanChangeRedirect, usePlanPolling } from '@/hooks/usePlanChangeRedirect';
import { CreditCard, Building2, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { PlanType } from '@/config/access';
import { supabase } from '@/Integrations/supabase/client';
import { getStripePriceId, isValidPriceId } from '@/config/stripe';
import { toast } from '@/hooks/use-toast';
import { CheckoutProvider } from '@/components/Checkout/CheckoutProvider';

function DashboardBillingContent() {
  const { user } = useUser();
  const { accountType, plan } = useUserPlan();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isWaitingForPlan, setIsWaitingForPlan] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: PlanType; priceId: string } | null>(null);
  
  // Für Supabase: Organisationen werden über user_metadata oder eine separate Tabelle verwaltet
  const orgListLoaded = true; // Vereinfacht
  const organizationList: any[] = []; // Leer, da Supabase keine direkte Organisation-Funktionalität hat

  // Polling aktivieren, wenn wir auf Plan-Änderung warten
  usePlanPolling({
    enabled: isWaitingForPlan,
    interval: 2000,
    onPlanChange: (newPlan: PlanType) => {
      setIsWaitingForPlan(false);
      // Weiterleitung zum richtigen Dashboard
      const dashboardPath = getDashboardPath(newPlan);
      navigate(dashboardPath, { replace: true });
    },
  });

  // Plan-Change-Redirect aktivieren
  usePlanChangeRedirect({
    enabled: true,
    redirectDelay: 1500,
    onRedirect: () => {
      setIsWaitingForPlan(false);
    },
  });

  useEffect(() => {
    // Prüfe URL-Parameter für Checkout-Ergebnis
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');
    const checkoutPlan = searchParams.get('checkout') as PlanType | null;
    
    // Wenn Checkout-Plan in URL, öffne Checkout
    if (checkoutPlan && user?.id) {
      const priceId = getStripePriceId(checkoutPlan, accountType);
      if (priceId && isValidPriceId(priceId)) {
        setSelectedPlan({ plan: checkoutPlan, priceId });
        // URL-Parameter entfernen
        navigate('/dashboard/billing', { replace: true });
      }
    }
    
    if (success === 'true' && sessionId) {
      toast({
        title: 'Erfolgreich!',
        description: 'Dein Plan wurde erfolgreich aktualisiert. Die Änderungen werden in Kürze sichtbar.',
      });
      setIsWaitingForPlan(true);
      // URL-Parameter entfernen
      navigate('/dashboard/billing', { replace: true });
    }
    
    if (canceled === 'true') {
      toast({
        title: 'Abgebrochen',
        description: 'Der Checkout wurde abgebrochen.',
        variant: 'destructive',
      });
      navigate('/dashboard/billing', { replace: true });
    }
    
    // Prüfe URL-Parameter für Organization Creation
    const createOrg = searchParams.get('createOrganization');
    if (createOrg === 'true') {
      console.log('Organization creation requested');
    }
  }, [searchParams, navigate, user?.id, accountType]);

  const handleOpenUserBilling = () => {
    // Weiterleitung zur Preisseite für Plan-Auswahl
    navigate('/preise');
  };

  const handleCreateCheckout = (targetPlan: PlanType) => {
    if (!user?.id) {
      toast({
        title: 'Fehler',
        description: 'Du musst angemeldet sein, um einen Plan zu abonnieren.',
        variant: 'destructive',
      });
      return;
    }

    const priceId = getStripePriceId(targetPlan, accountType);
    
    if (!priceId || !isValidPriceId(priceId)) {
      toast({
        title: 'Konfigurationsfehler',
        description: `Stripe Price ID für Plan "${targetPlan}" ist nicht konfiguriert. Bitte kontaktiere den Support.`,
        variant: 'destructive',
      });
      console.error('Invalid or missing Stripe Price ID for plan:', targetPlan);
      return;
    }

    // Zeige Checkout-Formular (Custom UI)
    setSelectedPlan({ plan: targetPlan, priceId });
  };

  const handleCheckoutSuccess = () => {
    setSelectedPlan(null);
    setIsWaitingForPlan(true);
    toast({
      title: 'Erfolgreich!',
      description: 'Dein Plan wurde erfolgreich aktiviert. Die Änderungen werden in Kürze sichtbar.',
    });
  };

  const handleCheckoutCancel = () => {
    setSelectedPlan(null);
  };

  const getPlanName = (plan: PlanType): string => {
    const planNames: Record<PlanType, string> = {
      starter: t.dashboard.plans.starter,
      pro: t.dashboard.plans.pro,
      enterprise: t.dashboard.plans.enterprise,
      individual: t.dashboard.plans.individual,
    };
    return planNames[plan] || plan;
  };

  const handleOpenOrgBilling = (orgId: string) => {
    // Für Supabase: Weiterleitung zur Plan-Auswahl-Seite für Teams
    navigate('/preise?type=team');
  };

  const handleCreateOrganization = () => {
    // Für Supabase: Organisation-Erstellung würde hier über eine separate Seite/Modal erfolgen
    // Hier können wir eine Info-Nachricht anzeigen oder zur Kontaktseite weiterleiten
    navigate('/kontakt?subject=team-creation');
  };

  // Helper-Funktion für Dashboard-Pfad
  const getDashboardPath = (plan: PlanType): string => {
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
  };

  // Wenn ein Plan für Checkout ausgewählt wurde, zeige Checkout-Formular
  if (selectedPlan && user?.id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Button
            variant="ghost"
            onClick={handleCheckoutCancel}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {getPlanName(selectedPlan.plan)} abonnieren
          </h1>
          <p className="text-muted-foreground mt-1">
            Vervollständige deine Zahlung, um den Plan zu aktivieren.
          </p>
        </div>
        
        <CheckoutProvider
          priceId={selectedPlan.priceId}
          planName={getPlanName(selectedPlan.plan)}
          userId={user.id}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {isWaitingForPlan && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {t.dashboard.billing?.waitingForPlan || 'Warte auf Plan-Aktualisierung... Du wirst automatisch weitergeleitet.'}
          </p>
        </div>
      )}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t.dashboard.billing?.title || 'Plan auswählen'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.dashboard.billing?.description || 'Wähle einen Plan, um alle Features freizuschalten.'}
        </p>
      </div>

      {accountType === 'individual' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>{t.dashboard.billing?.individualTitle || 'Individual Plan'}</CardTitle>
                <CardDescription>
                  {t.dashboard.billing?.individualDescription || 'Wähle einen Plan für dein persönliches Konto'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t.dashboard.billing?.individualPrompt || 'Wähle einen Plan, um alle Features freizuschalten.'}
              </p>
              
              {checkoutError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{checkoutError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan !== 'pro' && (
                  <Button
                    onClick={() => handleCreateCheckout('pro')}
                    disabled={isCreatingCheckout}
                    className="w-full"
                    variant={plan === 'pro' ? 'outline' : 'default'}
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Lädt...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pro Plan abonnieren
                      </>
                    )}
                  </Button>
                )}
                
                {plan !== 'enterprise' && (
                  <Button
                    onClick={() => handleCreateCheckout('enterprise')}
                    disabled={isCreatingCheckout}
                    className="w-full"
                    variant={plan === 'enterprise' ? 'outline' : 'default'}
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Lädt...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Enterprise Plan abonnieren
                      </>
                    )}
                  </Button>
                )}

                {plan !== 'individual' && (
                  <Button
                    onClick={() => handleCreateCheckout('individual')}
                    disabled={isCreatingCheckout}
                    className="w-full"
                    variant={plan === 'individual' ? 'outline' : 'default'}
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Lädt...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Individual Plan abonnieren
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Button
                onClick={handleOpenUserBilling}
                variant="outline"
                className="w-full"
              >
                Alle Pläne anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>{t.dashboard.billing?.teamTitle || 'Team Plan'}</CardTitle>
                <CardDescription>
                  {t.dashboard.billing?.teamDescription || 'Wähle einen Plan für dein Team'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgListLoaded && organizationList && organizationList.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.billing?.teamBillingPrompt || 'Wähle einen Plan für deine Organization:'}
                  </p>
                  {organizationList.map((org) => (
                    <div key={org.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.membersCount} {t.dashboard.billing?.members || 'Mitglieder'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenOrgBilling(org.id)}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          {t.dashboard.billing?.openTeamBilling || 'Plan verwalten'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.billing?.teamCreationPrompt || 'Du hast noch keine Organization erstellt. Erstelle zuerst ein Team.'}
                  </p>
                  <Button
                    onClick={handleCreateOrganization}
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    {t.dashboard.billing?.createTeam || 'Team erstellen'}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardBilling() {
  return (
    <DashboardLayout>
      <DashboardBillingContent />
    </DashboardLayout>
  );
}

