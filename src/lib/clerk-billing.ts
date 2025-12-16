/**
 * Clerk Billing Plan IDs
 * Diese IDs müssen mit den Plan IDs im Clerk Dashboard übereinstimmen
 */

export const USER_PLAN_IDS = {
  starter: "cplan_36wBO5cFvWQO0wk0scQFdkxTKIA",
  pro: "cplan_36wBaMbKGVXAr0axyDtzrL9IpL0",
  enterprise: "cplan_36wBjAYcrxMq3hFreVm5Lil4jSu",
} as const;

export const ORG_PLAN_IDS = {
  team_starter: "cplan_36wCRSd1BPN9poL5zFMdmSmkoa6",
  team_pro: "cplan_36wCbGG0jTzcaiOTDS07ECBTkxj",
  team_enterprise: "cplan_36wCgfLxZnWXgz93DYBXExx36O8",
} as const;

/**
 * Erstellt eine Clerk Billing Checkout URL für User Plans
 */
export function getUserCheckoutUrl(planKey: keyof typeof USER_PLAN_IDS): string {
  const planId = USER_PLAN_IDS[planKey];
  if (!planId) {
    throw new Error(`Invalid user plan key: ${planKey}`);
  }

  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  const isTest = publishableKey.includes("test") || publishableKey.includes("pk_test");
  
  const baseUrl = isTest 
    ? "https://accounts.clerk.dev" 
    : "https://accounts.clerk.com";
  
  return `${baseUrl}/subscribe/${planId}`;
}

/**
 * Erstellt eine Clerk Billing Checkout URL für Organization Plans
 */
export function getOrgCheckoutUrl(
  planKey: keyof typeof ORG_PLAN_IDS,
  organizationId: string
): string {
  const planId = ORG_PLAN_IDS[planKey];
  if (!planId) {
    throw new Error(`Invalid organization plan key: ${planKey}`);
  }

  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  const isTest = publishableKey.includes("test") || publishableKey.includes("pk_test");
  
  const baseUrl = isTest 
    ? "https://accounts.clerk.dev" 
    : "https://accounts.clerk.com";
  
  return `${baseUrl}/subscribe/${planId}?organizationId=${organizationId}`;
}

