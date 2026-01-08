/**
 * Customer Onboarding Workflow Template
 * 
 * This template creates a complete workflow for onboarding new customers:
 * 1. Webhook Trigger (receives customer data)
 * 2. Format Name (split firstname/lastname)
 * 3. Find or Create Stripe Customer
 * 4. Create Stripe Subscription
 * 5. Create HubSpot Contact
 * 6. Send Welcome Email
 * 7. Notify Slack
 * 8. Log to Database
 */

import { Workflow, WorkflowNode, WorkflowEdge, TriggerConfig } from '../types';

export function createCustomerOnboardingTemplate(userId: string): Workflow {
  const nodes: WorkflowNode[] = [
    // Step 1: Webhook Trigger
    {
      id: 'trigger_1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Webhook by Zapier',
        integration: 'webhook',
        action: 'catch_hook',
        config: {},
        stepNumber: 1,
        isConfigured: true,
      },
    },
    // Step 2: Format Name (Formatter)
    {
      id: 'action_2',
      type: 'transform',
      position: { x: 300, y: 100 },
      data: {
        label: 'Format Name',
        integration: 'formatter',
        action: 'split_text',
        config: {
          text: '{{trigger.name}}',
          delimiter: ' ',
        },
        stepNumber: 2,
        isConfigured: true,
      },
    },
    // Step 3: Find Stripe Customer
    {
      id: 'action_3',
      type: 'action',
      position: { x: 500, y: 100 },
      data: {
        label: 'Find Stripe Customer',
        integration: 'stripe',
        action: 'find_customer_by_email',
        config: {
          email: '{{trigger.email}}',
        },
        stepNumber: 3,
        isConfigured: true,
      },
    },
    // Step 4: Path by Zapier (Customer exists or not)
    {
      id: 'path_4',
      type: 'path',
      position: { x: 700, y: 100 },
      data: {
        label: 'Path by Zapier',
        integration: 'path',
        action: 'path_a_path_b',
        config: {
          condition: '{{step_3.id}}',
          path_a_condition: 'exists',
          path_b_condition: 'not_exists',
        },
        stepNumber: 4,
        isConfigured: true,
      },
    },
    // Step 5a: Create Stripe Customer (if not exists)
    {
      id: 'action_5a',
      type: 'action',
      position: { x: 900, y: 50 },
      data: {
        label: 'Create Stripe Customer',
        integration: 'stripe',
        action: 'create_customer',
        config: {
          email: '{{trigger.email}}',
          name: '{{trigger.name}}',
          metadata: {
            user_id: '{{trigger.user_id}}',
            plan: '{{trigger.plan}}',
          },
        },
        stepNumber: 5,
        isConfigured: true,
      },
    },
    // Step 5b: Use Existing Customer (if exists)
    {
      id: 'action_5b',
      type: 'action',
      position: { x: 900, y: 150 },
      data: {
        label: 'Use Existing Customer',
        integration: 'formatter',
        action: 'format_text',
        config: {
          text: '{{step_3.id}}',
        },
        stepNumber: 5,
        isConfigured: true,
      },
    },
    // Step 6: Create Stripe Subscription
    {
      id: 'action_6',
      type: 'action',
      position: { x: 1100, y: 100 },
      data: {
        label: 'Create Subscription',
        integration: 'stripe',
        action: 'create_subscription',
        config: {
          customer_id: '{{step_5a.id}} || {{step_3.id}}',
          plan: '{{trigger.plan}}',
          metadata: {
            user_id: '{{trigger.user_id}}',
          },
        },
        stepNumber: 6,
        isConfigured: true,
      },
    },
    // Step 7: Create HubSpot Contact
    {
      id: 'action_7',
      type: 'action',
      position: { x: 1300, y: 100 },
      data: {
        label: 'Create HubSpot Contact',
        integration: 'hubspot',
        action: 'create_contact',
        config: {
          email: '{{trigger.email}}',
          firstname: '{{step_2.first}}',
          lastname: '{{step_2.last}}',
          plan: '{{trigger.plan}}',
        },
        stepNumber: 7,
        isConfigured: true,
      },
    },
    // Step 8: Send Welcome Email
    {
      id: 'action_8',
      type: 'action',
      position: { x: 1500, y: 100 },
      data: {
        label: 'Send Welcome Email',
        integration: 'email',
        action: 'send_email',
        config: {
          to: '{{trigger.email}}',
          subject: 'Willkommen bei Arvo Labs!',
          html: `
            <h1>Willkommen bei Arvo Labs!</h1>
            <p>Hallo {{step_2.first}},</p>
            <p>Vielen Dank für deine Anmeldung. Dein Plan: {{trigger.plan}}</p>
            <p>Deine Subscription ID: {{step_6.id}}</p>
          `,
        },
        stepNumber: 8,
        isConfigured: true,
      },
    },
    // Step 9: Notify Slack
    {
      id: 'action_9',
      type: 'action',
      position: { x: 1700, y: 100 },
      data: {
        label: 'Notify Slack',
        integration: 'slack',
        action: 'send_message',
        config: {
          webhook_url: '{{slack_webhook_url}}',
          text: `🎉 Neuer Kunde: {{trigger.email}} (Plan: {{trigger.plan}})`,
          channel: '#onboarding',
        },
        stepNumber: 9,
        isConfigured: true,
      },
    },
    // Step 10: Log to Database
    {
      id: 'action_10',
      type: 'action',
      position: { x: 1900, y: 100 },
      data: {
        label: 'Log Onboarding',
        integration: 'database',
        action: 'create_onboarding_log',
        config: {
          email: '{{trigger.email}}',
          plan: '{{trigger.plan}}',
          status: 'success',
          stripe_subscription_id: '{{step_6.id}}',
          stripe_customer_id: '{{step_5a.id}} || {{step_3.id}}',
          hubspot_contact_id: '{{step_7.id}}',
        },
        stepNumber: 10,
        isConfigured: true,
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    { id: 'e1', source: 'trigger_1', target: 'action_2' },
    { id: 'e2', source: 'action_2', target: 'action_3' },
    { id: 'e3', source: 'action_3', target: 'path_4' },
    { id: 'e4', source: 'path_4', target: 'action_5a', sourceHandle: 'false' }, // Path B: Customer doesn't exist
    { id: 'e5', source: 'path_4', target: 'action_5b', sourceHandle: 'true' }, // Path A: Customer exists
    { id: 'e6', source: 'action_5a', target: 'action_6' },
    { id: 'e7', source: 'action_5b', target: 'action_6' },
    { id: 'e8', source: 'action_6', target: 'action_7' },
    { id: 'e9', source: 'action_7', target: 'action_8' },
    { id: 'e10', source: 'action_8', target: 'action_9' },
    { id: 'e11', source: 'action_9', target: 'action_10' },
  ];

  const trigger: TriggerConfig = {
    type: 'webhook',
    config: {
      url: `/api/automation/workflows/{workflow_id}/webhook`,
    },
  };

  return {
    id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    name: 'Customer Onboarding',
    description: 'Automatisiertes Onboarding für neue Kunden: Stripe, HubSpot, Email, Slack',
    trigger,
    nodes,
    edges,
    enabled: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

