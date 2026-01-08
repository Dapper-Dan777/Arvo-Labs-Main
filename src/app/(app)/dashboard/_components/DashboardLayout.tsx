"use client";

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { useMemo } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  plan?: string; // Plan from server-side props
  accountType?: "user" | "team"; // AccountType from server-side props
}

/**
 * Dashboard Layout - Eigenes Layout für Dashboard-Bereich
 * Verwendet das gleiche Design-System wie die Website, aber ohne Header/Footer
 * 
 * Uses props from server-side rendering to avoid client-side re-render loops
 */
export function DashboardLayout({ children, plan: fallbackPlan, accountType: fallbackAccountType }: DashboardLayoutProps) {
  const router = useRouter();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  // Only check if user is in organization for OrganizationSwitcher visibility
  // Use props from server-side to avoid re-render loops
  const displayPlan = fallbackPlan || "starter";
  const displayAccountType = fallbackAccountType || "user";
  const isTeam = displayAccountType === "team" && organization && orgLoaded;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="font-semibold text-lg text-foreground">
                Arvo Labs
              </span>
            </Link>

            {/* Right side: Plan info + User Button */}
            <div className="flex items-center gap-4">
              {displayPlan && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground font-medium">
                    Plan:
                  </span>
                  <span className="text-sm text-foreground font-semibold capitalize">
                    {displayPlan}
                  </span>
                  {displayAccountType && (
                    <span className="text-xs text-muted-foreground">
                      ({displayAccountType})
                    </span>
                  )}
                </div>
              )}

              {/* Back to Home Button */}
              <Button
                variant="opuxOutline"
                size="sm"
                asChild
                className="gap-2"
              >
                <Link href="/?stay=true">
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Startseite</span>
                </Link>
              </Button>

              {/* Organization Switcher - nur anzeigen wenn User in Organization ist */}
              {isTeam && (
                <OrganizationSwitcher
                  afterSelectOrganizationUrl="/dashboard"
                  afterSelectPersonalUrl="/dashboard"
                  hidePersonal={false}
                  appearance={{
                    elements: {
                      rootBox: "flex items-center",
                      organizationSwitcherTrigger: "px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent transition-colors",
                      organizationPreview: "text-sm",
                    },
                  }}
                />
              )}

              {/* User Button */}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}


