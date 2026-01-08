import { IntegrationAdapter } from '../types';
import { StripeAdapter } from './stripe';
import { EmailAdapter } from './email';
import { SlackAdapter } from './slack';
import { DatabaseAdapter } from './database';
import { FormatterAdapter } from './formatter';

const adapters: Record<string, IntegrationAdapter> = {
  stripe: new StripeAdapter(),
  email: new EmailAdapter(),
  slack: new SlackAdapter(),
  database: new DatabaseAdapter(),
  formatter: new FormatterAdapter(),
};

export function getAdapter(integration: string): IntegrationAdapter {
  const adapter = adapters[integration];
  if (!adapter) {
    throw new Error(`Unknown integration: ${integration}`);
  }
  return adapter;
}

export { StripeAdapter, EmailAdapter, SlackAdapter, DatabaseAdapter, FormatterAdapter };

