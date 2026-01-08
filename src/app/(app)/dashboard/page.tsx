import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  mapClerkPlanToRoute,
  getAccountTypeFromClerkPlan,
  isValidClerkPlan,
  type ClerkBillingPlan,
} from "@/lib/clerk-plan-mapping";
import { getCurrentPlan, getDashboardPath } from "@/lib/get-current-plan";

/**
 * Dashboard entry point - redirects to the correct dashboard based on plan and accountType
 * 
 * Priority:
 * 1. Organization publicMetadata.plan (if user is in an organization)
 * 2. User publicMetadata.plan
 * 
 * Redirects to:
 * - /dashboard/user/{plan} for user accounts
 * - /dashboard/team/{plan} for team accounts
 * 
 * Supports Clerk Billing plan names:
 * - User: free_user, starter, pro, enterprise, individual
 * - Team: free_org, team_starter, team_pro, team_enterprise
 * 
 * If plan is not set, redirects to /preise
 * 
 * For team accounts, also checks if user is in an organization.
 * If not, redirects to /dashboard/team/create
 */
export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user's organizations
  let activeOrganization = null;
  try {
    const client = await clerkClient();
    const userOrgs = await client.users.getOrganizationMembershipList({
      userId: user.id,
    });

    // Get the first organization (or most recent one)
    // In the future, you might want to track the "active" organization
    if (userOrgs && userOrgs.data && userOrgs.data.length > 0) {
      const firstOrg = userOrgs.data[0];
      // Fetch full organization details to get metadata
      try {
        activeOrganization = await client.organizations.getOrganization({
          organizationId: firstOrg.organization.id,
        });
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    }
  } catch (error) {
    console.error("Error checking organization membership:", error);
  }

  // Get current plan (prioritizes Organization over User)
  const planInfo = getCurrentPlan(user, activeOrganization || undefined);

  // If no plan found, redirect to pricing
  if (!planInfo) {
    redirect("/preise");
  }

  // For team accounts, check if user is in an organization
  if (planInfo.isTeam && !activeOrganization) {
    redirect("/dashboard/team/create");
  }

  // Get dashboard path and redirect
  const dashboardPath = getDashboardPath(planInfo);
  redirect(dashboardPath);
}
