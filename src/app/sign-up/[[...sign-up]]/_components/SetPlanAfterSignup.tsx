"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { mapPlanToClerk, type AccountType } from "@/lib/clerk-plan-mapping";

/**
 * Client component that sets plan and accountType in Clerk publicMetadata after successful signup
 * This component is rendered after Clerk's SignUp component completes
 * 
 * Maps UI plan names to Clerk Billing plan names before sending to API
 */
export function SetPlanAfterSignup() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const accountType = searchParams.get("accountType") as AccountType | null;

  useEffect(() => {
    // Only run if user is loaded
    if (!isLoaded || !user) {
      return;
    }

    // If no plan/accountType params, set default plan (starter/user)
    const finalPlan = plan || "starter";
    let finalAccountType: AccountType = accountType || "user";

    // Validate accountType - set to "user" if invalid
    if (finalAccountType !== "user" && finalAccountType !== "team") {
      console.error("Invalid accountType:", finalAccountType, "- defaulting to 'user'");
      finalAccountType = "user";
    }

    // Map UI plan to Clerk plan for comparison
    const clerkPlan = mapPlanToClerk(finalPlan, finalAccountType);

    // Check if metadata is already set (avoid duplicate calls)
    const currentPlan = user.publicMetadata?.plan;
    const currentIsTeam = user.publicMetadata?.isTeam;

    if (currentPlan === clerkPlan && currentIsTeam === (finalAccountType === "team")) {
      // Already set, redirect to dashboard
      router.push("/dashboard");
      return;
    }

    // Set metadata via API (API will handle the mapping)
    const setPlan = async () => {
      try {
        // If accountType is "team", create organization first
        if (finalAccountType === "team") {
          try {
            const orgResponse = await fetch("/api/clerk/create-team-org", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                plan: finalPlan, // UI plan name (API will map to Clerk plan)
                accountType: finalAccountType,
              }),
            });

            if (!orgResponse.ok) {
              const orgErrorData = await orgResponse.json().catch(() => ({}));
              
              // If organization already exists (409), that's OK - continue with metadata setting
              if (orgResponse.status === 409 && orgErrorData.errorCode === "ORGANIZATION_ALREADY_EXISTS") {
                console.log("Organization already exists for this plan:", orgErrorData);
                // Continue - organization exists, just set metadata
              } else {
                console.error("Failed to create organization:", orgErrorData);
                // Continue anyway - we'll still set the plan metadata
              }
            } else {
              const orgData = await orgResponse.json();
              console.log("Organization created:", orgData);
            }
          } catch (orgError) {
            console.error("Error creating organization:", orgError);
            // Continue anyway - we'll still set the plan metadata
          }
        }

        // Set user metadata (plan, isTeam, accountType)
        const response = await fetch("/api/set-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: finalPlan, // UI plan name (API will map to Clerk plan)
            accountType: finalAccountType,
          }),
        });

        if (response.ok) {
          // Reload user to get updated metadata, then redirect
          await user.reload();
          router.push("/dashboard");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to set plan metadata:", errorData);
          // Still redirect to dashboard even if setting fails
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error setting plan metadata:", error);
        // Still redirect to dashboard even if setting fails
        router.push("/dashboard");
      }
    };

    setPlan();
  }, [user, isLoaded, plan, accountType, router]);

  return null;
}

