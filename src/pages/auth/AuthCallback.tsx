import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/Integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Prüfe ob bereits eingeloggt
        if (isSignedIn && user) {
          console.log('✅ User bereits eingeloggt, leite weiter...');
          setStatus('success');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
          return;
        }

        // Supabase verarbeitet automatisch Hash-Parameter (#access_token=...)
        // Wir müssen nur die Session abrufen
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session) {
          console.log('✅ Session erfolgreich gesetzt:', session.user.email);
          setStatus('success');
          
          // Kurz warten, damit der AuthContext aktualisiert wird
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          // Keine Session gefunden - prüfe URL-Parameter
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const errorParam = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');

          if (errorParam) {
            throw new Error(errorDescription || errorParam);
          }

          if (accessToken && refreshToken) {
            // Setze Session manuell
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (setSessionError) {
              throw setSessionError;
            }

            if (data.session) {
              console.log('✅ Session manuell gesetzt:', data.session.user.email);
              setStatus('success');
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 1000);
            } else {
              throw new Error('Keine Session erhalten');
            }
          } else {
            // Keine Token in URL - möglicherweise bereits bestätigt oder Fehler
            // Prüfe ob User existiert
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            
            if (currentUser) {
              console.log('✅ User gefunden, leite weiter...');
              setStatus('success');
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 1000);
            } else {
              throw new Error('Keine gültige Session gefunden. Bitte melde dich erneut an.');
            }
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Fehler bei der Authentifizierung');
        setStatus('error');
        
        // Nach 3 Sekunden zur Login-Seite weiterleiten
        setTimeout(() => {
          navigate('/auth/sign-in', { 
            replace: true,
            state: { 
              error: err.message || 'Fehler bei der E-Mail-Bestätigung. Bitte melde dich erneut an.' 
            }
          });
        }, 3000);
      }
    }

    handleAuthCallback();
  }, [navigate, isSignedIn, user]);

  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {status === 'loading' && 'E-Mail wird bestätigt...'}
                {status === 'success' && 'E-Mail erfolgreich bestätigt!'}
                {status === 'error' && 'Fehler bei der Bestätigung'}
              </CardTitle>
              <CardDescription className="text-center">
                {status === 'loading' && 'Bitte warte einen Moment...'}
                {status === 'success' && 'Du wirst gleich weitergeleitet...'}
                {status === 'error' && error}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              {status === 'loading' && (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

