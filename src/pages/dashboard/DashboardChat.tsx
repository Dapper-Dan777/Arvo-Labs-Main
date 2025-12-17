import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import ChatPage from '../dashboard-pages/ChatPage';

export default function DashboardChat() {
  return (
    <DashboardLayout>
      <ChatPage />
    </DashboardLayout>
  );
}

