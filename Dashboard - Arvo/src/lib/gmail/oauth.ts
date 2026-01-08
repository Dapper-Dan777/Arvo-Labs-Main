/**
 * Gmail OAuth 2.0 Utilities
 * 
 * Diese Datei enthält Helper-Funktionen für den Gmail OAuth Flow.
 * Das Client Secret wird NUR in Supabase Edge Functions verwendet.
 */

import { supabase } from "@/lib/supabaseClient";

export interface GmailOAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export interface GmailTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// Gmail OAuth Scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
];

/**
 * Generiert einen zufälligen State-Parameter für CSRF-Schutz
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Speichert State im Session Storage
 */
export function saveState(state: string): void {
  sessionStorage.setItem('gmail_oauth_state', state);
}

/**
 * Validiert State aus Session Storage
 */
export function validateState(state: string): boolean {
  const savedState = sessionStorage.getItem('gmail_oauth_state');
  if (!savedState) return false;
  
  sessionStorage.removeItem('gmail_oauth_state');
  return savedState === state;
}

/**
 * Erstellt die Google OAuth Authorization URL
 */
export function getGmailAuthUrl(config: GmailOAuthConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    access_type: 'offline', // Wichtig für Refresh Token
    prompt: 'consent', // Erzwingt Consent Screen für Refresh Token
    state: state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Startet den Gmail OAuth Flow
 */
export async function startGmailOAuth(): Promise<void> {
  console.log('🚀 startGmailOAuth() wurde aufgerufen');
  
  const clientId = "633089084422-ic15kpbnlbcoqga067hbm7hfpctptbkr.apps.googleusercontent.com";
  const redirectUri = import.meta.env.VITE_GMAIL_REDIRECT_URI || `${window.location.origin}/auth/callback`;

  console.log('📋 Environment Variables Check:', {
    VITE_GMAIL_CLIENT_ID: clientId,
    VITE_GMAIL_REDIRECT_URI: import.meta.env.VITE_GMAIL_REDIRECT_URI,
    windowOrigin: window.location.origin,
    finalRedirectUri: redirectUri,
  });

  if (!clientId) {
    console.error('❌ VITE_GMAIL_CLIENT_ID ist nicht gesetzt!');
    console.error('Environment Variables:', {
      VITE_GMAIL_CLIENT_ID: import.meta.env.VITE_GMAIL_CLIENT_ID,
      VITE_GMAIL_REDIRECT_URI: import.meta.env.VITE_GMAIL_REDIRECT_URI,
      allEnv: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    });
    throw new Error('VITE_GMAIL_CLIENT_ID ist nicht gesetzt. Bitte erstellen Sie eine .env.local Datei im Projekt-Root mit: VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com');
  }

  const state = generateState();
  saveState(state);

  const authUrl = getGmailAuthUrl(
    {
      clientId,
      redirectUri,
      scopes: GMAIL_SCOPES,
    },
    state
  );

  // Debug: Zeige generierte URL (nur in Development)
  console.log('🔍🔍🔍 Gmail OAuth Debug:');
  console.log('  - Client ID:', clientId);
  console.log('  - Redirect URI:', redirectUri);
  console.log('  - Scopes:', GMAIL_SCOPES);
  console.log('  - Auth URL:', authUrl);
  console.log('  - Full Auth URL:', decodeURIComponent(authUrl));
  
  // Redirect zu Google OAuth
  window.location.href = authUrl;
}

/**
 * Tauscht Authorization Code gegen Tokens
 * Ruft Supabase Edge Function auf
 */
export async function exchangeCodeForTokens(code: string, state: string): Promise<GmailTokenResponse> {
  // Validiere State
  if (!validateState(state)) {
    throw new Error('Invalid state parameter. Possible CSRF attack.');
  }

  // Rufe Supabase Edge Function auf
  const { data, error } = await supabase?.functions.invoke('gmail-oauth', {
    body: {
      code,
      redirect_uri: import.meta.env.VITE_GMAIL_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(`Token exchange failed: ${error.message}`);
  }

  if (!data || !data.access_token) {
    throw new Error('Invalid response from token exchange');
  }

  return data;
}

/**
 * Speichert Tokens in Supabase
 */
export async function saveGmailTokens(tokens: GmailTokenResponse): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User ist nicht authentifiziert');
  }

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expires_in || 3600));

  const { error } = await supabase
    .from('user_integrations')
    .upsert({
      user_id: user.id,
      integration_type: 'gmail',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt.toISOString(),
      metadata: {
        scope: tokens.scope,
        token_type: tokens.token_type,
      },
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,integration_type',
    });

  if (error) {
    throw new Error(`Failed to save tokens: ${error.message}`);
  }
}

/**
 * Ruft gespeicherte Gmail Integration ab
 */
export async function getGmailIntegration() {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('integration_type', 'gmail')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Keine Integration gefunden
      return null;
    }
    throw new Error(`Failed to get integration: ${error.message}`);
  }

  return data;
}

/**
 * Prüft ob Gmail Integration verbunden ist
 */
export async function isGmailConnected(): Promise<boolean> {
  try {
    const integration = await getGmailIntegration();
    if (!integration) return false;

    // Prüfe ob Token noch gültig ist
    if (integration.token_expires_at) {
      const expiresAt = new Date(integration.token_expires_at);
      if (expiresAt < new Date()) {
        // Token abgelaufen, versuche Refresh
        try {
          await refreshGmailToken();
          return true;
        } catch {
          return false;
        }
      }
    }

    return !!integration.access_token;
  } catch {
    return false;
  }
}

/**
 * Refresht Gmail Access Token
 */
export async function refreshGmailToken(): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  const integration = await getGmailIntegration();
  if (!integration || !integration.refresh_token) {
    throw new Error('No refresh token available');
  }

  // Rufe Supabase Edge Function auf
  const { data, error } = await supabase?.functions.invoke('gmail-oauth', {
    body: {
      action: 'refresh',
      refresh_token: integration.refresh_token,
    },
  });

  if (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }

  if (!data || !data.access_token) {
    throw new Error('Invalid response from token refresh');
  }

  // Speichere neue Tokens
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + (data.expires_in || 3600));

  const { error: updateError } = await supabase
    .from('user_integrations')
    .update({
      access_token: data.access_token,
      token_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', integration.user_id)
    .eq('integration_type', 'gmail');

  if (updateError) {
    throw new Error(`Failed to update tokens: ${updateError.message}`);
  }
}

/**
 * Entfernt Gmail Integration
 */
export async function disconnectGmail(): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User ist nicht authentifiziert');
  }

  const { error } = await supabase
    .from('user_integrations')
    .delete()
    .eq('user_id', user.id)
    .eq('integration_type', 'gmail');

  if (error) {
    throw new Error(`Failed to disconnect: ${error.message}`);
  }
}

