import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseClient, getUserId } from "@/lib/automation/supabase-client";
import { Workflow } from "@/lib/automation/types";

// GET /api/automation/workflows - List all workflows for user
export async function GET() {
  try {
    const userId = await getUserId();
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflows: data || [] });
  } catch (error: any) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workflows' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/automation/workflows - Create new workflow
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const supabase = await getSupabaseClient();
    const body = await request.json();

    const { name, description, trigger, nodes, edges, enabled } = body;

    if (!name || !trigger || !nodes || !edges) {
      return NextResponse.json(
        { error: 'Missing required fields: name, trigger, nodes, edges' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        name,
        description,
        trigger,
        nodes,
        edges,
        enabled: enabled || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflow: data });
  } catch (error: any) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

