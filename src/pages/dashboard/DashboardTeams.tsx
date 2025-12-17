import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import TeamsPage from '../dashboard-pages/TeamsPage';

export default function DashboardTeams() {
  return (
    <DashboardLayout>
      <TeamsPage />
    </DashboardLayout>
  );
}

