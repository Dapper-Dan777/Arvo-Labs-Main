/**
 * Gmail Service Implementation
 * 
 * Erweitert den bestehenden GmailService mit echter OAuth-Integration
 */

import { Integration } from "@/contexts/IntegrationContext";
import { WorkflowNode } from "@/contexts/WorkflowContext";
import { IntegrationService } from "./index";
import {
  fetchEmails,
  sendEmail,
  fetchEmail,
  markAsRead,
  markAsUnread,
  addLabels,
  removeLabels,
} from "@/lib/gmail/api";
import { isGmailConnected } from "@/lib/gmail/oauth";

export class GmailService implements IntegrationService {
  name = "Gmail";

  async executeTrigger(node: WorkflowNode, integration: Integration): Promise<any> {
    // Prüfe ob Gmail verbunden ist
    const connected = await isGmailConnected();
    if (!connected) {
      throw new Error("Gmail ist nicht verbunden");
    }

    // Hole E-Mails basierend auf Node Config
    const { query, maxResults = 10 } = node.config || {};

    try {
      const response = await fetchEmails({
        q: query,
        maxResults,
      });

      // Konvertiere zu Workflow-Format
      if (response.messages && response.messages.length > 0) {
        // Hole Details der ersten E-Mail
        const firstMessage = response.messages[0];
        const emailDetails = await fetchEmail(firstMessage.id);

        return {
          id: emailDetails.id,
          threadId: emailDetails.threadId,
          from: this.getEmailHeader(emailDetails, "from"),
          to: this.getEmailHeader(emailDetails, "to"),
          subject: this.getEmailHeader(emailDetails, "subject"),
          body: this.decodeEmailBody(emailDetails),
          snippet: emailDetails.snippet,
          receivedAt: new Date(parseInt(emailDetails.internalDate)).toISOString(),
          labels: emailDetails.labelIds || [],
        };
      }

      return null;
    } catch (error) {
      console.error("Gmail trigger error:", error);
      throw error;
    }
  }

  async executeAction(node: WorkflowNode, integration: Integration, triggerData?: any): Promise<any> {
    // Prüfe ob Gmail verbunden ist
    const connected = await isGmailConnected();
    if (!connected) {
      throw new Error("Gmail ist nicht verbunden");
    }

    const { action, to, subject, body, htmlBody, cc, bcc, replyTo } = node.config || {};

    try {
      switch (action) {
        case "send":
          if (!to || !subject || (!body && !htmlBody)) {
            throw new Error("to, subject und body/htmlBody sind erforderlich");
          }

          const result = await sendEmail({
            to,
            subject,
            body: body || "",
            htmlBody,
            cc,
            bcc,
            replyTo,
          });

          return {
            success: true,
            messageId: result.id,
            threadId: result.threadId,
            sentAt: new Date().toISOString(),
          };

        case "mark_as_read":
          if (!triggerData?.id) {
            throw new Error("E-Mail ID fehlt");
          }
          await markAsRead(triggerData.id);
          return { success: true };

        case "mark_as_unread":
          if (!triggerData?.id) {
            throw new Error("E-Mail ID fehlt");
          }
          await markAsUnread(triggerData.id);
          return { success: true };

        case "add_label":
          if (!triggerData?.id || !node.config?.labelIds) {
            throw new Error("E-Mail ID und labelIds sind erforderlich");
          }
          await addLabels(triggerData.id, node.config.labelIds);
          return { success: true };

        case "remove_label":
          if (!triggerData?.id || !node.config?.labelIds) {
            throw new Error("E-Mail ID und labelIds sind erforderlich");
          }
          await removeLabels(triggerData.id, node.config.labelIds);
          return { success: true };

        default:
          throw new Error(`Unbekannte Action: ${action}`);
      }
    } catch (error) {
      console.error("Gmail action error:", error);
      throw error;
    }
  }

  async testConnection(integration: Integration): Promise<boolean> {
    return await isGmailConnected();
  }

  /**
   * Helper: Extrahiert E-Mail Header
   */
  private getEmailHeader(message: any, headerName: string): string {
    if (!message.payload?.headers) {
      return "";
    }

    const header = message.payload.headers.find(
      (h: any) => h.name.toLowerCase() === headerName.toLowerCase()
    );

    return header?.value || "";
  }

  /**
   * Helper: Dekodiert E-Mail Body
   */
  private decodeEmailBody(message: any): string {
    if (message.payload?.body?.data) {
      return atob(message.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    }

    // Suche in Parts
    if (message.payload?.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        }
        if (part.mimeType === "text/html" && part.body?.data) {
          return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        }
      }
    }

    return "";
  }
}

