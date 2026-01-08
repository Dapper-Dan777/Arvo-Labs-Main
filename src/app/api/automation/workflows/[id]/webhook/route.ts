import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/automation/supabase-client";
import { WorkflowExecutor } from "@/lib/automation/engine";
import { Workflow } from "@/lib/automation/types";

// POST /api/automation/workflows/[id]/webhook - Webhook trigger endpoint
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseClient();
    const body = await request.json();

    // Get workflow (webhook can be called without auth, but workflow must exist)
    const { data: workflowData, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('enabled', true)
      .single();

    if (workflowError || !workflowData) {
      return NextResponse.json(
        { error: 'Workflow not found or disabled' },
        { status: 404 }
      );
    }

    const workflow = workflowData as unknown as Workflow;

    // Verify webhook trigger type
    if (workflow.trigger.type !== 'webhook') {
      return NextResponse.json(
        { error: 'Workflow is not a webhook trigger' },
        { status: 400 }
      );
    }

    // Create execution record
    const triggerData = body;
    const executionId = crypto.randomUUID();
    const userId = workflow.user_id;

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

    // Execute workflow asynchronously
    const executor = new WorkflowExecutor(workflow, triggerData, userId, executionId);
    
    executor.execute().catch((error) => {
      console.error('Webhook workflow execution error:', error);
    });

    return NextResponse.json({
      success: true,
      execution_id: executionId,
      message: 'Webhook received and workflow execution started',
    });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

