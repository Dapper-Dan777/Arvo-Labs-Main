"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";

/**
 * Dashboard Button Component
 * Uses current plan to generate correct dashboard link
 */
function DashboardButton() {
  const { dashboardPath, planDisplay, isLoading } = useCurrentPlan();

  if (isLoading) {
    return (
      <Button variant="opux" size="sm" disabled>
        Dashboard
      </Button>
    );
  }

  return (
    <Button variant="opux" size="sm" asChild>
      <Link href={dashboardPath}>
        Dashboard
        {planDisplay && planDisplay !== "No Plan" && (
          <span className="ml-2 text-xs opacity-75">({planDisplay.split(" ")[0]})</span>
        )}
      </Link>
    </Button>
  );
}

/**
 * Mobile Dashboard Button Component
 */
function MobileDashboardButton({ onClose }: { onClose: () => void }) {
  const { dashboardPath, planDisplay, isLoading } = useCurrentPlan();

  if (isLoading) {
    return (
      <Button variant="opux" size="sm" className="mt-2 w-full" disabled>
        Dashboard
      </Button>
    );
  }

  return (
    <Button 
      variant="opux" 
      size="sm" 
      className="mt-2 w-full" 
      asChild
      onClick={onClose}
    >
      <Link href={dashboardPath}>
        Dashboard
        {planDisplay && planDisplay !== "No Plan" && (
          <span className="ml-2 text-xs opacity-75">({planDisplay.split(" ")[0]})</span>
        )}
      </Link>
    </Button>
  );
}

export function HeaderNext() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: t.nav.features, path: "/funktionen" },
    { name: t.nav.pricing, path: "/preise" },
    { name: t.nav.useCases, path: "/use-cases" },
    { name: t.nav.contact, path: "/kontakt" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-semibold text-lg text-foreground">
              Arvo Labs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "de" ? "en" : "de")}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">{language}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Clerk Auth Components */}
            <SignedOut>
              <SignInButton mode="redirect" forceRedirectUrl="/sign-in">
                <Button variant="ghost" size="sm">
                  {t.auth.signIn}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
                <Button variant="opux" size="sm">
                  {t.auth.signUp}
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Suspense fallback={<Button variant="opux" size="sm" disabled>Dashboard</Button>}>
                <DashboardButton />
              </Suspense>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground"
            >
              {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              className="text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base py-2 transition-colors ${
                  isActive(link.path)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "de" ? "en" : "de")}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                {language === "de" ? "English" : "Deutsch"}
              </Button>
            </div>
            <SignedOut>
              <SignInButton mode="redirect" forceRedirectUrl="/sign-in">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.auth.signIn}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
                <Button 
                  variant="opux" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.auth.signUp}
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <MobileDashboardButton onClose={() => setMobileMenuOpen(false)} />
              <div className="mt-2 flex justify-center">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}

