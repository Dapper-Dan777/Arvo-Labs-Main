import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  mapPlanToClerk,
  isValidClerkPlan,
  type AccountType,
  type ClerkBillingPlan,
} from "@/lib/clerk-plan-mapping";

/**
 * API Route to create a Clerk Organization for team plans
 * 
 * Usage: POST /api/clerk/create-team-org
 * Body: { 
 *   plan: "starter" | "pro" | "enterprise" | "individual" | "free" (UI plan name),
 *   accountType: "team",
 *   organizationName?: string (optional, defaults to user-based name)
 * }
 * 
 * This route:
 * 1. Creates a Clerk Organization
 * 2. Adds the current user as org:admin
 * 3. Sets organization publicMetadata (plan, isTeam, accountType)
 * 4. Returns organizationId and organizationName
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current user (must be authenticated)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { plan, accountType, organizationName } = body;

    // Validate accountType
    if (accountType !== "team") {
      return NextResponse.json(
        { error: "Invalid accountType. Must be 'team' for organization creation" },
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

    // Get user info for default organization name
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const defaultOrgName = organizationName || `${user.firstName || user.emailAddresses[0]?.emailAddress || "Team"}'s Team`;

    // Check if user already has an organization with this plan
    const userOrgs = await client.users.getOrganizationMembershipList({ userId });
    
    if (userOrgs && userOrgs.data && userOrgs.data.length > 0) {
      // Check if any existing organization has the same plan
      for (const membership of userOrgs.data) {
        const orgMetadata = membership.organization.publicMetadata as {
          plan?: string;
          isTeam?: boolean;
          accountType?: string;
        };
        
        // Check if this organization has the same plan
        if (orgMetadata?.plan === clerkPlan && orgMetadata?.isTeam === true) {
          return NextResponse.json(
            {
              error: "Du hast bereits eine Organization für diesen Plan",
              errorCode: "ORGANIZATION_ALREADY_EXISTS",
              organizationId: membership.organization.id,
              organizationName: membership.organization.name,
            },
            { status: 409 } // 409 Conflict
          );
        }
      }
      
      // User has organizations but none with this plan
      // Allow creation of new organization with different plan
    }

    // Create Organization
    const organization = await client.organizations.createOrganization({
      name: defaultOrgName,
      createdBy: userId,
      publicMetadata: {
        plan: clerkPlan,
        isTeam: true,
        accountType: "team",
        createdAt: new Date().toISOString(),
      },
    });

    // Ensure user is admin (should be automatic, but we make sure)
    // Note: The user who creates the org is automatically admin, but we verify
    const membership = await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

    // If user is not admin, update membership (shouldn't happen, but safety check)
    const userMembership = membership?.find((m) => m.publicUserData?.userId === userId);
    if (userMembership && userMembership.role !== "org:admin") {
      await client.organizations.updateOrganizationMembership({
        organizationId: organization.id,
        userId: userId,
        role: "org:admin",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Organization created successfully",
      organizationId: organization.id,
      organizationName: organization.name,
      plan: clerkPlan,
      uiPlan: plan,
      alreadyExisted: false,
    });
  } catch (error: any) {
    console.error("Error creating organization:", error);
    
    // Handle specific Clerk errors
    if (error?.errors?.[0]?.message) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create organization", details: error.message },
      { status: 500 }
    );
  }
}

