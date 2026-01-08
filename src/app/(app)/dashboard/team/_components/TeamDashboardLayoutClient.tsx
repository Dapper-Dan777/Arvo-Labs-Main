"use client";

import React, { useState, useEffect } from 'react';
import { TeamDashboardSidebar } from './TeamDashboardSidebar';
import { TeamDashboardHeader } from './TeamDashboardHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTeamDashboard } from './TeamDashboardProvider';
import { loadAndApplyBackgroundDesign } from '@/lib/applyBackgroundDesign';

interface TeamDashboardLayoutClientProps {
  children: React.ReactNode;
  plan: string;
}

export function TeamDashboardLayoutClient({ children, plan }: TeamDashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Added for desktop hover
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // Sicherstellen, dass das Theme nach dem Login angewendet wird
    const root = document.documentElement;
    const saved = localStorage.getItem('arvo-theme') || 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(saved);
    // Hintergrund nur auf documentElement setzen, nicht auf body
    // Der Hintergrund wird durch die Hintergrund-Design-Funktion gesetzt
    if (document.body) {
      document.body.style.backgroundColor = 'transparent';
    }
    
    // Lade und wende das gespeicherte Hintergrund-Design an
    loadAndApplyBackgroundDesign();
  }, []);

  // Sidebar-Breite: 64px (w-16) wenn collapsed, 224px (w-56) wenn expanded
  // Auf Desktop ist die Sidebar standardmäßig collapsed (64px), auf Mobile ist sie 0 wenn geschlossen
  const sidebarExpanded = isMobile ? sidebarOpen : isHovered;
  const sidebarPxWidth = sidebarExpanded ? 224 : 64; // 56 (w-56) * 4 = 224px, 16 (w-16) * 4 = 64px

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <TeamDashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        plan={plan}
        setIsHovered={setIsHovered} // Pass setIsHovered
      />

      <div
        className="transition-all duration-300"
        style={{
          paddingLeft: isMobile ? '0px' : `${sidebarPxWidth}px`,
          paddingTop: '0px',
          backgroundColor: 'transparent',
        }}
      >
        <TeamDashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
          plan={plan}
          sidebarCollapsed={!sidebarExpanded} // Pass collapsed state
          onToggleSidebar={() => setIsHovered(prev => !prev)} // Toggle hover for desktop
          sidebarWidth={sidebarPxWidth} // Pass calculated width
        />

        <main 
          className="overflow-y-auto relative z-10 scrollbar-hide"
          style={{
            height: 'calc(100vh - 5rem)',
            paddingTop: '5.5rem',
            backgroundColor: 'transparent',
          }}
        >
          <div className="w-full p-6 lg:p-12" style={{ backgroundColor: 'transparent' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

