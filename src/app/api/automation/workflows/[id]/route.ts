import { NextResponse } from "next/server";
import { getSupabaseClient, getUserId } from "@/lib/automation/supabase-client";

// GET /api/automation/workflows/[id] - Get single workflow
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ workflow: data });
  } catch (error: any) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PUT /api/automation/workflows/[id] - Update workflow
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const supabase = await getSupabaseClient();
    const body = await request.json();

    const { name, description, trigger, nodes, edges, enabled } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (trigger !== undefined) updateData.trigger = trigger;
    if (nodes !== undefined) updateData.nodes = nodes;
    if (edges !== undefined) updateData.edges = edges;
    if (enabled !== undefined) updateData.enabled = enabled;

    const { data, error } = await supabase
      .from('workflows')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflow: data });
  } catch (error: any) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE /api/automation/workflows/[id] - Delete workflow
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

