import React, { useEffect } from 'react';
import { useUser, useOrganizationList, useClerk } from '@clerk/clerk-react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPlan } from '@/hooks/useUserPlan';
import { CreditCard, Building2 } from 'lucide-react';

function DashboardBillingContent() {
  const { user } = useUser();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();
  const { accountType } = useUserPlan();
  const { t } = useLanguage();
  const clerk = useClerk();

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
    try {
      clerk.openUserProfile();
    } catch (error) {
      console.error('Error opening user profile:', error);
    }
  };

  const handleOpenOrgBilling = (orgId: string) => {
    // Öffne Organization Profile Modal
    try {
      clerk.openOrganizationProfile({ organizationId: orgId });
    } catch (error) {
      console.error('Error opening organization profile:', error);
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

  return (
    <div className="space-y-6 animate-fade-in">
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
                <CardTitle>Individual Plan</CardTitle>
                <CardDescription>
                  Wähle einen Plan für dein persönliches Konto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Um einen Plan auszuwählen, öffne dein Benutzerprofil in Clerk.
              </p>
              <Button onClick={handleOpenUserBilling} className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Benutzerprofil öffnen
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
                <CardTitle>Team Plan</CardTitle>
                <CardDescription>
                  Wähle einen Plan für dein Team
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgListLoaded && organizationList && organizationList.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Wähle einen Plan für deine Organization:
                  </p>
                  {organizationList.map((org) => (
                    <div key={org.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.membersCount} Mitglieder
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenOrgBilling(org.id)}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Plan verwalten
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Du hast noch keine Organization erstellt. Erstelle zuerst ein Team.
                  </p>
                  <Button
                    onClick={handleCreateOrganization}
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Team erstellen
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

