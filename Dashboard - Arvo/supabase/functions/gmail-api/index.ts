/**
 * Supabase Edge Function: Gmail API
 * 
 * Diese Function handhabt alle Gmail API Calls:
 * - List Emails
 * - Get Email
 * - Send Email
 * - Modify Email (Labels, Read/Unread)
 * 
 * Nutzt googleapis npm package
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { google } from "https://esm.sh/googleapis@126.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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
    const { action, access_token, ...params } = body;

    if (!access_token) {
      throw new Error("Access token fehlt");
    }

    // Create Gmail client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: access_token,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Handle different actions
    switch (action) {
      case "list": {
        const {
          maxResults = 10,
          pageToken,
          q,
          labelIds,
        } = params;

        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults,
          pageToken,
          q,
          labelIds,
        });

        return new Response(JSON.stringify(response.data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "get": {
        const { messageId, format = "full" } = params;

        if (!messageId) {
          throw new Error("messageId fehlt");
        }

        const response = await gmail.users.messages.get({
          userId: "me",
          id: messageId,
          format: format as "full" | "metadata" | "minimal" | "raw",
        });

        return new Response(JSON.stringify(response.data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "send": {
        const { to, subject, body, htmlBody, cc, bcc, replyTo, attachments } =
          params;

        if (!to || !subject || (!body && !htmlBody)) {
          throw new Error("to, subject und body/htmlBody sind erforderlich");
        }

        // Build email
        const toArray = Array.isArray(to) ? to : [to];
        const ccArray = cc ? (Array.isArray(cc) ? cc : [cc]) : [];
        const bccArray = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];

        let email = `To: ${toArray.join(", ")}\r\n`;
        if (ccArray.length > 0) {
          email += `Cc: ${ccArray.join(", ")}\r\n`;
        }
        if (bccArray.length > 0) {
          email += `Bcc: ${bccArray.join(", ")}\r\n`;
        }
        if (replyTo) {
          email += `Reply-To: ${replyTo}\r\n`;
        }
        email += `Subject: ${subject}\r\n`;

        // Add body
        if (htmlBody) {
          email += `Content-Type: text/html; charset=utf-8\r\n`;
          email += `\r\n${htmlBody}`;
        } else {
          email += `Content-Type: text/plain; charset=utf-8\r\n`;
          email += `\r\n${body}`;
        }

        // Encode email
        const encodedEmail = btoa(email)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const response = await gmail.users.messages.send({
          userId: "me",
          requestBody: {
            raw: encodedEmail,
          },
        });

        return new Response(JSON.stringify(response.data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "modify": {
        const { messageId, addLabelIds, removeLabelIds } = params;

        if (!messageId) {
          throw new Error("messageId fehlt");
        }

        const response = await gmail.users.messages.modify({
          userId: "me",
          id: messageId,
          requestBody: {
            addLabelIds: addLabelIds || [],
            removeLabelIds: removeLabelIds || [],
          },
        });

        return new Response(JSON.stringify(response.data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error(`Unbekannte Action: ${action}`);
    }
  } catch (error) {
    console.error("Gmail API error:", error);
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

