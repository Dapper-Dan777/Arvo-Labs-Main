import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import GoalsPage from '../dashboard-pages/GoalsPage';

export default function DashboardGoals() {
  return (
    <DashboardLayout>
      <GoalsPage />
    </DashboardLayout>
  );
}

