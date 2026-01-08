"use client";

import { useTeamDashboard } from "./TeamDashboardProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function TeamDashboardClient() {
  const { plan } = useTeamDashboard();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we're not already on the correct route
    if (plan === "enterprise" && pathname !== "/dashboard/team/enterprise") {
      router.push("/dashboard/team/enterprise");
    }
  }, [plan, router, pathname]);

  // Show "Coming soon" for plans without dedicated pages
  switch (plan) {
    case "starter":
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Starter Team Dashboard
          </h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      );

    case "pro":
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Pro Team Dashboard
          </h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      );

    case "enterprise":
      // Will redirect via useEffect, show loading state
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Redirecting to Enterprise Dashboard...</p>
        </div>
      );

    case "individual":
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Individual Team Dashboard
          </h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      );

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Unknown Plan
          </h2>
          <p className="text-muted-foreground">Please contact support.</p>
        </div>
      );
  }
}

