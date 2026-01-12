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
    // Funktion zum Setzen des Themes und Hintergrunds
    const applyTheme = () => {
      const root = document.documentElement;
      const saved = localStorage.getItem('arvo-theme') || 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(saved);
      
      // Setze Hintergrund basierend auf Theme
      const bgColor = saved === 'dark' ? '#050505' : '#fafbfc';
      root.style.backgroundColor = bgColor;
      if (document.body) {
        document.body.style.backgroundColor = bgColor;
      }
      
      // Lade und wende das gespeicherte Hintergrund-Design an
      loadAndApplyBackgroundDesign();
    };
    
    // Initial anwenden
    applyTheme();
    
    // Listener für Theme-Änderungen
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arvo-theme') {
        applyTheme();
      }
    };
    
    // Listener für Theme-Toggle (falls ein Custom Event verwendet wird)
    const handleThemeChange = () => {
      applyTheme();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-change', handleThemeChange);
    
    // Prüfe alle 100ms auf Theme-Änderungen (Fallback)
    const interval = setInterval(() => {
      const root = document.documentElement;
      const saved = localStorage.getItem('arvo-theme') || 'light';
      const hasLight = root.classList.contains('light');
      const hasDark = root.classList.contains('dark');
      
      if (saved === 'light' && !hasLight) {
        applyTheme();
      } else if (saved === 'dark' && !hasDark) {
        applyTheme();
      }
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-change', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  // Sidebar-Breite: 64px (w-16) wenn collapsed, 224px (w-56) wenn expanded
  // Auf Desktop ist die Sidebar standardmäßig collapsed (64px), auf Mobile ist sie 0 wenn geschlossen
  const sidebarExpanded = isMobile ? sidebarOpen : isHovered;
  const sidebarPxWidth = sidebarExpanded ? 224 : 64; // 56 (w-56) * 4 = 224px, 16 (w-16) * 4 = 64px

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#050505]">
      <TeamDashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        plan={plan}
        setIsHovered={setIsHovered} // Pass setIsHovered
      />

      <div
        className="transition-all duration-300 bg-[#fafbfc] dark:bg-[#050505]"
        style={{
          paddingLeft: isMobile ? '0px' : `${sidebarPxWidth}px`,
          paddingTop: '0px',
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
          className="overflow-y-auto relative z-10 scrollbar-hide bg-[#fafbfc] dark:bg-[#050505]"
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

