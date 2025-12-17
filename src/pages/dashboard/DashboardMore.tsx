import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import MorePage from '../dashboard-pages/MorePage';
import { useParams } from 'react-router-dom';
import MoreSectionPage from '../dashboard-pages/MoreSectionPage';

export default function DashboardMore() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  
  if (sectionId) {
    return (
      <DashboardLayout>
        <MoreSectionPage />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <MorePage />
    </DashboardLayout>
  );
}

