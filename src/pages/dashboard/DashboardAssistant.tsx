import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import AssistantPage from '../dashboard-pages/AssistantPage';

export default function DashboardAssistant() {
  return (
    <DashboardLayout>
      <AssistantPage />
    </DashboardLayout>
  );
}

