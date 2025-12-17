/**
 * Clerk Webhook Handler für Vercel Serverless Functions
 * 
 * Diese Funktion verarbeitet Clerk Webhooks und setzt automatisch
 * die publicMetadata.plan für User basierend auf gekauften Plans.
 * 
 * Deployment: Wird automatisch als Vercel Serverless Function deployed
 * 
 * Dependencies:
 * npm install svix @clerk/clerk-sdk-node
 * 
 * ODER für Next.js Projekte:
 * npm install svix @clerk/nextjs
 */

import { Webhook } from 'svix';

// Plan-Mapping (MUSS mit deinen Clerk Plan IDs übereinstimmen)
const PLAN_MAPPING: Record<string, string> = {
  // Individual Plans
  'cplan_36wBO5cFvWQO0wk0scQFdkxTKIA': 'starter',
  'cplan_36wBaMbKGVXAr0axyDtzrL9IpL0': 'pro',
  'cplan_36wBjAYcrxMq3hFreVm5Lil4jSu': 'enterprise',
  // Team Plans
  'cplan_36wCRSd1BPN9poL5zFMdmSmkoa6': 'starter',
  'cplan_36wCbGG0jTzcaiOTDS07ECBTkxj': 'pro',
  'cplan_36wCgfLxZnWXgz93DYBXExx36O8': 'enterprise',
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get headers directly from request
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const eventType = evt.type;
  const { id, ...data } = evt.data;

  console.log(`Webhook received: ${eventType}`);

  // Import Clerk Client (Server-side)
  // Für Vercel: @clerk/nextjs/server
  // Alternative: @clerk/clerk-sdk-node (für Node.js Server)
  let clerkClient: any;
  try {
    const clerkModule = await import('@clerk/nextjs/server');
    clerkClient = clerkModule.clerkClient;
  } catch (error) {
    // Fallback für @clerk/clerk-sdk-node
    const clerkModule = await import('@clerk/clerk-sdk-node');
    clerkClient = clerkModule.clerkClient;
  }

  // Event: Neuer User erstellt
  if (eventType === 'user.created') {
    try {
      console.log(`Setting default plan 'starter' for new user: ${id}`);
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          plan: 'starter', // Default Plan für neue User
        },
      });
      console.log(`Successfully set default plan for user ${id}`);
    } catch (error) {
      console.error(`Error setting default plan for user ${id}:`, error);
      return new Response('Error processing user.created', { status: 500 });
    }
  }

  // Event: Checkout abgeschlossen (Plan gekauft)
  if (eventType === 'checkout.session.completed') {
    try {
      const userId = data.userId || data.user_id;
      const planId = data.planId || data.plan_id;

      if (!userId || !planId) {
        console.error('Missing userId or planId in checkout.session.completed');
        return new Response('Missing required data', { status: 400 });
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
      return new Response('Error processing checkout', { status: 500 });
    }
  }

  // Event: Organization erstellt
  if (eventType === 'organization.created') {
    try {
      console.log(`New organization created: ${id}`);
      // Optional: Zusätzliche Logik für neue Organizations
      // z.B. Metadata für die Organization setzen
    } catch (error) {
      console.error('Error processing organization.created:', error);
    }
  }

  // Event: Organization Membership erstellt
  if (eventType === 'organizationMembership.created') {
    try {
      const userId = data.publicUserData?.userId || data.user_id;
      const organizationId = data.organization?.id || data.organization_id;

      console.log(`User ${userId} joined organization ${organizationId}`);
      // Optional: Metadata aktualisieren wenn User zu Team wechselt
    } catch (error) {
      console.error('Error processing organizationMembership.created:', error);
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}

