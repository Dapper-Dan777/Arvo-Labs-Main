import Stripe from 'stripe';
import { IntegrationAdapter, ExecutionContext, STRIPE_PRICE_IDS } from '../types';

export class StripeAdapter implements IntegrationAdapter {
  name = 'stripe';

  private getStripeClient(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async execute(action: string, config: any, context: ExecutionContext): Promise<any> {
    const stripe = this.getStripeClient();

    switch (action) {
      case 'find_customer_by_email':
        return await this.findCustomerByEmail(stripe, config.email);

      case 'create_customer':
        return await this.createCustomer(stripe, config);

      case 'create_subscription':
        return await this.createSubscription(stripe, config);

      case 'create_invoice':
        return await this.createInvoice(stripe, config);

      default:
        throw new Error(`Unknown Stripe action: ${action}`);
    }
  }

  validate(config: any): boolean {
    // Basic validation
    return true;
  }

  private async findCustomerByEmail(stripe: Stripe, email: string): Promise<Stripe.Customer | null> {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  }

  private async createCustomer(stripe: Stripe, config: any): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email: config.email,
      name: config.name,
      metadata: config.metadata || {},
    });
  }

  private async createSubscription(stripe: Stripe, config: any): Promise<Stripe.Subscription> {
    const customerId = config.customer_id;
    const plan = config.plan as keyof typeof STRIPE_PRICE_IDS;
    const priceId = STRIPE_PRICE_IDS[plan];

    if (!priceId) {
      throw new Error(`Unknown plan: ${plan}`);
    }

    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: config.metadata || {},
    });
  }

  private async createInvoice(stripe: Stripe, config: any): Promise<Stripe.Invoice> {
    return await stripe.invoices.create({
      customer: config.customer_id,
      auto_advance: true,
    });
  }
}

