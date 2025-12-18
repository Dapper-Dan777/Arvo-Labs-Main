import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/Integrations/supabase/client';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect wenn bereits eingeloggt (nach erfolgreicher Registrierung)
  useEffect(() => {
    if (isSignedIn && success) {
      // Nach Registrierung direkt zum Dashboard (Starter Plan ist Standard)
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, success, navigate]);

  // Prüfe Auth-Status nach Registrierung (nur als Fallback)
  // Wenn E-Mail-Bestätigung deaktiviert ist, sollte der User bereits eingeloggt sein
  useEffect(() => {
    if (success && !isSignedIn) {
      // Warte etwas länger, damit Supabase Session setzen kann
      const timer = setTimeout(() => {
        if (!isSignedIn) {
          // Prüfe nochmal direkt bei Supabase
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              // Session existiert, aber AuthContext hat sie noch nicht erkannt
              // Warte noch etwas
              console.log('Session gefunden, warte auf AuthContext-Update...');
            } else {
              // Keine Session - E-Mail-Bestätigung könnte erforderlich sein
              console.log('⚠️ Keine Session gefunden - möglicherweise E-Mail-Bestätigung erforderlich');
              // Zeige nur eine Info, keine Fehlermeldung
              navigate('/auth/sign-in', { 
                replace: true,
                state: { 
                  message: 'Bitte melde dich mit deinen Zugangsdaten an.',
                  email: email
                }
              });
            }
          });
        }
      }, 2000); // Reduziert von 3 auf 2 Sekunden
      
      return () => clearTimeout(timer);
    }
  }, [success, isSignedIn, navigate, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validierung
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    setIsLoading(true);

    try {
      const { error, data } = await signUp(email, password, {
        full_name: fullName || email.split('@')[0],
      });
      
      if (error) {
        // Bessere Fehlermeldungen
        let errorMessage = 'Registrierung fehlgeschlagen';
        
        if (error.message?.includes('User already registered')) {
          errorMessage = 'Diese E-Mail-Adresse ist bereits registriert';
        } else if (error.message?.includes('Password')) {
          errorMessage = 'Das Passwort erfüllt nicht die Anforderungen';
        } else if (error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
          errorMessage = 'Netzwerkfehler. Bitte prüfe deine Internetverbindung und die Supabase-Konfiguration.';
        } else {
          errorMessage = error.message || 'Registrierung fehlgeschlagen';
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Prüfe, ob User bereits eingeloggt ist (wenn Email-Bestätigung deaktiviert)
      if (data?.user && data?.session) {
        console.log('✅ User direkt eingeloggt (E-Mail-Bestätigung deaktiviert)');
        
        // User ist bereits eingeloggt → erstelle Stripe Customer
        try {
          await fetch('/api/create-stripe-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: email,
              fullName: fullName || email.split('@')[0],
            }),
          });
          // Ignoriere Fehler bei Customer-Erstellung (kann später nachgeholt werden)
        } catch (err) {
          console.error('Error creating Stripe customer:', err);
        }

        // User ist bereits eingeloggt → direkt zum Dashboard
        setSuccess(true);
        setIsLoading(false);
        
        // Kurz warten, dann zum Dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else if (data?.user && !data?.session) {
        // Keine Session zurückgegeben - E-Mail-Bestätigung ist erforderlich
        console.log('📧 E-Mail-Bestätigung erforderlich - User muss E-Mail bestätigen');
        setSuccess(true);
        setIsLoading(false);
        setError(null);
        
        // Zeige Erfolgsmeldung mit Hinweis auf E-Mail-Bestätigung
        setTimeout(() => {
          navigate('/auth/sign-in', { 
            replace: true,
            state: { 
              message: 'Registrierung erfolgreich! Bitte prüfe deine E-Mail-Adresse und klicke auf den Bestätigungs-Link, um dein Konto zu aktivieren.',
              email: email
            }
          });
        }, 2000);
      } else {
        // Unerwarteter Fall
        console.error('Unerwarteter SignUp-Status:', data);
        setError('Registrierung erfolgreich, aber Login fehlgeschlagen. Bitte versuche dich anzumelden.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Registrierung erfolgreich!</h2>
                    <p className="text-muted-foreground mt-2">
                      Du wirst gleich zum Dashboard weitergeleitet...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
              <CardDescription>
                Erstelle ein neues Konto, um loszulegen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Vollständiger Name (optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Max Mustermann"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mindestens 8 Zeichen"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Das Passwort muss mindestens 8 Zeichen lang sein
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Wird registriert...
                    </>
                  ) : (
                    'Registrieren'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Bereits ein Konto?{' '}
                  <Link
                    to="/auth/sign-in"
                    className="text-primary hover:underline font-medium"
                  >
                    Jetzt anmelden
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

