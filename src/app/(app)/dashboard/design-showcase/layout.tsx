import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserDashboardProvider } from "../user/_components/UserDashboardProvider";
import { UserDashboardLayoutClient } from "../user/_components/UserDashboardLayoutClient";
import type { Plan } from "../user/config";
import { mapClerkPlanToRoute, type ClerkBillingPlan } from "@/lib/clerk-plan-mapping";
import { getCurrentPlan } from "@/lib/get-current-plan";

export default async function DesignShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get current plan
  const planInfo = getCurrentPlan(user, null);
  
  // Determine plan from planInfo or user metadata
  const routePlan = planInfo?.routePlan || (user.publicMetadata?.plan ? mapClerkPlanToRoute(user.publicMetadata.plan as ClerkBillingPlan) : "starter");
  
  // Validate plan
  const validPlan: Plan =
    routePlan === "starter" ||
    routePlan === "pro" ||
    routePlan === "enterprise" ||
    routePlan === "individual" ||
    routePlan === "free"
      ? routePlan
      : "starter";

  // If this is a team account, redirect to team dashboard
  if (planInfo?.isTeam) {
    redirect("/dashboard");
  }

  return (
    <UserDashboardProvider plan={validPlan}>
      <UserDashboardLayoutClient plan={validPlan}>
        {children}
      </UserDashboardLayoutClient>
    </UserDashboardProvider>
  );
}
