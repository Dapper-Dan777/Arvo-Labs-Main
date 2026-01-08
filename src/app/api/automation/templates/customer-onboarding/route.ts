import { NextResponse } from "next/server";
import { getUserId } from "@/lib/automation/supabase-client";
import { createCustomerOnboardingTemplate } from "@/lib/automation/templates/customer-onboarding";
import { getSupabaseClient } from "@/lib/automation/supabase-client";

// POST /api/automation/templates/customer-onboarding - Create workflow from template
export async function POST() {
  try {
    const userId = await getUserId();
    const supabase = await getSupabaseClient();

    // Create workflow from template
    const workflow = createCustomerOnboardingTemplate(userId);

    // Save to database
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        id: workflow.id,
        user_id: workflow.user_id,
        name: workflow.name,
        description: workflow.description,
        trigger: workflow.trigger,
        nodes: workflow.nodes,
        edges: workflow.edges,
        enabled: workflow.enabled,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      workflow: data,
      message: 'Customer Onboarding workflow created from template',
    });
  } catch (error: any) {
    console.error('Error creating template workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template workflow' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

