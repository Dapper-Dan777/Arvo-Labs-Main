import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useUser } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { supabase } from '@/Integrations/supabase/client';
import { getStripePriceId, isValidPriceId } from '@/config/stripe';
import { toast } from '@/hooks/use-toast';
import { PlanType } from '@/config/access';

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function SubscriptionManagement() {
  const { user } = useUser();
  const { plan, accountType } = useUserPlan();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSubscription();
    }
  }, [user?.id]);

  const loadSubscription = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (targetPlan: PlanType) => {
    if (!user?.id) {
      navigate('/auth/sign-in');
      return;
    }

    const priceId = getStripePriceId(targetPlan, accountType);
    
    if (!priceId || !isValidPriceId(priceId)) {
      toast({
        title: 'Konfigurationsfehler',
        description: `Stripe Price ID für Plan "${targetPlan}" ist nicht konfiguriert.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUpgrading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          priceId,
          accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen der Checkout-Session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Starten des Upgrades',
        variant: 'destructive',
      });
      setIsUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription || !user?.id) return;

    const confirmed = window.confirm(
      'Möchtest du wirklich dein Abonnement kündigen? Du kannst bis zum Ende der Abrechnungsperiode weiter nutzen.'
    );

    if (!confirmed) return;

    setIsCanceling(true);

    try {
      // In einer echten Implementierung würdest du hier die Stripe API aufrufen
      // um die Subscription zu kündigen. Für jetzt aktualisieren wir nur die DB.
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: subscription.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Kündigen des Abonnements');
      }

      toast({
        title: 'Abonnement gekündigt',
        description: 'Dein Abonnement wurde gekündigt und läuft bis zum Ende der Abrechnungsperiode.',
      });

      await loadSubscription();
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Kündigen des Abonnements',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }> = {
      active: { variant: 'default', icon: <CheckCircle2 className="w-4 h-4" /> },
      trialing: { variant: 'default', icon: <CheckCircle2 className="w-4 h-4" /> },
      past_due: { variant: 'destructive', icon: <AlertTriangle className="w-4 h-4" /> },
      canceled: { variant: 'secondary', icon: <XCircle className="w-4 h-4" /> },
      unpaid: { variant: 'destructive', icon: <XCircle className="w-4 h-4" /> },
    };

    const config = variants[status] || { variant: 'secondary' as const, icon: null };

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActiveSubscription = subscription && ['active', 'trialing'].includes(subscription.status);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Aktueller Plan
              </CardTitle>
              <CardDescription>
                {plan ? `Du nutzt den ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` : 'Kein aktiver Plan'}
              </CardDescription>
            </div>
            {subscription && getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && (
            <>
              {subscription.current_period_end && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {subscription.cancel_at_period_end
                      ? `Läuft ab am ${formatDate(subscription.current_period_end)}`
                      : `Nächste Abrechnung: ${formatDate(subscription.current_period_end)}`}
                  </span>
                </div>
              )}

              {subscription.cancel_at_period_end && (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Dein Abonnement wurde gekündigt und läuft am {formatDate(subscription.current_period_end)} ab.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {!hasActiveSubscription && (
            <Alert>
              <AlertDescription>
                Du hast aktuell kein aktives Abonnement. Wähle einen Plan, um alle Features freizuschalten.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Plan ändern</CardTitle>
            <CardDescription>
              Upgrade oder Downgrade deinen Plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan !== 'pro' && (
              <Button
                onClick={() => handleUpgrade('pro')}
                disabled={isUpgrading}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Zu Pro upgraden</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            )}
            {plan !== 'enterprise' && (
              <Button
                onClick={() => handleUpgrade('enterprise')}
                disabled={isUpgrading}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Zu Enterprise upgraden</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            )}
            {plan !== 'starter' && plan !== 'pro' && (
              <Button
                onClick={() => handleUpgrade('starter')}
                disabled={isUpgrading}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Zu Starter downgraden</span>
                <ArrowDownRight className="w-4 h-4" />
              </Button>
            )}
            {isUpgrading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancel Subscription */}
      {hasActiveSubscription && !subscription.cancel_at_period_end && (
        <Card>
          <CardHeader>
            <CardTitle>Abonnement verwalten</CardTitle>
            <CardDescription>
              Kündige dein Abonnement oder verwalte deine Zahlungsmethoden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCancel}
              disabled={isCanceling}
              variant="destructive"
              className="w-full"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gekündigt...
                </>
              ) : (
                'Abonnement kündigen'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View All Plans */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={() => navigate('/preise')}
            variant="outline"
            className="w-full"
          >
            Alle Pläne anzeigen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

