import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/funktionen",
  "/preise",
  "/use-cases",
  "/kontakt",
  "/support",
  "/ueber-uns",
  "/blog(.*)",
  "/datenschutz",
  "/impressum",
  "/agb",
  "/dokumentation(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/payment(.*)",
  "/onboarding", // Add onboarding to public routes
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

