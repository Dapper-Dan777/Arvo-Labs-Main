import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { supabase } from '@/Integrations/supabase/client';
import { Link } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isSignedIn, user } = useAuth();
  const { plan, isLoaded: planLoaded } = useUserPlan();
  const navigate = useNavigate();
  const location = useLocation();

  // Prüfe ob Info-Meldung im State vorhanden ist
  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) {
      setInfoMessage(message);
    }
  }, [location]);

  // Redirect wenn bereits eingeloggt
  useEffect(() => {
    if (isSignedIn && planLoaded) {
      const redirectUrl = (location.state as any)?.redirectUrl;
      
      // Wenn eine spezifische Redirect-URL vorhanden ist, verwende diese
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
        return;
      }

      // Prüfe, ob User einen aktiven Plan hat (nicht nur Starter)
      // Wenn kein Plan oder nur Starter → zur Pricing-Seite
      // Sonst → zum Dashboard
      if (!plan || plan === 'starter') {
        navigate('/preise', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isSignedIn, planLoaded, plan, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Anmeldung fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      // Erfolgreich eingeloggt
      // Warte kurz, damit der Auth-State und Plan aktualisiert werden
      // Der useEffect wird dann automatisch weiterleiten
      setIsLoading(false);
      
      // Prüfe Plan nach kurzer Verzögerung
      setTimeout(async () => {
        if (user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .maybeSingle();

          const redirectUrl = (location.state as any)?.redirectUrl;
          
          if (redirectUrl) {
            navigate(redirectUrl, { replace: true });
          } else if (!profile || profile.plan === 'starter') {
            // Kein Plan oder nur Starter → zur Pricing-Seite
            navigate('/preise', { replace: true });
          } else {
            // Hat aktiven Plan → zum Dashboard
            navigate('/dashboard', { replace: true });
          }
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
              <CardDescription>
                Gib deine E-Mail-Adresse und dein Passwort ein, um dich anzumelden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {infoMessage && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{infoMessage}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@beispiel.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Passwort</Label>
                    <Link
                      to="/auth/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Passwort vergessen?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird angemeldet...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Noch kein Konto?{' '}
                  <Link
                    to="/auth/sign-up"
                    className="text-primary hover:underline font-medium"
                  >
                    Jetzt registrieren
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

