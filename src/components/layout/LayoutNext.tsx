"use client";

import React, { ReactNode, Suspense, lazy } from "react";
import { HeaderNext } from "./HeaderNext";
import { FooterNext } from "./FooterNext";

// Lazy load schwere Komponenten für bessere Performance
const BackgroundAnimation = lazy(() => import("@/components/BackgroundAnimation").then(module => ({ default: module.BackgroundAnimation })));
const SupportModal = lazy(() => import("@/components/SupportModal").then(module => ({ default: module.SupportModal })));

interface LayoutProps {
  children: ReactNode;
}

export function LayoutNext({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Suspense fallback={null}>
        <BackgroundAnimation />
      </Suspense>
      <HeaderNext />
      <main className="flex-1 pt-16 relative z-10">{children}</main>
      <FooterNext />
      <Suspense fallback={null}>
        <SupportModal />
      </Suspense>
    </div>
  );
}

