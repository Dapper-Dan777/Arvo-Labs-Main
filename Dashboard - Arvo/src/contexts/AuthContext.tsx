import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getUserProfile, updateUserProfile, createUserProfile, profileToUser } from "@/lib/userProfiles";
import { emailService } from "@/services/emailService";
import { verifyTOTPCode, validateBackupCode, removeUsedBackupCode } from "@/lib/2fa";

// User Interface
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string | null;
  isAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string, twoFactorCode?: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  logout: () => void;
  register: (username: string, password: string, name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  enable2FA: (secret: string, backupCodes: string[]) => Promise<void>;
  disable2FA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lade Session beim Mount
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    // Versuche zuerst, gespeicherten Admin-User zu laden (für Fallback ohne Supabase)
    const savedAdminUser = localStorage.getItem('arvo_admin_user');
    if (savedAdminUser) {
      try {
        const adminUser = JSON.parse(savedAdminUser);
        // Prüfe ob die Session noch gültig ist (z.B. nicht älter als 30 Tage)
        const savedAt = localStorage.getItem('arvo_admin_user_saved_at');
        if (savedAt) {
          const daysSinceSaved = (Date.now() - parseInt(savedAt)) / (1000 * 60 * 60 * 24);
          if (daysSinceSaved < 30) {
            setUser(adminUser);
            setIsLoading(false);
            // Return early cleanup function für Admin-User
            return () => {
              // Cleanup falls nötig
            };
          } else {
            // Session abgelaufen, entferne gespeicherten User
            localStorage.removeItem('arvo_admin_user');
            localStorage.removeItem('arvo_admin_user_saved_at');
          }
        }
      } catch (error) {
        console.error('Error loading saved admin user:', error);
        localStorage.removeItem('arvo_admin_user');
        localStorage.removeItem('arvo_admin_user_saved_at');
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase ist nicht konfiguriert. Bitte setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in der .env Datei.");
      // Setze isLoading auf false, damit die App weiterläuft (falls lokales Auth verwendet werden soll)
      setIsLoading(false);
      return () => {
        // Cleanup falls nötig
      };
    }

    // Prüfe aktuelle Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserFromSupabase(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Höre auf Auth-Änderungen
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserFromSupabase(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        // Entferne auch gespeicherten Admin-User beim Logout
        localStorage.removeItem('arvo_admin_user');
        localStorage.removeItem('arvo_admin_user_saved_at');
        setIsLoading(false);
      }
    });

    subscription = authSubscription;

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadUserFromSupabase = async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // Lade Auth User
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Lade User Profile
      let profile = await getUserProfile(userId);

      // Falls kein Profil existiert, erstelle eines
      if (!profile && authUser) {
        const username = authUser.user_metadata?.username || 
                        (authUser.email?.split('@') ? authUser.email.split('@')[0] : null) || 
                        `user_${userId.slice(0, 8)}`;
        const name = authUser.user_metadata?.name || authUser.email || 'User';

        profile = await createUserProfile(userId, {
          username,
          name,
          email: authUser.email,
          avatar: authUser.user_metadata?.avatar || null,
          is_admin: false,
          email_verified: !!authUser.email_confirmed_at,
          two_factor_enabled: false,
          two_factor_secret: null,
          two_factor_backup_codes: null,
        });
      }

      if (profile) {
        const appUser = profileToUser(profile, authUser);
        setUser(appUser);
      }
    } catch (error) {
      console.error('Error loading user from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
    twoFactorCode?: string
  ): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      if (!username || !password) {
        setIsLoading(false);
        return { success: false, error: "Bitte geben Sie Benutzername und Passwort ein" };
      }

      const usernameLower = username.trim().toLowerCase();
      
      // Spezieller Fallback für Admin-Login (arvo-admin / Arvo-Admin)
      // Funktioniert auch ohne Supabase-Konfiguration
      if (usernameLower === "arvo-admin" && password.toLowerCase() === "admin123") {
        const adminUser: User = {
          id: "admin-1",
          username: "Arvo-Admin",
          name: "Arvo Admin",
          email: "admin@arvo-labs.de",
          avatar: null,
          isAdmin: true,
          emailVerified: true,
          twoFactorEnabled: false,
        };
        
        setUser(adminUser);
        // Speichere Admin-User in localStorage für "Angemeldet bleiben"
        localStorage.setItem('arvo_admin_user', JSON.stringify(adminUser));
        localStorage.setItem('arvo_admin_user_saved_at', Date.now().toString());
        setIsLoading(false);
        return { success: true };
      }

      // Für normale User benötigen wir Supabase
      if (!isSupabaseConfigured || !supabase) {
        const missingItems: string[] = [];
        if (!import.meta.env.VITE_SUPABASE_URL) missingItems.push('VITE_SUPABASE_URL');
        if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingItems.push('VITE_SUPABASE_ANON_KEY');
        
        const errorMsg = missingItems.length > 0
          ? `Supabase ist nicht konfiguriert. Fehlende Variablen: ${missingItems.join(', ')}. Bitte erstelle eine .env Datei im Projekt-Root mit diesen Variablen. WICHTIG: Dev-Server nach .env Änderungen neu starten!`
          : "Supabase ist nicht konfiguriert. Bitte überprüfe die .env Datei und starte den Dev-Server neu.";
        
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      // Versuche Login mit E-Mail oder Username
      // Supabase Auth verwendet E-Mail, also müssen wir zuerst das Profil finden
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('email, username')
        .or(`username.eq.${username},email.eq.${username}`)
        .maybeSingle();

      if (profileError || !profile) {
        setIsLoading(false);
        return { success: false, error: "Benutzername oder E-Mail nicht gefunden" };
      }

      // Prüfe ob E-Mail vorhanden ist (Pflicht für Supabase Auth)
      if (!profile.email) {
        setIsLoading(false);
        return { success: false, error: "Keine E-Mail-Adresse für diesen Benutzer gefunden" };
      }

      const loginEmail = profile.email;

      // Login mit Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (authError) {
        setIsLoading(false);
        return { success: false, error: authError.message || "Anmeldung fehlgeschlagen" };
      }

      if (!authData.user) {
        setIsLoading(false);
        return { success: false, error: "Anmeldung fehlgeschlagen" };
      }

      // Lade User Profile
      const userProfile = await getUserProfile(authData.user.id);
      if (!userProfile) {
        setIsLoading(false);
        return { success: false, error: "Benutzerprofil nicht gefunden" };
      }

      // Prüfe 2FA
      if (userProfile.two_factor_enabled && userProfile.two_factor_secret) {
        if (!twoFactorCode) {
          setIsLoading(false);
          return { success: false, requires2FA: true, error: "2FA-Code erforderlich" };
        }

        const isValidTOTP = verifyTOTPCode(twoFactorCode, userProfile.two_factor_secret);
        let isValidBackup = false;
        let updatedBackupCodes = userProfile.two_factor_backup_codes || [];

        if (!isValidTOTP && userProfile.two_factor_backup_codes) {
          isValidBackup = validateBackupCode(twoFactorCode, userProfile.two_factor_backup_codes);
          if (isValidBackup) {
            updatedBackupCodes = removeUsedBackupCode(twoFactorCode, userProfile.two_factor_backup_codes);
            await updateUserProfile(authData.user.id, {
              two_factor_backup_codes: updatedBackupCodes,
            });
          }
        }

        if (!isValidTOTP && !isValidBackup) {
          setIsLoading(false);
          return { success: false, requires2FA: true, error: "Ungültiger 2FA-Code" };
        }
      }

      // Lade finalen User
      await loadUserFromSupabase(authData.user.id);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, error: "Fehler beim Anmelden: " + (error instanceof Error ? error.message : String(error)) };
    }
  };

  const register = async (
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase ist nicht konfiguriert. Bitte setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in der .env Datei." };
    }

    setIsLoading(true);

    try {
      // Validierung
      if (!username || !password || !name || !email) {
        setIsLoading(false);
        return { success: false, error: "Bitte füllen Sie alle Felder aus" };
      }

      const trimmedUsername = username.trim();
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (trimmedUsername.length < 3) {
        setIsLoading(false);
        return { success: false, error: "Benutzername muss mindestens 3 Zeichen lang sein" };
      }

      if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        setIsLoading(false);
        return { success: false, error: "Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setIsLoading(false);
        return { success: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse ein" };
      }

      // Prüfe ob Username bereits existiert
      const { data: existingProfile, error: existingError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        // PGRST116 bedeutet "kein Eintrag gefunden" - das ist OK
        console.error('Error checking username:', existingError);
      }

      if (existingProfile) {
        setIsLoading(false);
        return { success: false, error: "User vergeben" };
      }

      // Erstelle User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            username: trimmedUsername,
            name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (authError) {
        setIsLoading(false);
        return { success: false, error: authError.message || "Registrierung fehlgeschlagen" };
      }

      if (!authData.user) {
        setIsLoading(false);
        return { success: false, error: "Registrierung fehlgeschlagen" };
      }

      // Profil wird automatisch vom Trigger erstellt, aber wir können es auch manuell erstellen (falls Trigger nicht greift)
      let profile = await getUserProfile(authData.user.id);
      if (!profile) {
        profile = await createUserProfile(authData.user.id, {
          username: trimmedUsername,
          name: trimmedName,
          email: trimmedEmail,
          avatar: null,
          is_admin: false,
          email_verified: false,
          two_factor_enabled: false,
          two_factor_secret: null,
          two_factor_backup_codes: null,
        });
      }

      if (profile) {
        const appUser = profileToUser(profile, authData.user);
        setUser(appUser);
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      setIsLoading(false);
      return { success: false, error: "Fehler bei der Registrierung: " + (error instanceof Error ? error.message : String(error)) };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    // Entferne auch gespeicherten Admin-User beim Logout
    localStorage.removeItem('arvo_admin_user');
    localStorage.removeItem('arvo_admin_user_saved_at');
    setIsLoading(false);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user || !isSupabaseConfigured || !supabase) return;

    try {
      const profileUpdates: any = {};
      if (updates.name !== undefined) profileUpdates.name = updates.name;
      if (updates.email !== undefined) profileUpdates.email = updates.email;
      if (updates.avatar !== undefined) profileUpdates.avatar = updates.avatar;
      if (updates.isAdmin !== undefined) profileUpdates.is_admin = updates.isAdmin;
      if (updates.emailVerified !== undefined) profileUpdates.email_verified = updates.emailVerified;
      if (updates.twoFactorEnabled !== undefined) profileUpdates.two_factor_enabled = updates.twoFactorEnabled;
      if (updates.twoFactorSecret !== undefined) profileUpdates.two_factor_secret = updates.twoFactorSecret;
      if (updates.twoFactorBackupCodes !== undefined) profileUpdates.two_factor_backup_codes = updates.twoFactorBackupCodes;

      const updatedProfile = await updateUserProfile(user.id, profileUpdates);
      if (updatedProfile) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const appUser = profileToUser(updatedProfile, authUser);
        setUser(appUser);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase ist nicht konfiguriert" };
    }

    try {
      // Versuche zuerst mit token_hash (wenn es ein Hash ist)
      let data: any = null;
      let error: any = null;

      // Versuch 1: token_hash (für Email-Links von Supabase)
      const result1 = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (!result1.error && result1.data?.user) {
        data = result1.data;
      } else {
        error = result1.error;
        
        // Versuch 2: token + email (wenn User eingeloggt ist)
        if (user?.email) {
          const result2 = await supabase.auth.verifyOtp({
            token: token,
            type: 'email',
            email: user.email,
          });

          if (!result2.error && result2.data?.user) {
            data = result2.data;
            error = null;
          } else {
            error = result2.error || error;
          }
        }
      }

      if (error) {
        return { success: false, error: error.message || "Ungültiger Token" };
      }

      if (data?.user) {
        await updateUserProfile(data.user.id, { email_verified: true });
        await loadUserFromSupabase(data.user.id);
        return { success: true };
      }

      return { success: false, error: "Token konnte nicht verifiziert werden" };
    } catch (error) {
      console.error("Error verifying email:", error);
      return { success: false, error: "Fehler bei der E-Mail-Verifizierung" };
    }
  };

  const enable2FA = async (secret: string, backupCodes: string[]): Promise<void> => {
    if (!user) return;
    await updateUser({
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
    });

    if (user.email) {
      emailService.send2FASetupEmail(user.email, user.username);
    }
  };

  const disable2FA = async (): Promise<void> => {
    if (!user) return;
    await updateUser({
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined,
    });
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin === true,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    verifyEmail,
    enable2FA,
    disable2FA,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
