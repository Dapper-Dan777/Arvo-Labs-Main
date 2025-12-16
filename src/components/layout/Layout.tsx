import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { SupportModal } from "@/components/SupportModal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundAnimation />
      <Header />
      <main className="flex-1 pt-16 relative z-10">{children}</main>
      <Footer />
      <SupportModal />
    </div>
  );
}
