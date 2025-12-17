import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import MailPage from '../dashboard-pages/MailPage';

export default function DashboardMail() {
  return (
    <DashboardLayout>
      <MailPage />
    </DashboardLayout>
  );
}

