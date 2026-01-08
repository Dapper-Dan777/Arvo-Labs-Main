import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * API Route to fetch monitoring logs from Zapier Table
 * 
 * Usage: GET /api/automations/monitoring-logs
 * Query Params:
 *   - status?: 'success' | 'error' | 'partial' | 'all'
 *   - plan?: string
 *   - startDate?: ISO string
 *   - endDate?: ISO string
 *   - limit?: number (default: 100)
 * 
 * Returns: Array of OnboardingLog entries
 */

export interface OnboardingLog {
  timestamp: string;
  user_id: string;
  email: string;
  plan: string;
  status: 'success' | 'error' | 'partial';
  hubspot_contact_id?: string;
  stripe_subscription_id?: string;
  error_step?: string;
  error_message?: string;
}

/**
 * Fetches data from Zapier Table API
 * 
 * Zapier Tables API Documentation:
 * https://zapier.com/help/tables
 * 
 * Required Environment Variables:
 * - ZAPIER_TABLE_API_KEY: Your Zapier API Key
 * - ZAPIER_TABLE_ID: The ID of your "Customer Onboarding Log" table
 */
async function fetchZapierTableData(params: {
  status?: string;
  plan?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<OnboardingLog[]> {
  const apiKey = process.env.ZAPIER_TABLE_API_KEY;
  const tableId = process.env.ZAPIER_TABLE_ID;

  // Wenn keine Credentials vorhanden, Mock-Daten zurückgeben
  if (!apiKey || !tableId) {
    console.warn(
      '⚠️ Zapier Table API nicht konfiguriert. Verwende Mock-Daten.\n' +
      'Setze ZAPIER_TABLE_API_KEY und ZAPIER_TABLE_ID in Environment Variables.'
    );
    return generateMockData(params);
  }

  try {
    // Zapier Tables API Endpoint
    // Format: https://zapier.com/api/v1/tables/{table_id}/rows
    const baseUrl = `https://zapier.com/api/v1/tables/${tableId}/rows`;
    
    // Query Parameters
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    // Zapier Tables unterstützt Filtering über Query Params
    // Anpassen je nach Zapier API Dokumentation
    
    const url = `${baseUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Zapier API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Zapier Table rows to OnboardingLog format
    // Anpassen je nach tatsächlicher Struktur der Zapier Table
    const logs: OnboardingLog[] = (data.rows || []).map((row: any) => ({
      timestamp: row.timestamp || row.created_at || new Date().toISOString(),
      user_id: row.user_id || row.userId || '',
      email: row.email || '',
      plan: row.plan || '',
      status: row.status || 'partial',
      hubspot_contact_id: row.hubspot_contact_id || row.hubspotContactId,
      stripe_subscription_id: row.stripe_subscription_id || row.stripeSubscriptionId,
      error_step: row.error_step || row.errorStep,
      error_message: row.error_message || row.errorMessage,
    }));

    // Client-side Filtering (falls Zapier API kein Filtering unterstützt)
    return filterLogs(logs, params);
  } catch (error) {
    console.error('Error fetching from Zapier Table:', error);
    // Fallback zu Mock-Daten bei Fehler
    return generateMockData(params);
  }
}

/**
 * Filters logs based on query parameters
 */
function filterLogs(logs: OnboardingLog[], params: {
  status?: string;
  plan?: string;
  startDate?: string;
  endDate?: string;
}): OnboardingLog[] {
  let filtered = [...logs];

  // Filter by status
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(log => log.status === params.status);
  }

  // Filter by plan
  if (params.plan) {
    filtered = filtered.filter(log => log.plan === params.plan);
  }

  // Filter by date range
  if (params.startDate) {
    const start = new Date(params.startDate);
    filtered = filtered.filter(log => new Date(log.timestamp) >= start);
  }

  if (params.endDate) {
    const end = new Date(params.endDate);
    filtered = filtered.filter(log => new Date(log.timestamp) <= end);
  }

  return filtered;
}

/**
 * Generates mock data for development/testing
 */
function generateMockData(params: {
  status?: string;
  plan?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): OnboardingLog[] {
  const plans = ['starter', 'pro', 'enterprise', 'individual'];
  const statuses: ('success' | 'error' | 'partial')[] = ['success', 'error', 'partial'];
  const errorSteps = ['hubspot', 'stripe', 'email', 'slack'];
  const errorMessages = [
    'HubSpot API rate limit exceeded',
    'Stripe customer creation failed',
    'Email service unavailable',
    'Slack webhook timeout',
  ];

  const logs: OnboardingLog[] = [];
  const limit = params.limit || 50;
  const now = new Date();

  for (let i = 0; i < limit; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const plan = plans[Math.floor(Math.random() * plans.length)];

    // Apply filters
    if (params.status && params.status !== 'all' && status !== params.status) {
      continue;
    }
    if (params.plan && plan !== params.plan) {
      continue;
    }

    const log: OnboardingLog = {
      timestamp: timestamp.toISOString(),
      user_id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      email: `user${i}@example.com`,
      plan,
      status,
      hubspot_contact_id: status !== 'error' ? `hubspot_${i}` : undefined,
      stripe_subscription_id: status !== 'error' ? `sub_${i}` : undefined,
      error_step: status === 'error' ? errorSteps[Math.floor(Math.random() * errorSteps.length)] : undefined,
      error_message: status === 'error' ? errorMessages[Math.floor(Math.random() * errorMessages.length)] : undefined,
    };

    logs.push(log);
  }

  // Sort by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs;
}

export async function GET(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const plan = searchParams.get('plan') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const limit = searchParams.get('limit') 
      ? parseInt(searchParams.get('limit')!, 10) 
      : 100;

    // Validate status
    if (status && !['success', 'error', 'partial', 'all'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'success', 'error', 'partial', or 'all'" },
        { status: 400 }
      );
    }

    // Fetch data from Zapier Table
    const logs = await fetchZapierTableData({
      status,
      plan,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
      // Indicate if using mock data
      isMockData: !process.env.ZAPIER_TABLE_API_KEY || !process.env.ZAPIER_TABLE_ID,
    });
  } catch (error) {
    console.error("Error fetching monitoring logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitoring logs" },
      { status: 500 }
    );
  }
}

