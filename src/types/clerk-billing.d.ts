/**
 * TypeScript type definitions for Clerk Billing integration
 */

import type { ClerkBillingPlan, UIPlan, AccountType } from "@/lib/clerk-plan-mapping";

declare global {
  interface UserPublicMetadata {
    plan?: ClerkBillingPlan;
    isTeam?: boolean;
    accountType?: AccountType;
  }
}

export type { ClerkBillingPlan, UIPlan, AccountType };


