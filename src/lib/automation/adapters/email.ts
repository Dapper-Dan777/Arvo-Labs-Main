import { Resend } from 'resend';
import { IntegrationAdapter, ExecutionContext } from '../types';

export class EmailAdapter implements IntegrationAdapter {
  name = 'email';

  private getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    return new Resend(apiKey);
  }

  async execute(action: string, config: any, context: ExecutionContext): Promise<any> {
    const resend = this.getResendClient();

    switch (action) {
      case 'send_email':
        return await this.sendEmail(resend, config);

      case 'send_template_email':
        return await this.sendTemplateEmail(resend, config);

      default:
        throw new Error(`Unknown Email action: ${action}`);
    }
  }

  validate(config: any): boolean {
    if (!config.to || !config.subject) {
      return false;
    }
    return true;
  }

  private async sendEmail(resend: Resend, config: any): Promise<any> {
    const result = await resend.emails.send({
      from: config.from || process.env.RESEND_FROM_EMAIL || 'onboarding@arvo-labs.de',
      to: config.to,
      subject: config.subject,
      html: config.html || config.text,
      text: config.text,
      cc: config.cc,
      bcc: config.bcc,
      reply_to: config.reply_to,
    });

    return {
      id: result.data?.id,
      from: config.from,
      to: config.to,
      subject: config.subject,
      status: 'sent',
    };
  }

  private async sendTemplateEmail(resend: Resend, config: any): Promise<any> {
    // For template-based emails (if using Resend templates)
    const result = await resend.emails.send({
      from: config.from || process.env.RESEND_FROM_EMAIL || 'onboarding@arvo-labs.de',
      to: config.to,
      subject: config.subject,
      template_id: config.template_id,
      template_data: config.template_data || {},
    });

    return {
      id: result.data?.id,
      template_id: config.template_id,
      to: config.to,
      status: 'sent',
    };
  }
}

