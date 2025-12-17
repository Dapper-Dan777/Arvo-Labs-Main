import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import InboxPage from '../dashboard-pages/InboxPage';

export default function DashboardInbox() {
  return (
    <DashboardLayout>
      <InboxPage />
    </DashboardLayout>
  );
}

