import React, { useEffect, useState } from 'react';
import { useUser, useOrganizationList, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPlan } from '@/hooks/useUserPlan';
import { usePlanChangeRedirect, usePlanPolling } from '@/hooks/usePlanChangeRedirect';
import { CreditCard, Building2 } from 'lucide-react';
import { PlanType } from '@/config/access';

function DashboardBillingContent() {
  const { user } = useUser();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();
  const { accountType, plan } = useUserPlan();
  const { t } = useLanguage();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [isWaitingForPlan, setIsWaitingForPlan] = useState(false);

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
    // Prüfe URL-Parameter für Organization Creation
    const urlParams = new URLSearchParams(window.location.search);
    const createOrg = urlParams.get('createOrganization');
    
    if (createOrg === 'true') {
      // Öffne Organization Creation Modal
      const timer = setTimeout(() => {
        try {
          clerk.openCreateOrganization({
            afterCreateOrganizationUrl: '/dashboard/billing',
          });
        } catch (error) {
          console.error('Error opening create organization:', error);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Versuche automatisch das Clerk User Profile Modal zu öffnen, wenn kein Plan vorhanden
    if (accountType === 'individual' && user) {
      const userPlan = user.publicMetadata?.plan;
      if (!userPlan || userPlan === 'starter') {
        // Öffne User Profile Modal nach kurzer Verzögerung
        const timer = setTimeout(() => {
          try {
            clerk.openUserProfile();
          } catch (error) {
            console.error('Error opening user profile:', error);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [accountType, user, clerk]);

  const handleOpenUserBilling = () => {
    // Öffne Clerk User Profile Modal
    setIsWaitingForPlan(true);
    try {
      clerk.openUserProfile({
        afterSignOutUrl: '/',
      });
      
      // Nach 3 Sekunden prüfen, ob Plan sich geändert hat
      setTimeout(async () => {
        await user?.reload();
        const currentPlan = user?.publicMetadata?.plan as PlanType | undefined;
        const hasPlan = currentPlan && currentPlan !== 'starter' && currentPlan !== plan;
        
        if (hasPlan && currentPlan) {
          const dashboardPath = getDashboardPath(currentPlan);
          navigate(dashboardPath, { replace: true });
          setIsWaitingForPlan(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error opening user profile:', error);
      setIsWaitingForPlan(false);
    }
  };

  const handleOpenOrgBilling = (orgId: string) => {
    // Öffne Organization Profile Modal
    setIsWaitingForPlan(true);
    try {
      clerk.openOrganizationProfile({ 
        organizationId: orgId,
      });
      
      // Nach 3 Sekunden prüfen, ob Plan sich geändert hat
      setTimeout(async () => {
        await user?.reload();
        const currentPlan = user?.publicMetadata?.plan as PlanType | undefined;
        const hasPlan = currentPlan && currentPlan !== 'starter' && currentPlan !== plan;
        
        if (hasPlan && currentPlan) {
          const dashboardPath = getDashboardPath(currentPlan);
          navigate(dashboardPath, { replace: true });
          setIsWaitingForPlan(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error opening organization profile:', error);
      setIsWaitingForPlan(false);
    }
  };

  const handleCreateOrganization = () => {
    // Öffne Organization Creation Modal
    try {
      clerk.openCreateOrganization({
        afterCreateOrganizationUrl: '/dashboard/billing',
      });
    } catch (error) {
      console.error('Error opening create organization:', error);
    }
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
                {t.dashboard.billing?.individualPrompt || 'Um einen Plan auszuwählen, öffne dein Benutzerprofil in Clerk.'}
              </p>
              <Button onClick={handleOpenUserBilling} className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                {t.dashboard.billing?.openBilling || 'Benutzerprofil öffnen'}
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

