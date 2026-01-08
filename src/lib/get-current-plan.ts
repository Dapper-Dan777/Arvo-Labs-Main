import type { User, Organization } from "@clerk/nextjs/server";
import {
  mapClerkPlanToRoute,
  getAccountTypeFromClerkPlan,
  isValidClerkPlan,
  type ClerkBillingPlan,
} from "@/lib/clerk-plan-mapping";

/**
 * Plan information extracted from User or Organization
 */
export interface CurrentPlanInfo {
  plan: ClerkBillingPlan;
  routePlan: string; // Plan name for routing (e.g., "starter", "pro", "enterprise")
  isTeam: boolean;
  accountType: "user" | "team";
  orgName?: string;
  orgId?: string;
}

/**
 * Gets the current plan from Organization (priority) or User metadata
 * 
 * Priority:
 * 1. Organization publicMetadata.plan (if user is in an organization)
 * 2. User publicMetadata.plan
 * 3. null if no plan found
 * 
 * @param user - Clerk User object
 * @param organization - Clerk Organization object (optional, current active organization)
 * @returns CurrentPlanInfo or null if no plan found
 */
export function getCurrentPlan(
  user: User | null,
  organization: Organization | null | undefined
): CurrentPlanInfo | null {
  if (!user) {
    return null;
  }

  // Priority 1: Check Organization metadata first
  if (organization) {
    const orgPlan = organization.publicMetadata?.plan as string | undefined;
    const orgIsTeam = (organization.publicMetadata?.isTeam as boolean) ?? true; // Default to team for organizations
    
    // If plan is set, validate and use it
    if (orgPlan) {
      // Normalize plan: if it's a simple plan name (e.g., "enterprise") in an organization, treat it as team plan
      let normalizedPlan: ClerkBillingPlan;
      
      if (isValidClerkPlan(orgPlan)) {
        normalizedPlan = orgPlan;
      } else {
        // If plan is not in valid format but is a known plan name, normalize it
        // For organizations, assume team plan if not explicitly user plan
        const planLower = orgPlan.toLowerCase();
        if (planLower === "enterprise" || planLower === "pro" || planLower === "starter") {
          // Convert to team plan format
          normalizedPlan = `team_${planLower}` as ClerkBillingPlan;
        } else {
          // Fallback to team_starter
          normalizedPlan = "team_starter";
        }
      }
      
      const routePlan = mapClerkPlanToRoute(normalizedPlan);
      
      return {
        plan: normalizedPlan,
        routePlan,
        isTeam: true,
        accountType: "team",
        orgName: organization.name,
        orgId: organization.id,
      };
    }
  }

  // Priority 2: Check User metadata
  const userPlan = user.publicMetadata?.plan as ClerkBillingPlan | undefined;
  
  if (userPlan && isValidClerkPlan(userPlan)) {
    const routePlan = mapClerkPlanToRoute(userPlan);
    const accountType = getAccountTypeFromClerkPlan(userPlan);
    const isTeam = (user.publicMetadata?.isTeam as boolean) ?? false;
    
    return {
      plan: userPlan,
      routePlan,
      isTeam,
      accountType: isTeam ? "team" : accountType,
    };
  }

  // No plan found
  return null;
}

/**
 * Gets the dashboard path for the current plan
 * 
 * @param planInfo - CurrentPlanInfo from getCurrentPlan()
 * @returns Dashboard path (e.g., "/dashboard/team/pro" or "/dashboard/user/starter")
 */
export function getDashboardPath(planInfo: CurrentPlanInfo | null): string {
  if (!planInfo) {
    return "/preise";
  }

  const accountTypePath = planInfo.accountType;
  return `/dashboard/${accountTypePath}/${planInfo.routePlan}`;
}

/**
 * Formats plan name for display
 * 
 * @param planInfo - CurrentPlanInfo from getCurrentPlan()
 * @returns Formatted string like "Enterprise (Team)" or "Pro (Personal)"
 */
export function formatPlanDisplay(planInfo: CurrentPlanInfo | null): string {
  if (!planInfo) {
    return "No Plan";
  }

  const planName = planInfo.routePlan.charAt(0).toUpperCase() + planInfo.routePlan.slice(1);
  const accountType = planInfo.isTeam ? "Team" : "Personal";
  
  return `${planName} (${accountType})`;
}

