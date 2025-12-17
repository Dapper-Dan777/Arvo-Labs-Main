import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  loadUserWidgets, 
  saveUserWidgets, 
  activateWidget, 
  deactivateWidget,
  getActiveWidgets,
  getAvailableWidgets,
  type UserWidgetConfig 
} from '@/lib/widgetStorage';
import { type Widget } from '@/config/widgets';

// ============================================================
// WIDGET CONTEXT
// State-Management für Widget-Konfiguration
// ============================================================

interface WidgetContextType {
  activeWidgets: Widget[];
  availableWidgets: Widget[];
  config: UserWidgetConfig | null;
  isLoading: boolean;
  addWidget: (widgetId: string) => void;
  removeWidget: (widgetId: string) => void;
  refreshWidgets: () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

interface WidgetProviderProps {
  children: ReactNode;
  userId?: string;
}

export function WidgetProvider({ children, userId }: WidgetProviderProps) {
  const [config, setConfig] = useState<UserWidgetConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initial load
  useEffect(() => {
    refreshWidgets();
  }, [userId]);
  
  const refreshWidgets = () => {
    setIsLoading(true);
    const loadedConfig = loadUserWidgets(userId);
    setConfig(loadedConfig);
    setIsLoading(false);
  };
  
  const addWidget = (widgetId: string) => {
    const newConfig = activateWidget(userId, widgetId);
    setConfig(newConfig);
  };
  
  const removeWidget = (widgetId: string) => {
    const newConfig = deactivateWidget(userId, widgetId);
    setConfig(newConfig);
  };
  
  const activeWidgets = config ? getActiveWidgets(userId) : [];
  const availableWidgets = config ? getAvailableWidgets(userId) : [];
  
  return (
    <WidgetContext.Provider value={{
      activeWidgets,
      availableWidgets,
      config,
      isLoading,
      addWidget,
      removeWidget,
      refreshWidgets,
    }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}
