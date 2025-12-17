/**
 * Alternative: Standalone Node.js Webhook Server für lokale Entwicklung
 * 
 * Diese Datei kann als separater Server für lokale Webhook-Tests verwendet werden.
 * 
 * Installation:
 * npm install express svix @clerk/clerk-sdk-node
 * 
 * Starten:
 * node api/clerk/webhook-nodejs.js
 * 
 * Dann ngrok verwenden:
 * ngrok http 3001
 */

const express = require('express');
const { Webhook } = require('svix');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Plan-Mapping (MUSS mit deinen Clerk Plan IDs übereinstimmen)
const PLAN_MAPPING = {
  // Individual Plans
  'cplan_36wBO5cFvWQO0wk0scQFdkxTKIA': 'starter',
  'cplan_36wBaMbKGVXAr0axyDtzrL9IpL0': 'pro',
  'cplan_36wBjAYcrxMq3hFreVm5Lil4jSu': 'enterprise',
  // Team Plans
  'cplan_36wCRSd1BPN9poL5zFMdmSmkoa6': 'starter',
  'cplan_36wCbGG0jTzcaiOTDS07ECBTkxj': 'pro',
  'cplan_36wCgfLxZnWXgz93DYBXExx36O8': 'enterprise',
};

app.post('/webhook', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Get headers
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  // Get body
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Verification failed' });
  }

  const eventType = evt.type;
  const { id, ...data } = evt.data;

  console.log(`Webhook received: ${eventType}`);

  // Event: Neuer User erstellt
  if (eventType === 'user.created') {
    try {
      console.log(`Setting default plan 'starter' for new user: ${id}`);
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          plan: 'starter',
        },
      });
      console.log(`Successfully set default plan for user ${id}`);
    } catch (error) {
      console.error(`Error setting default plan for user ${id}:`, error);
      return res.status(500).json({ error: 'Error processing user.created' });
    }
  }

  // Event: Checkout abgeschlossen
  if (eventType === 'checkout.session.completed') {
    try {
      const userId = data.userId || data.user_id;
      const planId = data.planId || data.plan_id;

      if (!userId || !planId) {
        console.error('Missing userId or planId in checkout.session.completed');
        return res.status(400).json({ error: 'Missing required data' });
      }

      const plan = PLAN_MAPPING[planId] || 'starter';

      console.log(`User ${userId} purchased plan: ${planId} (${plan})`);

      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan,
        },
      });

      console.log(`Successfully updated plan for user ${userId} to ${plan}`);
    } catch (error) {
      console.error('Error processing checkout.session.completed:', error);
      return res.status(500).json({ error: 'Error processing checkout' });
    }
  }

  // Event: Organization erstellt
  if (eventType === 'organization.created') {
    try {
      console.log(`New organization created: ${id}`);
    } catch (error) {
      console.error('Error processing organization.created:', error);
    }
  }

  res.status(200).json({ message: 'Webhook processed successfully' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Clerk Webhook Server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`💡 Use ngrok to expose: ngrok http ${PORT}`);
});

