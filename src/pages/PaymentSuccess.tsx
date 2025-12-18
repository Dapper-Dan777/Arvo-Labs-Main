import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useUser } from '@/contexts/AuthContext';
import { supabase } from '@/Integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/auth/sign-in');
      return;
    }

    if (!sessionId) {
      setError('Keine Session-ID gefunden');
      setIsLoading(false);
      return;
    }

    // Warte kurz, damit der Webhook Zeit hat, die Daten zu aktualisieren
    const checkSubscription = async () => {
      try {
        // Warte 2 Sekunden, damit der Webhook verarbeitet werden kann
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Lade User-Profil neu
        if (user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('plan, account_type')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error loading profile:', profileError);
          }

          if (profile) {
            setIsSuccess(true);
            toast({
              title: 'Erfolgreich!',
              description: `Dein ${profile.plan} Plan wurde erfolgreich aktiviert.`,
            });
          } else {
            setError('Profil nicht gefunden');
          }
        }
      } catch (err: any) {
        console.error('Error checking subscription:', err);
        setError(err.message || 'Fehler beim Laden der Subscription');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [sessionId, isSignedIn, user?.id, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-center">
                  Zahlung wird verarbeitet...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                Fehler
              </CardTitle>
              <CardDescription>
                Es gab ein Problem bei der Verarbeitung deiner Zahlung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/dashboard/billing')}
                  variant="outline"
                  className="flex-1"
                >
                  Zur Billing-Seite
                </Button>
                <Button
                  onClick={() => navigate('/preise')}
                  className="flex-1"
                >
                  Zu den Plänen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Zahlung erfolgreich!
            </CardTitle>
            <CardDescription className="text-center">
              Dein Abonnement wurde erfolgreich aktiviert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Vielen Dank für dein Abonnement. Du kannst jetzt alle Features deines Plans nutzen.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Zum Dashboard
              </Button>
              <Button
                onClick={() => navigate('/dashboard/billing')}
                variant="outline"
                className="flex-1"
              >
                Abonnement verwalten
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

