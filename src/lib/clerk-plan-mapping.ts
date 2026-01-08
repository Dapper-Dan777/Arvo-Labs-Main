/**
 * Clerk Billing Plan Mapping Utility
 * 
 * Maps between UI plan names and Clerk Billing plan names
 * 
 * Clerk Billing Plans:
 * - User: free_user, starter, pro, enterprise
 * - Team: free_org, team_starter, team_pro, team_enterprise
 * 
 * UI Plan Names:
 * - starter, pro, enterprise, individual, free
 */

export type ClerkBillingPlan =
  | "free_user"
  | "starter"
  | "pro"
  | "enterprise"
  | "individual"
  | "free_org"
  | "team_starter"
  | "team_pro"
  | "team_enterprise";

export type UIPlan = "starter" | "pro" | "enterprise" | "individual" | "free";
export type AccountType = "user" | "team";

/**
 * Maps UI plan name + account type to Clerk Billing plan name
 */
export function mapPlanToClerk(uiPlan: string, accountType: AccountType): ClerkBillingPlan {
  // Handle free plans
  if (uiPlan === "free" || uiPlan === "starter") {
    if (accountType === "user") {
      // Check if it's actually free or starter
      // For now, we'll treat "starter" as the free tier for users
      // If you have a separate "free" plan in UI, use "free_user"
      return uiPlan === "free" ? "free_user" : "starter";
    } else {
      return uiPlan === "free" ? "free_org" : "team_starter";
    }
  }

  // Map other plans
  if (accountType === "user") {
    switch (uiPlan) {
      case "pro":
        return "pro";
      case "enterprise":
        return "enterprise";
      case "individual":
        return "individual";
      default:
        return "starter"; // Fallback
    }
  } else {
    // Team plans
    switch (uiPlan) {
      case "pro":
        return "team_pro";
      case "enterprise":
        return "team_enterprise";
      case "individual":
        return "team_enterprise"; // Individual team plans might not exist, use enterprise as fallback
      default:
        return "team_starter"; // Fallback
    }
  }
}

/**
 * Maps Clerk Billing plan name to UI plan name
 */
export function mapClerkPlanToUI(clerkPlan: ClerkBillingPlan): UIPlan {
  switch (clerkPlan) {
    case "free_user":
    case "free_org":
      return "free";
    case "starter":
    case "team_starter":
      return "starter";
    case "pro":
    case "team_pro":
      return "pro";
    case "enterprise":
    case "team_enterprise":
      return "enterprise";
    case "individual":
      return "individual";
    default:
      return "starter"; // Fallback
  }
}

/**
 * Maps Clerk Billing plan name to dashboard route segment
 * Returns the plan name used in the URL (e.g., "starter", "pro", "free")
 */
export function mapClerkPlanToRoute(clerkPlan: ClerkBillingPlan): string {
  switch (clerkPlan) {
    case "free_user":
    case "free_org":
      return "free";
    case "starter":
    case "team_starter":
      return "starter";
    case "pro":
    case "team_pro":
      return "pro";
    case "enterprise":
    case "team_enterprise":
      return "enterprise";
    case "individual":
      return "individual";
    default:
      return "starter"; // Fallback
  }
}

/**
 * Determines account type from Clerk Billing plan name
 */
export function getAccountTypeFromClerkPlan(clerkPlan: ClerkBillingPlan): AccountType {
  if (
    clerkPlan === "free_org" ||
    clerkPlan === "team_starter" ||
    clerkPlan === "team_pro" ||
    clerkPlan === "team_enterprise"
  ) {
    return "team";
  }
  return "user";
}

/**
 * Validates if a plan name is a valid Clerk Billing plan
 */
export function isValidClerkPlan(plan: string): plan is ClerkBillingPlan {
  const validPlans: ClerkBillingPlan[] = [
    "free_user",
    "starter",
    "pro",
    "enterprise",
    "individual",
    "free_org",
    "team_starter",
    "team_pro",
    "team_enterprise",
  ];
  return validPlans.includes(plan as ClerkBillingPlan);
}

/**
 * Gets the account type from a Clerk plan or publicMetadata
 */
export function getAccountType(plan: string, isTeam?: boolean): AccountType {
  if (isTeam !== undefined) {
    return isTeam ? "team" : "user";
  }
  return getAccountTypeFromClerkPlan(plan as ClerkBillingPlan);
}


