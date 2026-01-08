"use client";

import React, { useState, useEffect } from 'react';
import { UserDashboardSidebar } from './UserDashboardSidebar';
import { UserDashboardHeader } from './UserDashboardHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { loadAndApplyBackgroundDesign } from '@/lib/applyBackgroundDesign';

interface UserDashboardLayoutClientProps {
  children: React.ReactNode;
  plan: string;
}

export function UserDashboardLayoutClient({ children, plan }: UserDashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('arvo-theme') || 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(saved);
    if (document.body) {
      document.body.style.backgroundColor = 'transparent';
    }
    
    loadAndApplyBackgroundDesign();
  }, []);

  const sidebarExpanded = isMobile ? sidebarOpen : isHovered;
  const sidebarPxWidth = sidebarExpanded ? 224 : 64;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#050505] relative overflow-hidden">
      {/* Premium Background with Gradients */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafbfc] via-[#f8fafc] to-[#f1f5f9] dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#0f172a]" />
        
        {/* Top gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#ec4899]/15 via-[#f472b6]/10 to-transparent rounded-full blur-3xl" />
        
        {/* Bottom gradient - MAIN FOCUS */}
        <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-[#6366f1]/30 via-[#8b5cf6]/20 to-[#ec4899]/15 dark:from-[#6366f1]/20 dark:via-[#8b5cf6]/15 dark:to-[#ec4899]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-gradient-to-tr from-[#8b5cf6]/25 via-[#ec4899]/20 to-[#f472b6]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-[#6366f1]/25 via-[#8b5cf6]/20 to-[#ec4899]/15 rounded-full blur-3xl" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-50" />
      </div>

      <UserDashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        plan={plan}
        setIsHovered={setIsHovered}
      />

      <div
        className="transition-all duration-300"
        style={{
          paddingLeft: isMobile ? '0px' : `${sidebarPxWidth}px`,
          paddingTop: '0px',
        }}
      >
        <UserDashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
          plan={plan}
          sidebarCollapsed={!sidebarExpanded}
          onToggleSidebar={() => setIsHovered(prev => !prev)}
          sidebarWidth={sidebarPxWidth}
        />

        <main 
          className="overflow-y-auto relative z-10 scrollbar-hide"
          style={{
            height: 'calc(100vh - 5rem)',
            paddingTop: '5.5rem',
          }}
        >
          <div className="w-full p-6 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

