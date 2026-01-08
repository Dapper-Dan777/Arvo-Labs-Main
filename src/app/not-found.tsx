import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard } from "lucide-react";

/**
 * 404 Not Found Page
 * 
 * Custom 404 page for Arvo Labs that matches the brand design.
 * This page is automatically shown by Next.js for all non-existent routes.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="max-w-lg w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-lg p-8 md:p-10 text-center">
        {/* Error Label */}
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4 font-medium">
          404 · Not Found
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
          This page could not be found.
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground mb-2 leading-relaxed">
          Die Seite, die du suchst, existiert nicht (mehr) oder wurde verschoben.
        </p>
        <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
          Zurück zur Startseite oder direkt ins Dashboard – damit du weiter automatisieren kannst.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Button variant="opux" size="lg" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Zur Startseite
            </Link>
          </Button>

          <Button variant="opuxOutline" size="lg" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4" />
              Zum Dashboard
            </Link>
          </Button>
        </div>

        {/* Branding Footer */}
        <p className="text-xs text-muted-foreground font-medium">
          Arvo Labs – automate, optimize, grow.
        </p>
      </section>
    </main>
  );
}


