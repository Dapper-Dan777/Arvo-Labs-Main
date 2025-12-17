import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlanType } from '@/config/access';
import { ArrowRight, Lock } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  requiredPlan?: PlanType | 'team' | null;
}

export function UpgradeModal({ 
  open, 
  onOpenChange, 
  feature, 
  requiredPlan 
}: UpgradeModalProps) {
  const { t } = useLanguage();
  const { plan, accountType } = useAccessControl();
  
  const handleUpgrade = () => {
    // TODO: Link zu Upgrade-Seite oder Checkout
    window.location.href = '/pricing';
  };
  
  const getUpgradeText = () => {
    if (!requiredPlan) {
      return t.dashboard.upgrade.notAvailable;
    }
    
    if (requiredPlan === 'team') {
      return t.dashboard.upgrade.requiresTeam;
    }
    
    const planNames: Record<PlanType, string> = {
      starter: t.dashboard.plans.starter,
      pro: t.dashboard.plans.pro,
      enterprise: t.dashboard.plans.enterprise,
      individual: t.dashboard.plans.individual,
    };
    
    return t.dashboard.upgrade.requiresPlan.replace('{plan}', planNames[requiredPlan]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <DialogTitle className="text-xl">
              {t.dashboard.upgrade.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {t.dashboard.upgrade.description.replace('{feature}', feature)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {t.dashboard.upgrade.currentPlan}
            </p>
            <p className="font-semibold">
              {plan === 'starter' && t.dashboard.plans.starter}
              {plan === 'pro' && t.dashboard.plans.pro}
              {plan === 'enterprise' && t.dashboard.plans.enterprise}
              {plan === 'individual' && t.dashboard.plans.individual}
              {accountType === 'team' && ` (${t.dashboard.upgrade.team})`}
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-muted-foreground mb-2">
              {t.dashboard.upgrade.required}
            </p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400">
              {getUpgradeText()}
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t.dashboard.upgrade.cancel}
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {t.dashboard.upgrade.upgrade}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

