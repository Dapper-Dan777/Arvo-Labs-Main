/**
 * Supabase Edge Function: Gmail OAuth
 * 
 * Diese Function handhabt:
 * - Token Exchange (Authorization Code -> Access/Refresh Token)
 * - Token Refresh
 * 
 * WICHTIG: Client Secret wird hier verwendet, niemals im Frontend!
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TokenExchangeRequest {
  code: string;
  redirect_uri: string;
}

interface TokenRefreshRequest {
  action: "refresh";
  refresh_token: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const clientId = Deno.env.get("GMAIL_CLIENT_ID");
    const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error(
        "GMAIL_CLIENT_ID oder GMAIL_CLIENT_SECRET nicht gesetzt"
      );
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header fehlt");
    }

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();

    // Handle Token Exchange
    if (body.code && body.redirect_uri) {
      const { code, redirect_uri } = body as TokenExchangeRequest;

      // Exchange code for tokens
      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirect_uri,
          }),
        }
      );

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${error}`);
      }

      const tokens = await tokenResponse.json();

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() + (tokens.expires_in || 3600)
      );

      // Save tokens to database
      const { error: dbError } = await supabase
        .from("user_integrations")
        .upsert(
          {
            user_id: user.id,
            integration_type: "gmail",
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: expiresAt.toISOString(),
            metadata: {
              scope: tokens.scope,
              token_type: tokens.token_type,
            },
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,integration_type",
          }
        );

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      return new Response(
        JSON.stringify({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
          token_type: tokens.token_type,
          scope: tokens.scope,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Handle Token Refresh
    if (body.action === "refresh" && body.refresh_token) {
      const { refresh_token } = body as TokenRefreshRequest;

      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refresh_token,
            grant_type: "refresh_token",
          }),
        }
      );

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Token refresh failed: ${error}`);
      }

      const tokens = await tokenResponse.json();

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() + (tokens.expires_in || 3600)
      );

      // Update tokens in database
      const { error: dbError } = await supabase
        .from("user_integrations")
        .update({
          access_token: tokens.access_token,
          token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("integration_type", "gmail");

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      return new Response(
        JSON.stringify({
          access_token: tokens.access_token,
          expires_in: tokens.expires_in,
          token_type: tokens.token_type,
          scope: tokens.scope,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    throw new Error("Invalid request body");
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

