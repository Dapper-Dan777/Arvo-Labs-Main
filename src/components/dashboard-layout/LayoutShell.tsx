import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPlan } from '@/hooks/useUserPlan';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { plan } = useUserPlan();

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
    // Hintergrund sofort setzen
    root.style.backgroundColor = saved === 'dark' ? 'hsl(240 10% 6%)' : 'hsl(0 0% 100%)';
    if (document.body) {
      document.body.style.backgroundColor = saved === 'dark' ? 'hsl(240 10% 6%)' : 'hsl(0 0% 100%)';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        plan={plan}
      />

      <div className="lg:pl-16 flex flex-col min-h-screen transition-all duration-200">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />

        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

