import { Plug, CheckCircle, AlertTriangle } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { cn } from "@/lib/utils";
import { useIntegrations } from "@/contexts/IntegrationContext";
import { IntegrationIcon } from "@/components/integrations/IntegrationIcons";
import { EmptyState } from "../EmptyState";
import { WidgetSkeleton } from "../WidgetSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const statusIconMap: Record<string, string> = {
  slack: "💬",
  notion: "📝",
  stripe: "💳",
  gmail: "📧",
  google_sheets: "📊",
  webhook: "🔗",
  webhooks: "🔗",
};

export function IntegrationsHealth() {
  const navigate = useNavigate();
  const { integrations } = useIntegrations();
  const isLoading = false; // TODO: Replace with actual loading state
  
  // Konvertiere Integration-Status zu Health-Status
  const healthyIntegrations = integrations.filter((i) => i.status === "connected");
  const warningIntegrations = integrations.filter((i) => i.status === "warning");
  
  const healthyCount = healthyIntegrations.length;
  const total = integrations.length;
  const percentage = total > 0 ? Math.round((healthyCount / total) * 100) : 0;
  
  // Zeige nur die ersten 4 Integrationen
  const displayedIntegrations = integrations.slice(0, 4);

  // Calculate circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  if (isLoading) {
    return <WidgetSkeleton rows={4} />;
  }

  return (
    <WidgetCard
      title="Integrations"
      icon={<Plug className="h-5 w-5" />}
      badge={{
        label: total > 0 ? `${healthyCount}/${total} healthy` : "No integrations",
        variant: total === 0 ? "default" : healthyCount === total ? "success" : "warning",
      }}
    >
      {integrations.length > 0 ? (
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{percentage}%</span>
          </div>
        </div>

        {/* Integration List */}
        <div className="flex-1 space-y-2">
          {displayedIntegrations.map((integration, index) => {
            const status = integration.status === "connected" ? "healthy" : integration.status === "warning" ? "warning" : "error";
            return (
              <div
                key={integration.id}
                className="flex items-center justify-between animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-2">
                  <IntegrationIcon 
                    name={integration.icon} 
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">{integration.name}</span>
                </div>
                {status === "healthy" ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : status === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      ) : (
        <EmptyState
          icon={Plug}
          title="No Integrations Connected"
          description="Connect integrations to automate workflows and sync data across your apps."
          callToAction={
            <Button size="sm" onClick={() => navigate("/integrations")}>
              Connect Integration
            </Button>
          }
        />
      )}
    </WidgetCard>
  );
}
