"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { LayoutNext } from "@/components/layout/LayoutNext";
import { SetPlanAfterSignup } from "./_components/SetPlanAfterSignup";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const accountType = searchParams.get("accountType");

  return (
    <LayoutNext>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              Konto erstellen
            </h1>
            <p className="text-muted-foreground">
              Starte deine Reise mit Arvo Labs
            </p>
            {plan && accountType && (
              <p className="text-sm text-muted-foreground mt-2">
                Plan: <span className="font-medium capitalize">{plan}</span> •{" "}
                <span className="font-medium capitalize">{accountType}</span>
              </p>
            )}
          </div>

          {/* Clerk Sign-Up Component */}
          <div className="flex justify-center">
            <SignUp
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
                  formFieldSuccessText: "text-success",
                  formFieldErrorText: "text-destructive",
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
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/onboarding"
            />
          </div>

          {/* Set plan metadata after successful signup */}
          <SignedIn>
            <SetPlanAfterSignup />
          </SignedIn>

          {/* Footer Link */}
          <div className="text-center text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Jetzt anmelden
            </Link>
          </div>
        </div>
      </div>
    </LayoutNext>
  );
}
