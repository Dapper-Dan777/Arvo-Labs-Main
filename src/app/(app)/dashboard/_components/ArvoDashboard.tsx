"use client";

// TODO: Hier wird der Code aus meinem Vite-Dashboard "Dashboard - Arvo" eingefügt.

type Plan = "starter" | "pro" | "enterprise" | "individual";

interface ArvoDashboardProps {
  plan: Plan;
}

export function ArvoDashboard({ plan }: ArvoDashboardProps) {
  return (
    <div className="w-full p-6 bg-card border border-border rounded-lg">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Arvo Dashboard Placeholder
        </h2>
        <p className="text-muted-foreground">
          Plan: <span className="font-medium">{plan}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Hier wird später der Code aus dem Vite-Dashboard "Dashboard - Arvo" eingefügt.
        </p>
      </div>
    </div>
  );
}


