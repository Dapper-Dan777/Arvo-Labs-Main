import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import DocumentsPage from '../dashboard-pages/DocumentsPage';

export default function DashboardDocuments() {
  return (
    <DashboardLayout>
      <DocumentsPage />
    </DashboardLayout>
  );
}

