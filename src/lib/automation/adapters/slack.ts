import { IntegrationAdapter, ExecutionContext } from '../types';

export class SlackAdapter implements IntegrationAdapter {
  name = 'slack';

  async execute(action: string, config: any, context: ExecutionContext): Promise<any> {
    switch (action) {
      case 'send_message':
        return await this.sendMessage(config);

      case 'send_to_channel':
        return await this.sendToChannel(config);

      case 'send_dm':
        return await this.sendDirectMessage(config);

      default:
        throw new Error(`Unknown Slack action: ${action}`);
    }
  }

  validate(config: any): boolean {
    if (!config.webhook_url && !config.token) {
      return false;
    }
    return true;
  }

  private async sendMessage(config: any): Promise<any> {
    const webhookUrl = config.webhook_url;
    if (!webhookUrl) {
      throw new Error('Slack webhook_url is required');
    }

    const payload = {
      text: config.text,
      blocks: config.blocks,
      attachments: config.attachments,
      channel: config.channel,
      username: config.username || 'Arvo Labs Automation',
      icon_emoji: config.icon_emoji || ':robot_face:',
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    return {
      status: 'sent',
      channel: config.channel,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendToChannel(config: any): Promise<any> {
    return await this.sendMessage({
      ...config,
      channel: config.channel || '#general',
    });
  }

  private async sendDirectMessage(config: any): Promise<any> {
    // For DMs, you'd typically use Slack Web API with OAuth token
    // For now, we'll use webhook (which posts to a channel)
    return await this.sendMessage(config);
  }
}

