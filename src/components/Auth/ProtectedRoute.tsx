import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePlan?: boolean;
  allowedPlans?: string[];
}

export function ProtectedRoute({ 
  children, 
  requirePlan = false,
  allowedPlans 
}: ProtectedRouteProps) {
  const { isSignedIn, isLoading } = useAuth();
  const location = useLocation();

  // Warte auf Auth-Status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Lade...</p>
        </div>
      </div>
    );
  }

  // Nicht eingeloggt → zur Login-Seite
  if (!isSignedIn) {
    return (
      <Navigate 
        to="/auth/sign-in" 
        state={{ redirectUrl: location.pathname }}
        replace 
      />
    );
  }

  // Wenn Plan-Überprüfung erforderlich
  if (requirePlan) {
    // TODO: Plan-Überprüfung implementieren
    // Für jetzt erlauben wir alle eingeloggten User
  }

  return <>{children}</>;
}


