import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TodayCard } from '@/components/dashboard/TodayCard';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WidgetManager } from '@/components/widgets/WidgetManager';
import { SettingsDialog } from '@/components/dashboard/SettingsDialog';
import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlanDebugInfo } from '@/components/dashboard/PlanDebugInfo';

function DashboardEnterpriseContent() {
  const { user } = useUser();
  const { t } = useLanguage();
  const userName = user?.firstName || t.dashboard.user;
  const userFullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.emailAddresses?.[0]?.emailAddress || t.dashboard.user;

  return (
    <div className="space-y-6 animate-fade-in">
      <PlanDebugInfo />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t.dashboard.greeting}, {userFullName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.welcomeBack}, {userName}. {t.dashboard.overview}
          </p>
        </div>
        <div className="flex gap-2">
          <SettingsDialog
            trigger={
              <Button 
                variant="outline" 
                className="gap-2 border-border hover:border-primary hover:text-primary transition-all"
              >
                <Settings2 className="w-4 h-4" />
                {t.dashboard.settings.title}
              </Button>
            }
          />
          <WidgetManager>
            <Button 
              variant="outline" 
              className="gap-2 border-border hover:border-primary hover:text-primary transition-all"
            >
              <Settings2 className="w-4 h-4" />
              {t.dashboard.manageCards}
            </Button>
          </WidgetManager>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t.dashboard.completedTasks}
          value={12}
          description={t.dashboard.thisWeek}
          icon={CheckCircle2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title={t.dashboard.pending}
          value={5}
          description={t.dashboard.dueToday}
          icon={Clock}
        />
        <StatsCard
          title={t.dashboard.teamActivity}
          value="87%"
          description={t.dashboard.engagementRate}
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title={t.dashboard.activeMembers}
          value={24}
          description={t.dashboard.inYourWorkspace}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayCard userName={userName} />
          <TasksCard />
        </div>

        <div className="space-y-6">
          <QuickActionsCard />
          <ActivityCard />
        </div>
      </div>
    </div>
  );
}

export default function DashboardEnterprise() {
  return (
    <DashboardLayout>
      <DashboardEnterpriseContent />
    </DashboardLayout>
  );
}

