// Unterdrücke Clerk Development-Keys Warnung in Development (Backup, falls index.html nicht greift)
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = function(...args: any[]) {
    const message = String(args[0] || '');
    if (message.includes('Clerk has been loaded with development keys') ||
        (message.includes('development keys') && message.includes('Clerk'))) {
      return; // Unterdrücke diese spezifische Warnung
    }
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args: any[]) {
    const message = String(args[0] || '');
    if (message.includes('Clerk has been loaded with development keys') ||
        (message.includes('development keys') && message.includes('Clerk'))) {
      return; // Unterdrücke diese spezifische Warnung
    }
    originalError.apply(console, args);
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
