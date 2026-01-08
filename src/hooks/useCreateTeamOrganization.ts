"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { mapPlanToClerk, type AccountType } from "@/lib/clerk-plan-mapping";

interface CreateTeamOrganizationOptions {
  plan: string; // UI plan name (e.g., "starter", "pro", "enterprise")
  organizationName?: string;
  onSuccess?: (organizationId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to create a team organization
 * 
 * Usage:
 * const { createOrganization, isLoading, error } = useCreateTeamOrganization();
 * 
 * await createOrganization({ plan: "pro", organizationName: "My Team" });
 */
export function useCreateTeamOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const createOrganization = async ({
    plan,
    organizationName,
    onSuccess,
    onError,
  }: CreateTeamOrganizationOptions) => {
    if (!user) {
      const err = new Error("User must be signed in");
      setError(err);
      onError?.(err);
      toast({
        title: "Fehler",
        description: "Du musst angemeldet sein, um ein Team zu erstellen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map UI plan to Clerk plan
      const clerkPlan = mapPlanToClerk(plan, "team");

      const response = await fetch("/api/clerk/create-team-org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan, // UI plan name (API will map to Clerk plan)
          accountType: "team",
          organizationName: organizationName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.errorCode === "ORGANIZATION_ALREADY_EXISTS") {
          // User already has an organization with this plan
          toast({
            title: "Team bereits vorhanden",
            description: data.error || "Du hast bereits ein Team für diesen Plan. Du wirst zum Dashboard weitergeleitet.",
            variant: "default",
          });
          
          // Reload user to get updated organization list
          await user.reload();
          
          // Redirect to dashboard
          router.push("/dashboard");
          return;
        }
        
        // Other errors
        const errorMessage = data.error || "Fehler beim Erstellen des Teams";
        throw new Error(errorMessage);
      }

      // Reload user to get updated organization list
      await user.reload();

      // Check if organization already existed
      if (data.alreadyExisted) {
        toast({
          title: "Team gefunden",
          description: `Dein Team "${data.organizationName}" ist bereits vorhanden.`,
        });
      } else {
        toast({
          title: "Team erstellt",
          description: `Dein Team "${data.organizationName}" wurde erfolgreich erstellt.`,
        });
      }

      onSuccess?.(data.organizationId);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || "Unknown error");
      setError(error);
      onError?.(error);
      
      // User-friendly error messages
      let errorTitle = "Fehler";
      let errorDescription = error.message || "Fehler beim Erstellen des Teams.";
      
      // Map common errors to user-friendly messages
      if (error.message.includes("Unauthorized") || error.message.includes("must be signed in")) {
        errorTitle = "Nicht angemeldet";
        errorDescription = "Du musst angemeldet sein, um ein Team zu erstellen.";
      } else if (error.message.includes("Invalid plan")) {
        errorTitle = "Ungültiger Plan";
        errorDescription = "Der ausgewählte Plan ist ungültig. Bitte wähle einen anderen Plan.";
      } else if (error.message.includes("already exists") || error.message.includes("bereits")) {
        errorTitle = "Team bereits vorhanden";
        errorDescription = "Du hast bereits ein Team für diesen Plan.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorTitle = "Verbindungsfehler";
        errorDescription = "Es gab ein Problem mit der Verbindung. Bitte versuche es erneut.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
    error,
  };
}

