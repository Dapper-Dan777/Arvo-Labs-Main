import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TeamDashboardProvider } from "./_components/TeamDashboardProvider";
import { TeamDashboardLayoutClient } from "./_components/TeamDashboardLayoutClient";
import type { Plan } from "./config";
import { mapClerkPlanToRoute, type ClerkBillingPlan } from "@/lib/clerk-plan-mapping";
import { getCurrentPlan } from "@/lib/get-current-plan";

export default async function TeamDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user's organizations to check if this is a team account
  let activeOrganization = null;
  let isTeam = false;
  let hasOrganization = false;
  
  try {
    const client = await clerkClient();
    const userOrgs = await client.users.getOrganizationMembershipList({
      userId: user.id,
    });

    // Check if user has organizations
    if (userOrgs && userOrgs.data && userOrgs.data.length > 0) {
      hasOrganization = true;
      const firstOrg = userOrgs.data[0];
      try {
        activeOrganization = await client.organizations.getOrganization({
          organizationId: firstOrg.organization.id,
        });
        // If user is in an organization, it's a team account
        isTeam = true;
      } catch (error) {
        console.error("Error fetching organization details:", error);
        // Continue with fallback checks
      }
    }
  } catch (error) {
    console.error("Error checking organization membership:", error);
    // Continue with fallback checks
  }

  // Also check user metadata for isTeam (fallback)
  if (!isTeam) {
    isTeam = (user.publicMetadata?.isTeam as boolean) || false;
  }

  // Get current plan (prioritizes Organization over User)
  const planInfo = getCurrentPlan(user, activeOrganization || undefined);
  
  // Determine plan from planInfo or user metadata
  const routePlan = planInfo?.routePlan || (user.publicMetadata?.plan ? mapClerkPlanToRoute(user.publicMetadata.plan as ClerkBillingPlan) : "starter");
  
  // Validate plan - ensure it's a valid Plan type
  const validPlan: Plan =
    routePlan === "starter" ||
    routePlan === "pro" ||
    routePlan === "enterprise" ||
    routePlan === "individual"
      ? routePlan
      : "starter";

  // If not a team account, redirect to regular dashboard
  if (!isTeam && !planInfo?.isTeam) {
    redirect("/dashboard");
  }

  // If user has no organization, redirect to create page
  if (!hasOrganization) {
    redirect("/dashboard/team/create");
  }

  return (
    <TeamDashboardProvider plan={validPlan} accountType="team">
      <TeamDashboardLayoutClient plan={validPlan}>
        {children}
      </TeamDashboardLayoutClient>
    </TeamDashboardProvider>
  );
}

