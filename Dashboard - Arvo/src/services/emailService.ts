/**
 * E-Mail-Service für Bestätigungs- und Update-Mails
 * 
 * HINWEIS: Dies ist eine Mock-Implementierung für die Entwicklung.
 * In Produktion sollte ein echter E-Mail-Service verwendet werden.
 */

interface EmailOptions {
  to: string;
  from?: string;
  fromName?: string;
  subject: string;
  html: string;
  text?: string;
}

interface VerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
  type: "email_verification" | "password_reset" | "email_update";
}

class EmailService {
  private fromEmail: string;
  private fromName: string;

  constructor() {
    // Lade Konfiguration aus Umgebungsvariablen
    this.fromEmail = import.meta.env.VITE_EMAIL_FROM || "info@arvo-labs.de";
    this.fromName = import.meta.env.VITE_EMAIL_FROM_NAME || "Arvo Dashboard";
  }

  /**
   * Sendet eine E-Mail (Mock-Implementierung)
   * In Produktion sollte ein echter E-Mail-Service verwendet werden.
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const fromEmail = options.from || this.fromEmail;
      const fromName = options.fromName || this.fromName;
      
      // Mock: Simuliere E-Mail-Versand
      console.log("📧 [EmailService] Mock E-Mail-Versand:", {
        from: `${fromName} <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
      });
      
      // In Entwicklung: Speichere E-Mails in localStorage für Demo
      const emails = JSON.parse(localStorage.getItem("sent_emails") || "[]");
      emails.push({
        from: `${fromName} <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        sentAt: new Date().toISOString(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });
      localStorage.setItem("sent_emails", JSON.stringify(emails.slice(-50))); // Max 50 E-Mails speichern

      return {
        success: true,
        messageId: `msg_${Date.now()}`,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      };
    }
  }

  /**
   * Sendet Bestätigungs-E-Mail bei Registrierung
   */
  async sendVerificationEmail(email: string, token: string, username: string): Promise<{ success: boolean; error?: string }> {
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Willkommen bei Arvo Dashboard!</h1>
            <p>Hallo ${username},</p>
            <p>vielen Dank für Ihre Registrierung. Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>
            <a href="${verificationUrl}" class="button">E-Mail bestätigen</a>
            <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>Dieser Link ist 24 Stunden gültig.</p>
            <p>Wenn Sie sich nicht registriert haben, ignorieren Sie diese E-Mail bitte.</p>
            <div class="footer">
              <p>Mit freundlichen Grüßen,<br>Ihr Arvo Dashboard Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      fromName: this.fromName,
      subject: "Bestätigen Sie Ihre E-Mail-Adresse - Arvo Dashboard",
      html,
      text: `Willkommen bei Arvo Dashboard!\n\nBitte bestätigen Sie Ihre E-Mail-Adresse: ${verificationUrl}\n\nDieser Link ist 24 Stunden gültig.`,
    });
  }

  /**
   * Sendet Update-E-Mail bei Profiländerungen
   */
  async sendProfileUpdateEmail(email: string, username: string, changes: string[]): Promise<{ success: boolean; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .changes { list-style: none; padding: 0; }
            .changes li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Profil aktualisiert</h1>
            <p>Hallo ${username},</p>
            <p>Ihr Profil wurde erfolgreich aktualisiert. Die folgenden Änderungen wurden vorgenommen:</p>
            <div class="alert">
              <ul class="changes">
                ${changes.map(change => `<li>• ${change}</li>`).join("")}
              </ul>
            </div>
            <p>Falls Sie diese Änderungen nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support.</p>
            <div class="footer">
              <p>Mit freundlichen Grüßen,<br>Ihr Arvo Dashboard Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      fromName: this.fromName,
      subject: "Profil aktualisiert - Arvo Dashboard",
      html,
      text: `Ihr Profil wurde aktualisiert:\n\n${changes.map(c => `• ${c}`).join("\n")}\n\nFalls Sie diese Änderungen nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support.`,
    });
  }

  /**
   * Sendet E-Mail bei Passwort-Änderung
   */
  async sendPasswordChangeEmail(email: string, username: string): Promise<{ success: boolean; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Passwort geändert</h1>
            <p>Hallo ${username},</p>
            <div class="alert">
              <p><strong>Wichtig:</strong> Ihr Passwort wurde soeben geändert.</p>
            </div>
            <p>Falls Sie diese Änderung nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support und ändern Sie Ihr Passwort.</p>
            <div class="footer">
              <p>Mit freundlichen Grüßen,<br>Ihr Arvo Dashboard Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      fromName: this.fromName,
      subject: "Passwort geändert - Arvo Dashboard",
      html,
      text: `Ihr Passwort wurde geändert. Falls Sie diese Änderung nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support.`,
    });
  }

  /**
   * Sendet 2FA-Einrichtungs-E-Mail
   */
  async send2FASetupEmail(email: string, username: string): Promise<{ success: boolean; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>2FA aktiviert</h1>
            <p>Hallo ${username},</p>
            <div class="alert">
              <p><strong>Bestätigung:</strong> Die Zwei-Faktor-Authentifizierung wurde für Ihr Konto aktiviert.</p>
            </div>
            <p>Von nun an benötigen Sie einen zusätzlichen Code von Ihrer Authenticator-App, um sich anzumelden.</p>
            <p>Falls Sie diese Aktivierung nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support.</p>
            <div class="footer">
              <p>Mit freundlichen Grüßen,<br>Ihr Arvo Dashboard Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      fromName: this.fromName,
      subject: "2FA aktiviert - Arvo Dashboard",
      html,
      text: `Die Zwei-Faktor-Authentifizierung wurde für Ihr Konto aktiviert. Falls Sie diese Aktivierung nicht vorgenommen haben, kontaktieren Sie bitte sofort den Support.`,
    });
  }
}

export const emailService = new EmailService();

