"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { DashboardContext } from "../config";

const TeamDashboardContext = createContext<DashboardContext | undefined>(undefined);

interface TeamDashboardProviderProps {
  children: ReactNode;
  plan: DashboardContext["plan"];
  accountType: DashboardContext["accountType"];
}

export function TeamDashboardProvider({
  children,
  plan,
  accountType,
}: TeamDashboardProviderProps) {
  const value: DashboardContext = {
    plan,
    accountType,
  };

  return (
    <TeamDashboardContext.Provider value={value}>
      {children}
    </TeamDashboardContext.Provider>
  );
}

export function useTeamDashboard() {
  const context = useContext(TeamDashboardContext);
  if (!context) {
    throw new Error("useTeamDashboard must be used within TeamDashboardProvider");
  }
  return context;
}


