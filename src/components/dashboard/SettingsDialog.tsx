import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Settings2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  trigger?: React.ReactNode;
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [defaultView, setDefaultView] = useState('dashboard');
  const [showStats, setShowStats] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('dashboardSettings', JSON.stringify({
      defaultView,
      showStats,
      showTasks,
      showActivity,
    }));

    toast({
      title: t.dashboard.settings.saved,
      description: t.dashboard.settings.savedDescription,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Settings2 className="w-4 h-4" />
            {t.dashboard.settings.title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.dashboard.settings.title}</DialogTitle>
          <DialogDescription>
            {t.dashboard.settings.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Theme Settings */}
          <div>
            <Label className="text-sm font-medium mb-3 block">{t.dashboard.settings.appearance}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t.dashboard.settings.light}</SelectItem>
                <SelectItem value="dark">{t.dashboard.settings.dark}</SelectItem>
                <SelectItem value="system">{t.dashboard.settings.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default View */}
          <div>
            <Label className="text-sm font-medium mb-3 block">{t.dashboard.settings.defaultView}</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">{t.nav.dashboards}</SelectItem>
                <SelectItem value="documents">{t.nav.documents}</SelectItem>
                <SelectItem value="timesheets">{t.nav.timesheets}</SelectItem>
                <SelectItem value="inbox">{t.nav.inbox}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Widget Visibility */}
          <div>
            <Label className="text-sm font-medium mb-3 block">{t.dashboard.settings.showWidgets}</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-stats" className="text-sm font-normal">
                  {t.dashboard.settings.statsCards}
                </Label>
                <Switch
                  id="show-stats"
                  checked={showStats}
                  onCheckedChange={setShowStats}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-tasks" className="text-sm font-normal">
                  {t.dashboard.settings.tasksCard}
                </Label>
                <Switch
                  id="show-tasks"
                  checked={showTasks}
                  onCheckedChange={setShowTasks}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-activity" className="text-sm font-normal">
                  {t.dashboard.settings.activityCard}
                </Label>
                <Switch
                  id="show-activity"
                  checked={showActivity}
                  onCheckedChange={setShowActivity}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
              {t.dashboard.settings.cancel}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t.dashboard.settings.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}





