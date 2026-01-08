import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "../_components/DashboardLayout";

/**
 * Individual User Dashboard
 * 
 * This is the main dashboard for users who are NOT part of an organization.
 * Shows user information and a "Coming Soon" message.
 */
export default async function UserDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const userEmail = user.emailAddresses[0]?.emailAddress || "No email";

  return (
    <DashboardLayout
      plan={(user.publicMetadata?.plan as string) || "starter"}
      accountType="user"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Individual Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Willkommen in deinem persönlichen Dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deine Informationen</CardTitle>
            <CardDescription>
              Hier siehst du deine aktuellen Account-Details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg text-foreground">{userName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
              <p className="text-lg text-foreground">{userEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg text-foreground capitalize">
                {(user.publicMetadata?.plan as string) || "Starter"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard - Coming Soon</CardTitle>
            <CardDescription>
              Das vollständige Dashboard wird hier in Kürze verfügbar sein.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Wir arbeiten an deinem individuellen Dashboard mit allen Features,
              die du für deine Arbeit benötigst.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

