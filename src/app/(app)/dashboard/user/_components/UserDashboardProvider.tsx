"use client";

import React, { createContext, useContext } from 'react';
import type { Plan } from '../config';

interface UserDashboardContextType {
  plan: Plan;
  accountType: "user";
}

const UserDashboardContext = createContext<UserDashboardContextType | undefined>(undefined);

interface UserDashboardProviderProps {
  children: React.ReactNode;
  plan: Plan;
}

export function UserDashboardProvider({ children, plan }: UserDashboardProviderProps) {
  return (
    <UserDashboardContext.Provider value={{ plan, accountType: "user" }}>
      {children}
    </UserDashboardContext.Provider>
  );
}

export function useUserDashboard() {
  const context = useContext(UserDashboardContext);
  if (context === undefined) {
    throw new Error('useUserDashboard must be used within a UserDashboardProvider');
  }
  return context;
}

