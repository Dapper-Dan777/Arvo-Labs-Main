"use client";

import { OrganizationProfile } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

/**
 * Organization Management Page
 * 
 * Uses Clerk's <OrganizationProfile /> component to provide:
 * - Members management (invite, remove, change roles)
 * - Organization settings (name, logo)
 * - Billing management (Clerk Billing integration)
 * 
 * This is a catch-all route to support Clerk's internal navigation
 */
export default function TeamSettingsPage() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 md:p-6">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Keine Organization gefunden
          </h1>
          <p className="text-muted-foreground">
            Du bist aktuell keiner Organization zugeordnet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Team-Einstellungen
          </h1>
          <p className="text-muted-foreground">
            Verwalte dein Team, Mitglieder und Abonnements
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <OrganizationProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                navbar: "border-b border-border",
                navbarButton: "text-foreground hover:text-primary",
                navbarButtonActive: "text-primary border-b-2 border-primary",
                page: "bg-transparent",
                pageHeader: "mb-6",
                pageHeaderTitle: "text-2xl font-semibold text-foreground",
                pageHeaderSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90",
                formFieldInput: "bg-background border-border text-foreground",
                formFieldLabel: "text-foreground",
                tableHead: "text-foreground",
                tableBody: "text-foreground",
                badge: "bg-secondary text-secondary-foreground",
                button: "bg-primary text-primary-foreground hover:opacity-90",
                buttonDestructive: "bg-destructive text-destructive-foreground hover:opacity-90",
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--background))",
                colorInputBackground: "hsl(var(--background))",
                colorInputText: "hsl(var(--foreground))",
                colorText: "hsl(var(--foreground))",
                colorTextSecondary: "hsl(var(--muted-foreground))",
                borderRadius: "0.75rem",
              },
            }}
            routing="path"
            path="/dashboard/team/settings"
          />
        </div>
      </div>
    </div>
  );
}

