"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type IntegrationStatus = "connected" | "disconnected" | "warning";

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: IntegrationStatus;
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    [key: string]: any;
  };
  lastSync?: string;
  config?: Record<string, any>;
}

interface IntegrationContextType {
  integrations: Integration[];
  addIntegration: (integration: Omit<Integration, "id">) => Integration;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  removeIntegration: (id: string) => void;
  getIntegration: (name: string) => Integration | undefined;
  isConnected: (name: string) => boolean;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

const initialIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates",
    icon: "slack",
    status: "connected",
    credentials: {
      accessToken: "xoxb-mock-token",
    },
    lastSync: "2 min ago",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and receive emails",
    icon: "gmail",
    status: "connected",
    credentials: {
      accessToken: "mock-gmail-token",
    },
    lastSync: "5 min ago",
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    description: "Import and export data",
    icon: "google_sheets",
    status: "connected",
    credentials: {
      accessToken: "mock-sheets-token",
    },
    lastSync: "10 min ago",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync databases and documents",
    icon: "notion",
    status: "connected",
    credentials: {
      apiKey: "mock-notion-key",
    },
    lastSync: "5 min ago",
  },
  {
    id: "webhook",
    name: "Webhooks",
    description: "Custom webhook integrations",
    icon: "webhooks",
    status: "connected",
    lastSync: "Just now",
  },
];

export function IntegrationProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  const addIntegration = (integrationData: Omit<Integration, "id">) => {
    const newIntegration: Integration = {
      ...integrationData,
      id: integrationData.name.toLowerCase().replace(/\s+/g, "_"),
    };
    setIntegrations([...integrations, newIntegration]);
    return newIntegration;
  };

  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const removeIntegration = (id: string) => {
    setIntegrations(integrations.filter(i => i.id !== id));
  };

  const getIntegration = (name: string) => {
    return integrations.find(i => i.name.toLowerCase() === name.toLowerCase());
  };

  const isConnected = (name: string) => {
    const integration = getIntegration(name);
    return integration?.status === "connected";
  };

  return (
    <IntegrationContext.Provider
      value={{
        integrations,
        addIntegration,
        updateIntegration,
        removeIntegration,
        getIntegration,
        isConnected,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
}

export function useIntegrations() {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error("useIntegrations must be used within an IntegrationProvider");
  }
  return context;
}

