// Unterdrücke Clerk Development-Keys Warnung in Development (MUSS ganz am Anfang stehen!)
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    // Filtere Clerk Development-Keys Warnung
    const message = args[0];
    if (
      typeof message === 'string' && 
      (message.includes('Clerk has been loaded with development keys') ||
       (message.includes('development keys') && message.includes('Clerk')))
    ) {
      return; // Unterdrücke diese spezifische Warnung
    }
    // Alle anderen Warnungen normal ausgeben
    originalWarn.apply(console, args);
  };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Warnung statt Fehler, damit die App auch ohne Key läuft (für Development)
if (!PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ VITE_CLERK_PUBLISHABLE_KEY ist nicht gesetzt. Clerk-Funktionen funktionieren möglicherweise nicht."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
