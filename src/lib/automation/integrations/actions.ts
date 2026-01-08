import { Action } from './types';

export const ACTIONS: Action[] = [
  // ============================================
  // EMAIL & COMMUNICATION
  // ============================================
  {
    id: 'gmail-send-email',
    app: 'Gmail',
    name: 'Send Email',
    description: 'Send an email from your Gmail account',
    icon: 'Send',
    category: 'email',
    type: 'action',
    color: { from: 'red-500', to: 'pink-500' },
    fields: [
      { name: 'to', label: 'To', type: 'text', required: true, placeholder: '{{trigger.email}}' },
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Welcome!' },
      { name: 'body', label: 'Body', type: 'textarea', required: true, placeholder: 'Email content...' },
      { name: 'cc', label: 'CC', type: 'text', placeholder: 'Optional' },
      { name: 'bcc', label: 'BCC', type: 'text', placeholder: 'Optional' },
    ],
  },
  {
    id: 'gmail-create-draft',
    app: 'Gmail',
    name: 'Create Draft',
    description: 'Create a draft email',
    icon: 'FileEdit',
    category: 'email',
    type: 'action',
    color: { from: 'red-500', to: 'pink-500' },
    fields: [
      { name: 'to', label: 'To', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'body', label: 'Body', type: 'textarea', required: true },
    ],
  },
  {
    id: 'outlook-send-email',
    app: 'Outlook',
    name: 'Send Email',
    description: 'Send an email via Outlook',
    icon: 'Mail',
    category: 'email',
    type: 'action',
    color: { from: 'blue-600', to: 'blue-400' },
    fields: [
      { name: 'to', label: 'To', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'body', label: 'Body', type: 'textarea', required: true },
    ],
  },
  
  // ============================================
  // MESSAGING & CHAT
  // ============================================
  {
    id: 'slack-send-message',
    app: 'Slack',
    name: 'Send Channel Message',
    description: 'Post a message to a Slack channel',
    icon: 'MessageSquare',
    category: 'communication',
    type: 'action',
    color: { from: 'purple-500', to: 'pink-500' },
    fields: [
      { name: 'channel', label: 'Channel', type: 'text', required: true, placeholder: '#general' },
      { name: 'text', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message...' },
      { name: 'username', label: 'Bot Username', type: 'text', placeholder: 'Optional' },
      { name: 'icon_emoji', label: 'Icon Emoji', type: 'text', placeholder: ':robot_face:' },
    ],
  },
  {
    id: 'slack-send-direct-message',
    app: 'Slack',
    name: 'Send Direct Message',
    description: 'Send a DM to a user',
    icon: 'MessageCircle',
    category: 'communication',
    type: 'action',
    color: { from: 'purple-500', to: 'pink-500' },
    fields: [
      { name: 'user', label: 'User', type: 'text', required: true },
      { name: 'text', label: 'Message', type: 'textarea', required: true },
    ],
  },
  {
    id: 'slack-update-message',
    app: 'Slack',
    name: 'Update Message',
    description: 'Update an existing message',
    icon: 'Edit',
    category: 'communication',
    type: 'action',
    color: { from: 'purple-500', to: 'pink-500' },
    fields: [
      { name: 'channel', label: 'Channel', type: 'text', required: true },
      { name: 'message_ts', label: 'Message Timestamp', type: 'text', required: true },
      { name: 'text', label: 'New Message', type: 'textarea', required: true },
    ],
  },
  {
    id: 'discord-send-message',
    app: 'Discord',
    name: 'Send Channel Message',
    description: 'Send message to Discord channel',
    icon: 'MessageSquare',
    category: 'communication',
    type: 'action',
    color: { from: 'indigo-500', to: 'purple-500' },
    fields: [
      { name: 'channel', label: 'Channel ID', type: 'text', required: true },
      { name: 'content', label: 'Message', type: 'textarea', required: true },
      { name: 'username', label: 'Username', type: 'text', placeholder: 'Optional' },
    ],
  },
  {
    id: 'teams-send-message',
    app: 'Microsoft Teams',
    name: 'Send Channel Message',
    description: 'Post message to Teams channel',
    icon: 'MessageSquare',
    category: 'communication',
    type: 'action',
    color: { from: 'blue-600', to: 'purple-600' },
    fields: [
      { name: 'team', label: 'Team', type: 'text', required: true },
      { name: 'channel', label: 'Channel', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
  
  // ============================================
  // CRM
  // ============================================
  {
    id: 'hubspot-create-contact',
    app: 'HubSpot',
    name: 'Create Contact',
    description: 'Create a new contact in HubSpot',
    icon: 'UserPlus',
    category: 'crm',
    type: 'action',
    color: { from: 'orange-500', to: 'red-500' },
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'firstname', label: 'First Name', type: 'text' },
      { name: 'lastname', label: 'Last Name', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
    ],
  },
  {
    id: 'hubspot-update-contact',
    app: 'HubSpot',
    name: 'Update Contact',
    description: 'Update an existing contact',
    icon: 'UserCog',
    category: 'crm',
    type: 'action',
    color: { from: 'orange-500', to: 'red-500' },
    fields: [
      { name: 'contact_id', label: 'Contact ID', type: 'text', required: true },
      { name: 'properties', label: 'Properties', type: 'json', required: true },
    ],
  },
  {
    id: 'hubspot-create-deal',
    app: 'HubSpot',
    name: 'Create Deal',
    description: 'Create a new deal',
    icon: 'Briefcase',
    category: 'crm',
    type: 'action',
    color: { from: 'orange-500', to: 'red-500' },
    fields: [
      { name: 'dealname', label: 'Deal Name', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'dealstage', label: 'Deal Stage', type: 'select', required: true, options: ['appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'closedwon', 'closedlost'] },
      { name: 'pipeline', label: 'Pipeline', type: 'select' },
    ],
  },
  {
    id: 'salesforce-create-record',
    app: 'Salesforce',
    name: 'Create Record',
    description: 'Create a new Salesforce record',
    icon: 'PlusCircle',
    category: 'crm',
    type: 'action',
    color: { from: 'blue-500', to: 'cyan-500' },
    fields: [
      { name: 'object', label: 'Object Type', type: 'select', required: true, options: ['Account', 'Contact', 'Lead', 'Opportunity', 'Case'] },
      { name: 'fields', label: 'Fields', type: 'json', required: true },
    ],
  },
  {
    id: 'salesforce-update-record',
    app: 'Salesforce',
    name: 'Update Record',
    description: 'Update existing record',
    icon: 'Edit',
    category: 'crm',
    type: 'action',
    color: { from: 'blue-500', to: 'cyan-500' },
    fields: [
      { name: 'record_id', label: 'Record ID', type: 'text', required: true },
      { name: 'object', label: 'Object Type', type: 'select', required: true },
      { name: 'fields', label: 'Fields', type: 'json', required: true },
    ],
  },
  {
    id: 'pipedrive-create-deal',
    app: 'Pipedrive',
    name: 'Create Deal',
    description: 'Create a new deal in Pipedrive',
    icon: 'TrendingUp',
    category: 'crm',
    type: 'action',
    color: { from: 'green-600', to: 'emerald-500' },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'value', label: 'Value', type: 'number' },
      { name: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY'] },
      { name: 'person_id', label: 'Person ID', type: 'text' },
    ],
  },
  
  // ============================================
  // PAYMENTS & BILLING
  // ============================================
  {
    id: 'stripe-create-customer',
    app: 'Stripe',
    name: 'Create Customer',
    description: 'Create a new Stripe customer',
    icon: 'UserPlus',
    category: 'payments',
    type: 'action',
    color: { from: 'indigo-600', to: 'purple-500' },
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true, placeholder: '{{trigger.email}}' },
      { name: 'name', label: 'Name', type: 'text', placeholder: '{{trigger.name}}' },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'metadata', label: 'Metadata', type: 'json' },
    ],
  },
  {
    id: 'stripe-create-subscription',
    app: 'Stripe',
    name: 'Create Subscription',
    description: 'Create a new subscription',
    icon: 'CreditCard',
    category: 'payments',
    type: 'action',
    color: { from: 'indigo-600', to: 'purple-500' },
    fields: [
      { name: 'customer', label: 'Customer ID', type: 'text', required: true, placeholder: '{{trigger.customer_id}}' },
      { name: 'price', label: 'Price ID', type: 'text', required: true, placeholder: '{{formatter.output}}' },
      { name: 'collection_method', label: 'Collection Method', type: 'select', options: ['charge_automatically', 'send_invoice'] },
    ],
  },
  {
    id: 'stripe-create-payment-intent',
    app: 'Stripe',
    name: 'Create Payment Intent',
    description: 'Create a payment intent',
    icon: 'DollarSign',
    category: 'payments',
    type: 'action',
    color: { from: 'indigo-600', to: 'purple-500' },
    fields: [
      { name: 'amount', label: 'Amount (cents)', type: 'number', required: true },
      { name: 'currency', label: 'Currency', type: 'select', required: true, options: ['usd', 'eur', 'gbp', 'jpy'] },
      { name: 'customer', label: 'Customer ID', type: 'text' },
    ],
  },
  {
    id: 'stripe-cancel-subscription',
    app: 'Stripe',
    name: 'Cancel Subscription',
    description: 'Cancel a subscription',
    icon: 'XCircle',
    category: 'payments',
    type: 'action',
    color: { from: 'indigo-600', to: 'purple-500' },
    fields: [
      { name: 'subscription_id', label: 'Subscription ID', type: 'text', required: true },
    ],
  },
  {
    id: 'paypal-create-invoice',
    app: 'PayPal',
    name: 'Create Invoice',
    description: 'Create a PayPal invoice',
    icon: 'FileText',
    category: 'payments',
    type: 'action',
    color: { from: 'blue-600', to: 'blue-400' },
    fields: [
      { name: 'recipient_email', label: 'Recipient Email', type: 'text', required: true },
      { name: 'items', label: 'Line Items', type: 'json', required: true },
      { name: 'amount', label: 'Total Amount', type: 'number', required: true },
    ],
  },
  
  // ============================================
  // E-COMMERCE
  // ============================================
  {
    id: 'shopify-create-order',
    app: 'Shopify',
    name: 'Create Order',
    description: 'Create a new order in Shopify',
    icon: 'ShoppingCart',
    category: 'ecommerce',
    type: 'action',
    color: { from: 'green-600', to: 'emerald-500' },
    fields: [
      { name: 'line_items', label: 'Line Items', type: 'json', required: true },
      { name: 'customer', label: 'Customer', type: 'json' },
      { name: 'financial_status', label: 'Financial Status', type: 'select', options: ['pending', 'authorized', 'paid', 'refunded'] },
    ],
  },
  {
    id: 'shopify-update-inventory',
    app: 'Shopify',
    name: 'Update Inventory',
    description: 'Update product inventory',
    icon: 'Package',
    category: 'ecommerce',
    type: 'action',
    color: { from: 'green-600', to: 'emerald-500' },
    fields: [
      { name: 'inventory_item_id', label: 'Inventory Item ID', type: 'text', required: true },
      { name: 'available', label: 'Available Quantity', type: 'number', required: true },
    ],
  },
  {
    id: 'woocommerce-create-order',
    app: 'WooCommerce',
    name: 'Create Order',
    description: 'Create a new WooCommerce order',
    icon: 'Package',
    category: 'ecommerce',
    type: 'action',
    color: { from: 'purple-600', to: 'pink-500' },
    fields: [
      { name: 'line_items', label: 'Line Items', type: 'json', required: true },
      { name: 'billing', label: 'Billing Address', type: 'json' },
      { name: 'shipping', label: 'Shipping Address', type: 'json' },
    ],
  },
  
  // ============================================
  // DATABASE & STORAGE
  // ============================================
  {
    id: 'supabase-insert',
    app: 'Supabase',
    name: 'Insert Row',
    description: 'Insert a new row into a table',
    icon: 'Database',
    category: 'database',
    type: 'action',
    color: { from: 'green-600', to: 'emerald-500' },
    fields: [
      { name: 'table', label: 'Table Name', type: 'text', required: true },
      { name: 'data', label: 'Data', type: 'json', required: true },
    ],
  },
  {
    id: 'supabase-update',
    app: 'Supabase',
    name: 'Update Row',
    description: 'Update an existing row',
    icon: 'Edit',
    category: 'database',
    type: 'action',
    color: { from: 'green-600', to: 'emerald-500' },
    fields: [
      { name: 'table', label: 'Table Name', type: 'text', required: true },
      { name: 'id', label: 'Row ID', type: 'text', required: true },
      { name: 'data', label: 'Update Data', type: 'json', required: true },
    ],
  },
  {
    id: 'google-drive-upload-file',
    app: 'Google Drive',
    name: 'Upload File',
    description: 'Upload a file to Google Drive',
    icon: 'FileUp',
    category: 'storage',
    type: 'action',
    color: { from: 'yellow-500', to: 'green-500' },
    fields: [
      { name: 'file_name', label: 'File Name', type: 'text', required: true },
      { name: 'file_content', label: 'File Content', type: 'textarea', required: true },
      { name: 'folder_id', label: 'Folder ID', type: 'text' },
    ],
  },
  
  // ============================================
  // WEBHOOKS
  // ============================================
  {
    id: 'webhook-post',
    app: 'Webhooks',
    name: 'POST Request',
    description: 'Send a POST request to a webhook URL',
    icon: 'Zap',
    category: 'webhooks',
    type: 'action',
    color: { from: 'yellow-500', to: 'orange-500' },
    fields: [
      { name: 'url', label: 'Webhook URL', type: 'text', required: true },
      { name: 'method', label: 'Method', type: 'select', required: true, options: ['POST', 'PUT', 'PATCH'] },
      { name: 'body', label: 'Body', type: 'json', required: true },
      { name: 'headers', label: 'Headers', type: 'json' },
    ],
  },
  {
    id: 'resend-send-email',
    app: 'Resend',
    name: 'Send Email',
    description: 'Send an email via Resend',
    icon: 'Mail',
    category: 'email',
    type: 'action',
    color: { from: 'blue-500', to: 'cyan-500' },
    fields: [
      { name: 'to', label: 'To', type: 'text', required: true, placeholder: '{{trigger.email}}' },
      { name: 'from', label: 'From', type: 'text', required: true, placeholder: 'noreply@example.com' },
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Welcome!' },
      { name: 'html', label: 'HTML Body', type: 'textarea', required: true, placeholder: '<p>Email content...</p>' },
    ],
  },
  
  // ============================================
  // SCHEDULING
  // ============================================
  {
    id: 'google-calendar-create-event',
    app: 'Google Calendar',
    name: 'Create Event',
    description: 'Create a new calendar event',
    icon: 'Calendar',
    category: 'calendar',
    type: 'action',
    color: { from: 'blue-500', to: 'cyan-500' },
    fields: [
      { name: 'summary', label: 'Event Title', type: 'text', required: true },
      { name: 'start', label: 'Start Time', type: 'date', required: true },
      { name: 'end', label: 'End Time', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'attendees', label: 'Attendees (comma-separated)', type: 'text' },
    ],
  },
];

