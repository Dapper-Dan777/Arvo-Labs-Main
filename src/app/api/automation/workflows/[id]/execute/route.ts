import { NextResponse } from "next/server";
import { getSupabaseClient, getUserId } from "@/lib/automation/supabase-client";
import { WorkflowExecutor } from "@/lib/automation/engine";
import { Workflow } from "@/lib/automation/types";

// POST /api/automation/workflows/[id]/execute - Execute workflow manually
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const supabase = await getSupabaseClient();
    const body = await request.json();

    // Get workflow
    const { data: workflowData, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (workflowError || !workflowData) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const workflow = workflowData as unknown as Workflow;

    // Create execution record
    const triggerData = body.trigger_data || {};
    const executionId = crypto.randomUUID();

    const { data: executionData, error: executionError } = await supabase
      .from('workflow_executions')
      .insert({
        id: executionId,
        workflow_id: id,
        status: 'pending',
        trigger_data: triggerData,
        execution_log: [],
      })
      .select()
      .single();

    if (executionError) {
      throw executionError;
    }

    // Execute workflow
    const executor = new WorkflowExecutor(workflow, triggerData, userId, executionId);
    
    // Execute asynchronously (don't wait for completion)
    executor.execute().catch((error) => {
      console.error('Workflow execution error:', error);
    });

    return NextResponse.json({
      execution: executionData,
      message: 'Workflow execution started',
    });
  } catch (error: any) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

