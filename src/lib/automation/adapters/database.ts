import { getSupabaseClient } from '../supabase-client';
import { IntegrationAdapter, ExecutionContext } from '../types';

export class DatabaseAdapter implements IntegrationAdapter {
  name = 'database';

  async execute(action: string, config: any, context: ExecutionContext): Promise<any> {
    const supabase = await getSupabaseClient();

    switch (action) {
      case 'create_onboarding_log':
        return await this.createOnboardingLog(supabase, config, context);

      case 'update_onboarding_log':
        return await this.updateOnboardingLog(supabase, config);

      case 'query_onboarding_logs':
        return await this.queryOnboardingLogs(supabase, config);

      default:
        throw new Error(`Unknown Database action: ${action}`);
    }
  }

  validate(config: any): boolean {
    return true;
  }

  private async createOnboardingLog(supabase: any, config: any, context: ExecutionContext): Promise<any> {
    const { data, error } = await supabase
      .from('onboarding_logs')
      .insert({
        user_id: context.user_id,
        email: config.email,
        plan: config.plan,
        status: config.status || 'pending',
        stripe_subscription_id: config.stripe_subscription_id,
        stripe_customer_id: config.stripe_customer_id,
        hubspot_contact_id: config.hubspot_contact_id,
        error_step: config.error_step,
        error_message: config.error_message,
        metadata: config.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  private async updateOnboardingLog(supabase: any, config: any): Promise<any> {
    const { id, ...updateData } = config;
    
    const { data, error } = await supabase
      .from('onboarding_logs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }

  private async queryOnboardingLogs(supabase: any, config: any): Promise<any> {
    let query = supabase.from('onboarding_logs').select('*');

    if (config.email) {
      query = query.eq('email', config.email);
    }
    if (config.status) {
      query = query.eq('status', config.status);
    }
    if (config.plan) {
      query = query.eq('plan', config.plan);
    }
    if (config.limit) {
      query = query.limit(config.limit);
    }
    if (config.order_by) {
      query = query.order(config.order_by, { ascending: config.ascending !== false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  }
}

