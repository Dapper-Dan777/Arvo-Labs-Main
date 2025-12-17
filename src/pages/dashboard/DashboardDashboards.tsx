import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import DashboardsPage from '../dashboard-pages/DashboardsPage';

export default function DashboardDashboards() {
  return (
    <DashboardLayout>
      <DashboardsPage />
    </DashboardLayout>
  );
}

