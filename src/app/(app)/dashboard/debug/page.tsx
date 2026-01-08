import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentPlan, getDashboardPath } from "@/lib/get-current-plan";

/**
 * Debug Page - Shows current plan detection information
 * 
 * This page helps debug plan detection issues.
 * Access at: /dashboard/debug
 */
export default async function DebugPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view debug information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user's organizations
  let activeOrganization = null;
  let userOrgs = null;
  try {
    const client = await clerkClient();
    userOrgs = await client.users.getOrganizationMembershipList({
      userId: user.id,
    });

    if (userOrgs && userOrgs.data && userOrgs.data.length > 0) {
      const firstOrg = userOrgs.data[0];
      try {
        activeOrganization = await client.organizations.getOrganization({
          organizationId: firstOrg.organization.id,
        });
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    }
  } catch (error) {
    console.error("Error checking organization membership:", error);
  }

  // Get current plan
  const planInfo = getCurrentPlan(user, activeOrganization || undefined);
  const dashboardPath = getDashboardPath(planInfo);

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">User Information</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-auto">
              {JSON.stringify(
                {
                  id: user.id,
                  email: user.emailAddresses[0]?.emailAddress,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  publicMetadata: user.publicMetadata,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Organizations</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-auto">
              {JSON.stringify(
                {
                  count: userOrgs?.data?.length || 0,
                  organizations: userOrgs?.data?.map((org) => ({
                    id: org.organization.id,
                    name: org.organization.name,
                    role: org.role,
                    publicMetadata: org.organization.publicMetadata,
                  })) || [],
                  activeOrganization: activeOrganization
                    ? {
                        id: activeOrganization.id,
                        name: activeOrganization.name,
                        publicMetadata: activeOrganization.publicMetadata,
                      }
                    : null,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Plan Detection</h3>
            <pre className="bg-secondary p-4 rounded text-sm overflow-auto">
              {JSON.stringify(
                {
                  planInfo,
                  dashboardPath,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Expected Redirect</h3>
            <p className="text-sm text-muted-foreground">
              Dashboard Path: <code className="bg-secondary px-2 py-1 rounded">{dashboardPath}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




