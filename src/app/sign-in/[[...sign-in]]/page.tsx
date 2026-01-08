"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutNext } from "@/components/layout/LayoutNext";

export default function SignInPage() {
  return (
    <LayoutNext>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              Willkommen zurück
            </h1>
            <p className="text-muted-foreground">
              Melde dich an, um auf dein Dashboard zuzugreifen
            </p>
          </div>

          {/* Clerk Sign-In Component */}
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-lg border border-border bg-card rounded-xl",
                  headerTitle: "text-foreground font-semibold",
                  headerSubtitle: "text-muted-foreground",
                  socialButtonsBlockButton:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
                  formButtonPrimary:
                    "bg-primary text-primary-foreground hover:opacity-90 font-semibold",
                  formFieldInput:
                    "bg-background border-border text-foreground focus:border-primary focus:ring-primary",
                  formFieldLabel: "text-foreground",
                  footerActionLink: "text-primary hover:text-primary/80",
                  identityPreviewText: "text-foreground",
                  identityPreviewEditButton: "text-primary hover:text-primary/80",
                  formResendCodeLink: "text-primary hover:text-primary/80",
                  otpCodeFieldInput: "bg-background border-border text-foreground",
                },
                variables: {
                  colorPrimary: "hsl(var(--primary))",
                  colorBackground: "hsl(var(--background))",
                  colorInputBackground: "hsl(var(--background))",
                  colorInputText: "hsl(var(--foreground))",
                  colorText: "hsl(var(--foreground))",
                  colorTextSecondary: "hsl(var(--muted-foreground))",
                  colorSuccess: "hsl(142 76% 36%)",
                  colorDanger: "hsl(var(--destructive))",
                  borderRadius: "0.75rem",
                  fontFamily: "'Inter', system-ui, sans-serif",
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/onboarding"
            />
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Jetzt registrieren
            </Link>
          </div>
        </div>
      </div>
    </LayoutNext>
  );
}
