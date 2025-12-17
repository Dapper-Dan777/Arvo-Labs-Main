import React, { ReactNode } from "react";
import { ContentProtectionOverlay } from "./ContentProtectionOverlay";

interface ProtectedPageLayoutProps {
  children: ReactNode;
  isProtected?: boolean; // Toggle für Production/Development
}

export function ProtectedPageLayout({ 
  children, 
  isProtected = true 
}: ProtectedPageLayoutProps) {
  return (
    <div className="relative w-full min-h-screen">
      {/* Content bleibt sichtbar (leicht geblurred, damit man erkennt dass etwas da ist) */}
      <div className={isProtected ? "blur-[2px] opacity-90 pointer-events-none select-none" : ""}>
        {children}
      </div>
      
      {/* Blur-Overlay über gesamte Seite - Box in Mitte der gesamten Seite */}
      {isProtected && <ContentProtectionOverlay />}
    </div>
  );
}

