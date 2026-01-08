"use client";

import { useState, useEffect } from "react";
import { useUser, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, ArrowRight } from "lucide-react";
import { DashboardLayout } from "../../_components/DashboardLayout";

/**
 * Page for creating a Team Organization
 * 
 * This page is shown when:
 * - User has isTeam: true in publicMetadata
 * - User is not a member of any organization
 * 
 * User can:
 * - Create a new organization
 * - Enter organization name
 * - Automatically get assigned as org:admin
 */
export default function CreateTeamOrganizationPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();
  const router = useRouter();
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user already has an organization
  useEffect(() => {
    if (userLoaded && orgListLoaded) {
      setIsChecking(false);
      
      // If user already has an organization, redirect to dashboard
      if (organizationList && organizationList.length > 0) {
        router.push("/dashboard");
        return;
      }

      // Set default organization name
      if (user && !organizationName) {
        const defaultName = `${user.firstName || user.emailAddresses[0]?.emailAddress || "Team"}'s Team`;
        setOrganizationName(defaultName);
      }
    }
  }, [userLoaded, orgListLoaded, organizationList, user, router, organizationName]);

  // Don't render until we've checked for existing organizations
  if (isChecking || !userLoaded || !orgListLoaded) {
    return (
      <DashboardLayout plan="starter" accountType="team">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // If user already has an organization, show loading (redirect is happening)
  if (organizationList && organizationList.length > 0) {
    return (
      <DashboardLayout plan="starter" accountType="team">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const handleCreateOrganization = async () => {
    if (!organizationName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für dein Team ein.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Get plan from user metadata
      const userPlan = (user?.publicMetadata?.plan as string) || "starter";
      const accountType = (user?.publicMetadata?.accountType as string) || "team";

      // Map Clerk plan to UI plan if needed
      let uiPlan = userPlan;
      if (userPlan.startsWith("team_")) {
        uiPlan = userPlan.replace("team_", "");
      } else if (userPlan === "free_org") {
        uiPlan = "starter";
      }

      const response = await fetch("/api/clerk/create-team-org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: uiPlan,
          accountType: accountType,
          organizationName: organizationName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Team erstellt",
          description: `Dein Team "${data.organizationName}" wurde erfolgreich erstellt.`,
        });

        // Reload user to get updated organization list
        await user?.reload();

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        toast({
          title: "Fehler",
          description: data.error || "Fehler beim Erstellen des Teams.",
          variant: "destructive",
        });
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout plan="starter" accountType="team">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Team erstellen</CardTitle>
                <CardDescription>
                  Erstelle ein Team, um Team-Features zu nutzen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Team-Name</Label>
              <Input
                id="org-name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="z.B. Mein Unternehmen"
                disabled={isCreating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) {
                    handleCreateOrganization();
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Du wirst automatisch als Administrator des Teams hinzugefügt.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateOrganization}
                disabled={isCreating || !organizationName.trim()}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    Team erstellen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isCreating}
              >
                Abbrechen
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Hinweis:</strong> Nach der Erstellung kannst du weitere
                Teammitglieder einladen und Team-Features nutzen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

