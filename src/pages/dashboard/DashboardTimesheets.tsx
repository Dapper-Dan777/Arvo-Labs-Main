import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import TimesheetsPage from '../dashboard-pages/TimesheetsPage';

export default function DashboardTimesheets() {
  return (
    <DashboardLayout>
      <TimesheetsPage />
    </DashboardLayout>
  );
}

