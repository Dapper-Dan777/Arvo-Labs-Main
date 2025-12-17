import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import WhiteboardsPage from '../dashboard-pages/WhiteboardsPage';

export default function DashboardWhiteboards() {
  return (
    <DashboardLayout>
      <WhiteboardsPage />
    </DashboardLayout>
  );
}

