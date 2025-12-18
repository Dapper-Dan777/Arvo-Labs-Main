import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/AuthContext';
import { getStripePriceId, isValidPriceId } from '@/config/stripe';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type AccountType = 'individual' | 'team';
export type PlanType = 'starter' | 'pro' | 'enterprise' | 'individual';

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  priceYearly?: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

interface PricingTableProps {
  accountType?: AccountType;
  onPlanSelect?: (plan: PlanType, accountType: AccountType) => void;
}

const INDIVIDUAL_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfekt für den Einstieg',
    price: 'Kostenlos',
    features: [
      'Basis-Features',
      'E-Mail Support',
      'Community-Zugang',
      'Bis zu 1.000 Anfragen/Monat',
    ],
    cta: 'Jetzt starten',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Für professionelle Nutzer',
    price: '€29',
    priceYearly: '€290',
    features: [
      'Alle Starter Features',
      'Erweiterte Funktionen',
      'Prioritäts-Support',
      'Bis zu 10.000 Anfragen/Monat',
      'API-Zugang',
    ],
    popular: true,
    cta: 'Pro abonnieren',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Für Unternehmen',
    price: '€99',
    priceYearly: '€990',
    features: [
      'Alle Pro Features',
      'Unbegrenzte Anfragen',
      'Dedizierter Support',
      'White-Label Optionen',
      'Custom Integrationen',
    ],
    cta: 'Enterprise abonnieren',
  },
  {
    id: 'individual',
    name: 'Individual',
    description: 'Maßgeschneiderte Lösung',
    price: 'Auf Anfrage',
    features: [
      'Alle Enterprise Features',
      'Custom Features',
      'On-Premise Option',
      'Dedizierter Account Manager',
      'SLA-Garantie',
    ],
    cta: 'Kontakt aufnehmen',
  },
];

const TEAM_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Team Starter',
    description: 'Für kleine Teams',
    price: '€49',
    priceYearly: '€490',
    features: [
      'Bis zu 5 Team-Mitglieder',
      'Team-Kollaboration',
      'Gemeinsame Workspaces',
      'Basis-Features',
    ],
    cta: 'Team Starter abonnieren',
  },
  {
    id: 'pro',
    name: 'Team Pro',
    description: 'Für wachsende Teams',
    price: '€99',
    priceYearly: '€990',
    features: [
      'Bis zu 20 Team-Mitglieder',
      'Alle Starter Features',
      'Erweiterte Team-Funktionen',
      'Prioritäts-Support',
      'API-Zugang',
    ],
    popular: true,
    cta: 'Team Pro abonnieren',
  },
  {
    id: 'enterprise',
    name: 'Team Enterprise',
    description: 'Für große Organisationen',
    price: '€299',
    priceYearly: '€2.990',
    features: [
      'Unbegrenzte Team-Mitglieder',
      'Alle Pro Features',
      'Dedizierter Support',
      'Custom Integrationen',
      'White-Label Optionen',
    ],
    cta: 'Team Enterprise abonnieren',
  },
];

export function PricingTable({ accountType: initialAccountType = 'individual', onPlanSelect }: PricingTableProps) {
  const [accountType, setAccountType] = useState<AccountType>(initialAccountType);
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  const plans = accountType === 'individual' ? INDIVIDUAL_PLANS : TEAM_PLANS;

  const handleSubscribe = async (plan: PlanType) => {
    if (!isSignedIn || !user?.id) {
      navigate('/auth/sign-in', { state: { redirectUrl: window.location.href } });
      return;
    }

    // Individual Plan → Kontaktseite
    if (plan === 'individual') {
      navigate('/kontakt?subject=individual-plan');
      return;
    }

    // Starter Plan → Direkt zum Dashboard
    if (plan === 'starter') {
      navigate('/dashboard');
      return;
    }

    const priceId = getStripePriceId(plan, accountType);
    
    if (!priceId || !isValidPriceId(priceId)) {
      toast({
        title: 'Konfigurationsfehler',
        description: `Stripe Price ID für Plan "${plan}" ist nicht konfiguriert.`,
        variant: 'destructive',
      });
      return;
    }

    setLoadingPlan(plan);

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

      if (onPlanSelect) {
        onPlanSelect(plan, accountType);
      }

      // Redirect zu Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Starten des Checkouts',
        variant: 'destructive',
      });
      setLoadingPlan(null);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Account Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setAccountType('individual')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              accountType === 'individual'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Individual
          </button>
          <button
            onClick={() => setAccountType('team')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              accountType === 'team'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Team
          </button>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={cn('text-sm', !isYearly && 'font-medium')}>Monatlich</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            isYearly ? 'bg-primary' : 'bg-muted'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              isYearly ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
        <span className={cn('text-sm', isYearly && 'font-medium')}>
          Jährlich
          {isYearly && <Badge variant="secondary" className="ml-2">2 Monate geschenkt</Badge>}
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const displayPrice = isYearly && plan.priceYearly ? plan.priceYearly : plan.price;
          const isLoading = loadingPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col',
                plan.popular && 'border-primary shadow-lg'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-3 py-1">
                    Beliebt
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{displayPrice}</span>
                  {plan.price !== 'Kostenlos' && plan.price !== 'Auf Anfrage' && (
                    <span className="text-muted-foreground ml-2">
                      {isYearly ? '/Jahr' : '/Monat'}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird geladen...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}



