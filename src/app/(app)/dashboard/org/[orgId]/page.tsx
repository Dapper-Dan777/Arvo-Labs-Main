import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "../../_components/DashboardLayout";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Organization Dashboard
 * 
 * This is the main dashboard for users who are part of an organization.
 * Shows organization information and a "Coming Soon" message.
 */
export default async function OrganizationDashboardPage({
  params,
}: {
  params: { orgId: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const orgId = params.orgId;

  // Get organization details from Clerk
  let organization;
  try {
    const client = await clerkClient();
    organization = await client.organizations.getOrganization({ organizationId: orgId });
  } catch (error) {
    console.error("Error fetching organization:", error);
    redirect("/dashboard");
  }

  // Get organization members count
  let memberCount = 0;
  try {
    const client = await clerkClient();
    const memberships = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
    memberCount = memberships.data?.length || 0;
  } catch (error) {
    console.error("Error fetching organization members:", error);
  }

  const orgName = organization.name || "Organization";
  const orgPlan = (organization.publicMetadata?.plan as string) || "Starter";

  return (
    <DashboardLayout
      plan={orgPlan}
      accountType="team"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Willkommen im Dashboard deines Teams
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team-Informationen</CardTitle>
            <CardDescription>
              Hier siehst du die Details deines Teams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team-Name</p>
              <p className="text-lg text-foreground">{orgName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg text-foreground capitalize">{orgPlan}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mitglieder</p>
              <p className="text-lg text-foreground">{memberCount} Mitglieder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard - Coming Soon</CardTitle>
            <CardDescription>
              Das vollständige Team-Dashboard wird hier in Kürze verfügbar sein.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Wir arbeiten an deinem Team-Dashboard mit allen Features,
              die dein Team für die Zusammenarbeit benötigt.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

