import { NextResponse } from "next/server";
import { getSupabaseClient, getUserId } from "@/lib/automation/supabase-client";

// GET /api/automation/executions - Get execution history
export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const workflowId = searchParams.get('workflow_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('workflow_executions')
      .select(`
        *,
        workflows!inner(user_id)
      `)
      .eq('workflows.user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (workflowId) {
      query = query.eq('workflow_id', workflowId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ executions: data || [] });
  } catch (error: any) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch executions' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

