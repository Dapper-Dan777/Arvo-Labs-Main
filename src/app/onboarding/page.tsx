"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";

/**
 * Onboarding Page
 * 
 * This page determines where to redirect the user after sign-in/sign-up:
 * Uses getCurrentPlan() to detect Organization or User plan and redirects accordingly:
 * - Organization plan → /dashboard/team/{plan}
 * - User plan → /dashboard/user/{plan}
 * - No plan → /preise
 */
export default function OnboardingPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { planInfo, dashboardPath, isLoading: planLoading } = useCurrentPlan();
  const router = useRouter();

  useEffect(() => {
    // Wait for user and organization to load
    if (!userLoaded || !orgLoaded || planLoading) {
      return;
    }

    // If user is not signed in, redirect to sign-in
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Use dashboardPath from useCurrentPlan hook
    // This automatically handles Organization vs User plan detection
    // Redirect to dashboard if we have a valid path, or to pricing if no plan
    if (dashboardPath) {
      router.push(dashboardPath);
    } else {
      // Fallback: If no plan found after 2 seconds, redirect to pricing
      const timeout = setTimeout(() => {
        router.push("/preise");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, userLoaded, orgLoaded, planLoading, dashboardPath, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Willkommen!</CardTitle>
          <CardDescription>
            Wir bereiten dein Dashboard vor...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

