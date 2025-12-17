import React, { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { LayoutShell } from './LayoutShell';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { useUser } from '@clerk/clerk-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  
  useEffect(() => {
    // Theme nach dem Login sicherstellen
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
    <>
      <SignedIn>
        <WidgetProvider userId={user?.id}>
          <LayoutShell>
            {children}
          </LayoutShell>
        </WidgetProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

