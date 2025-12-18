import React, { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@/contexts/AuthContext';
import { LayoutShell } from './LayoutShell';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { useUser } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { PlanDebugInfo } from '@/components/dashboard/PlanDebugInfo';
import { supabase } from '@/Integrations/supabase/client';

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
        userMetadata: user?.publicMetadata,
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
    
    // User-Objekt neu laden, um sicherzustellen, dass user_metadata aktuell ist
    if (user) {
      supabase.auth.getUser().catch((error) => {
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

