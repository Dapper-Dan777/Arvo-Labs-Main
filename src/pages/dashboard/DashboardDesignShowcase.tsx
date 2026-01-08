import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';

// Design Showcase Page - Test Version
export default function DashboardDesignShowcase() {
  console.log('DashboardDesignShowcase component rendered');
  
  return (
    <DashboardLayout>
      <div className="space-y-8 pt-4 pb-20">
        <div className="p-8 bg-card rounded-lg border shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-foreground">✨ Design Showcase</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Die Route funktioniert! Wenn du diese Seite siehst, ist alles korrekt konfiguriert.
          </p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Route:</strong> /dashboard/design-showcase
            </p>
            <p className="text-sm text-foreground mt-2">
              <strong>Status:</strong> ✅ Seite lädt erfolgreich
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
