/**
 * Gmail API Service
 * 
 * Diese Datei enthält Helper-Funktionen für Gmail API Calls.
 * Alle API Calls gehen über Supabase Edge Functions für Sicherheit.
 */

import { supabase } from "@/lib/supabaseClient";
import { getGmailIntegration, refreshGmailToken } from "./oauth";

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  sizeEstimate: number;
  payload?: {
    headers: Array<{ name: string; value: string }>;
    body?: {
      data?: string;
      size?: number;
    };
    parts?: Array<{
      mimeType: string;
      filename?: string;
      body?: {
        data?: string;
        size?: number;
      };
    }>;
  };
}

export interface GmailMessageListResponse {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  body: string;
  htmlBody?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded
    mimeType: string;
  }>;
}

export interface SendEmailResponse {
  id: string;
  threadId: string;
  labelIds: string[];
}

/**
 * Ruft Access Token ab und refresht falls nötig
 */
async function getValidAccessToken(): Promise<string> {
  const integration = await getGmailIntegration();
  if (!integration || !integration.access_token) {
    throw new Error('Gmail ist nicht verbunden');
  }

  // Prüfe ob Token abgelaufen ist
  if (integration.token_expires_at) {
    const expiresAt = new Date(integration.token_expires_at);
    const now = new Date();
    
    // Refresh wenn Token in weniger als 5 Minuten abläuft
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      await refreshGmailToken();
      const updatedIntegration = await getGmailIntegration();
      if (!updatedIntegration?.access_token) {
        throw new Error('Failed to refresh token');
      }
      return updatedIntegration.access_token;
    }
  }

  return integration.access_token;
}

/**
 * Ruft E-Mails ab
 */
export async function fetchEmails(params?: {
  maxResults?: number;
  pageToken?: string;
  q?: string; // Search query
  labelIds?: string[];
}): Promise<GmailMessageListResponse> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'list',
      access_token: accessToken,
      ...params,
    },
  });

  if (error) {
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }

  return data;
}

/**
 * Ruft eine einzelne E-Mail ab
 */
export async function fetchEmail(messageId: string): Promise<GmailMessage> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'get',
      access_token: accessToken,
      messageId,
    },
  });

  if (error) {
    throw new Error(`Failed to fetch email: ${error.message}`);
  }

  return data;
}

/**
 * Sendet eine E-Mail
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'send',
      access_token: accessToken,
      ...params,
    },
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

/**
 * Markiert E-Mail als gelesen
 */
export async function markAsRead(messageId: string): Promise<void> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'modify',
      access_token: accessToken,
      messageId,
      addLabelIds: [],
      removeLabelIds: ['UNREAD'],
    },
  });

  if (error) {
    throw new Error(`Failed to mark as read: ${error.message}`);
  }
}

/**
 * Markiert E-Mail als ungelesen
 */
export async function markAsUnread(messageId: string): Promise<void> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'modify',
      access_token: accessToken,
      messageId,
      addLabelIds: ['UNREAD'],
      removeLabelIds: [],
    },
  });

  if (error) {
    throw new Error(`Failed to mark as unread: ${error.message}`);
  }
}

/**
 * Fügt Labels zu E-Mail hinzu
 */
export async function addLabels(messageId: string, labelIds: string[]): Promise<void> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'modify',
      access_token: accessToken,
      messageId,
      addLabelIds: labelIds,
      removeLabelIds: [],
    },
  });

  if (error) {
    throw new Error(`Failed to add labels: ${error.message}`);
  }
}

/**
 * Entfernt Labels von E-Mail
 */
export async function removeLabels(messageId: string, labelIds: string[]): Promise<void> {
  const accessToken = await getValidAccessToken();

  const { data, error } = await supabase?.functions.invoke('gmail-api', {
    body: {
      action: 'modify',
      access_token: accessToken,
      messageId,
      addLabelIds: [],
      removeLabelIds: labelIds,
    },
  });

  if (error) {
    throw new Error(`Failed to remove labels: ${error.message}`);
  }
}

/**
 * Sucht E-Mails
 */
export async function searchEmails(query: string, maxResults: number = 10): Promise<GmailMessageListResponse> {
  return fetchEmails({ q: query, maxResults });
}

/**
 * Ruft E-Mail Headers ab (From, To, Subject, etc.)
 */
export function getEmailHeaders(message: GmailMessage): Record<string, string> {
  if (!message.payload?.headers) {
    return {};
  }

  const headers: Record<string, string> = {};
  for (const header of message.payload.headers) {
    headers[header.name.toLowerCase()] = header.value;
  }

  return headers;
}

/**
 * Dekodiert Base64 E-Mail Body
 */
export function decodeEmailBody(message: GmailMessage): string {
  if (message.payload?.body?.data) {
    return atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }

  // Suche in Parts
  if (message.payload?.parts) {
    for (const part of message.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (part.mimeType === 'text/html' && part.body?.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }
  }

  return '';
}

