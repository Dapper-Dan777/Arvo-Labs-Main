import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/Integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prüfe aktuelle Session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error in getSession:', error);
        setIsLoading(false);
      });

    // Höre auf Auth-Änderungen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Bei E-Mail-Bestätigung: Session ist bereits gesetzt
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Session ist aktiv
        if (session?.user) {
          console.log('✅ User eingeloggt:', session.user.email);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }
      
      return { error: null, data };
    } catch (err: any) {
      console.error('SignIn exception:', err);
      return { 
        error: { 
          message: err.message || 'Netzwerkfehler. Bitte prüfe deine Internetverbindung.',
          name: 'NetworkError'
        } as AuthError 
      };
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      // Setze Redirect-URL für E-Mail-Bestätigung
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) {
        console.error('SignUp error:', error);
        return { data: null, error };
      }
      
      console.log('SignUp successful, redirect URL:', redirectUrl);
      return { data, error: null };
    } catch (err: any) {
      console.error('SignUp exception:', err);
      return { 
        data: null,
        error: { 
          message: err.message || 'Netzwerkfehler. Bitte prüfe deine Internetverbindung.',
          name: 'NetworkError'
        } as AuthError 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Kompatibilitäts-Hook für useUser (wie bei Clerk)
export function useUser() {
  const { user, isLoading, isSignedIn } = useAuth();
  return {
    user: user ? {
      id: user.id,
      emailAddresses: [{ emailAddress: user.email || '' }],
      firstName: user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || '',
      lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      publicMetadata: user.user_metadata || {},
      reload: async () => {
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        return updatedUser ? {
          id: updatedUser.id,
          emailAddresses: [{ emailAddress: updatedUser.email || '' }],
          firstName: updatedUser.user_metadata?.full_name?.split(' ')[0] || updatedUser.email?.split('@')[0] || '',
          lastName: updatedUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          fullName: updatedUser.user_metadata?.full_name || updatedUser.email?.split('@')[0] || '',
          publicMetadata: updatedUser.user_metadata || {},
        } : null;
      },
    } : null,
    isLoaded: !isLoading,
    isSignedIn,
  };
}

// Komponenten für SignedIn/SignedOut (wie bei Clerk)
export function SignedIn({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return null;
  return isSignedIn ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return null;
  return !isSignedIn ? <>{children}</> : null;
}

// Redirect-Komponente (wie bei Clerk)
export function RedirectToSignIn() {
  useEffect(() => {
    window.location.href = '/auth/sign-in';
  }, []);
  return null;
}

