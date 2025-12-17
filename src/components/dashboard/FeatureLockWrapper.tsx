import React, { useState } from 'react';
import { useAccessControl } from '@/hooks/useAccessControl';
import { UpgradeModal } from './UpgradeModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { FeatureId } from '@/config/access';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface FeatureLockWrapperProps {
  feature: FeatureId;
  children: React.ReactNode;
  className?: string;
  showLockIcon?: boolean;
  disabled?: boolean;
}

/**
 * Wrapper-Komponente, die Features basierend auf Zugriffsrechten sperrt/entsperrt
 */
export function FeatureLockWrapper({
  feature,
  children,
  className,
  showLockIcon = true,
  disabled = false,
}: FeatureLockWrapperProps) {
  const { canAccess, getRequiredPlan } = useAccessControl();
  const { t } = useLanguage();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  
  const hasAccess = canAccess(feature);
  const requiredPlan = getRequiredPlan(feature);
  const featureName = t.dashboard.features[feature] || feature;
  
  const handleClick = (e: React.MouseEvent) => {
    if (!hasAccess && !disabled) {
      e.preventDefault();
      e.stopPropagation();
      setUpgradeModalOpen(true);
    }
  };
  
  if (hasAccess && !disabled) {
    return <>{children}</>;
  }
  
  return (
    <>
      <div
        className={cn(
          'relative',
          !hasAccess && 'opacity-60 cursor-not-allowed',
          className
        )}
        onClick={handleClick}
        title={!hasAccess ? t.dashboard.upgrade.featureLocked : undefined}
      >
        {children}
        {!hasAccess && showLockIcon && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-2 p-4">
              <Lock className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center">
                {t.dashboard.upgrade.clickToUpgrade}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        feature={featureName}
        requiredPlan={requiredPlan}
      />
    </>
  );
}

