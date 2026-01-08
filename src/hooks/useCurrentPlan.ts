"use client";

import { useUser, useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useMemo } from "react";
import { getCurrentPlan, getDashboardPath, formatPlanDisplay, type CurrentPlanInfo } from "@/lib/get-current-plan";

/**
 * Hook to get current plan information (Organization or User)
 * 
 * Priority:
 * 1. Active Organization publicMetadata.plan
 * 2. User publicMetadata.plan
 * 
 * @returns CurrentPlanInfo or null
 */
export function useCurrentPlan(): {
  planInfo: CurrentPlanInfo | null;
  dashboardPath: string;
  planDisplay: string;
  isLoading: boolean;
} {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();

  const isLoading = !userLoaded || !orgLoaded || !orgListLoaded;

  // Stabilize organizationList by using IDs instead of the full array
  const orgListIds = useMemo(() => {
    if (!organizationList || organizationList.length === 0) return null;
    return organizationList.map(org => org.id).join(",");
  }, [organizationList]);

  // Stabilize organization by using ID
  const orgId = useMemo(() => organization?.id || null, [organization?.id]);

  // Stabilize user by using ID
  const userId = useMemo(() => user?.id || null, [user?.id]);

  const planInfo = useMemo(() => {
    if (!user || isLoading) {
      return null;
    }

    // Priority 1: Use active organization if available
    if (organization) {
      return getCurrentPlan(user, organization);
    }

    // Priority 2: Use first organization from list if no active one
    if (organizationList && organizationList.length > 0) {
      return getCurrentPlan(user, organizationList[0]);
    }

    // Priority 3: Use user metadata
    return getCurrentPlan(user, null);
  }, [user, userId, organization, orgId, organizationList, orgListIds, isLoading]);

  const dashboardPath = useMemo(() => {
    return getDashboardPath(planInfo);
  }, [planInfo]);

  const planDisplay = useMemo(() => {
    return formatPlanDisplay(planInfo);
  }, [planInfo]);

  return {
    planInfo,
    dashboardPath,
    planDisplay,
    isLoading,
  };
}

