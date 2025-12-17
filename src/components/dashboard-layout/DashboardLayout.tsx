import React, { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { LayoutShell } from './LayoutShell';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { useUser } from '@clerk/clerk-react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { PlanDebugInfo } from '@/components/dashboard/PlanDebugInfo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  const { plan, accountType } = useUserPlan();
  
  useEffect(() => {
    // Debug: Zeige Plan-Info in Console (IMMER, auch wenn user noch nicht geladen)
    if (import.meta.env.DEV) {
      console.log('🔍 [DashboardLayout] Current Plan Info:', {
        hasUser: !!user,
        plan,
        accountType,
        rawPlan: user?.publicMetadata?.plan,
        publicMetadata: user?.publicMetadata,
      });
    }
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
    
    // User-Objekt neu laden, um sicherzustellen, dass publicMetadata aktuell ist
    if (user) {
      user.reload().catch((error) => {
        console.error('Error reloading user:', error);
      });
    }
  }, [user]);
  
  return (
    <>
      <SignedIn>
        <WidgetProvider userId={user?.id}>
          <LayoutShell>
            {import.meta.env.DEV && <PlanDebugInfo />}
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

