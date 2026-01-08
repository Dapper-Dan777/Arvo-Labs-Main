"use client";

import { EnterpriseTeamDashboard } from "../_components/EnterpriseTeamDashboard";
import { useEffect } from "react";

export default function TeamEnterpriseDashboardPage() {
  useEffect(() => {
    console.log("[TeamEnterpriseDashboardPage] Component mounted");
  }, []);

  return (
    <div className="w-full h-full" style={{ backgroundColor: 'transparent' }}>
      <EnterpriseTeamDashboard />
    </div>
  );
}
