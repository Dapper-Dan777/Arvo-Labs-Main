import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  mapPlanToClerk,
  isValidClerkPlan,
  type AccountType,
  type ClerkBillingPlan,
} from "@/lib/clerk-plan-mapping";

/**
 * API Route to set plan and accountType in Clerk publicMetadata
 * Called after successful signup to persist the selected plan/accountType
 * 
 * Usage: POST /api/set-plan
 * Body: { plan: "starter" | "pro" | "enterprise" | "individual" | "free", accountType: "user" | "team" }
 * 
 * Maps UI plan names to Clerk Billing plan names before storing in publicMetadata
 */
export async function POST(request: Request) {
  try {
    // Get the current user (must be authenticated)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { plan, accountType } = body;

    // Validate accountType
    if (accountType !== "user" && accountType !== "team") {
      return NextResponse.json(
        { error: "Invalid accountType. Must be 'user' or 'team'" },
        { status: 400 }
      );
    }

    // Validate plan (UI plan names)
    const validUIPlans = ["starter", "pro", "enterprise", "individual", "free"];
    if (!plan || !validUIPlans.includes(plan)) {
      return NextResponse.json(
        {
          error: `Invalid plan. Must be one of: ${validUIPlans.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Map UI plan name to Clerk Billing plan name
    const clerkPlan = mapPlanToClerk(plan, accountType as AccountType);

    // Validate mapped Clerk plan
    if (!isValidClerkPlan(clerkPlan)) {
      return NextResponse.json(
        { error: "Failed to map plan to valid Clerk Billing plan" },
        { status: 500 }
      );
    }

    // Set publicMetadata using Clerk Client
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: clerkPlan,
        isTeam: accountType === "team",
        accountType: accountType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Plan and account type set successfully",
      uiPlan: plan,
      clerkPlan: clerkPlan,
      accountType,
    });
  } catch (error) {
    console.error("Error setting plan:", error);
    return NextResponse.json(
      { error: "Failed to set plan" },
      { status: 500 }
    );
  }
}
