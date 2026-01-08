import { Clock, Calendar, Mail, FileText } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../EmptyState";

const triggers = [
  {
    id: 1,
    name: "Marketing Campaign",
    type: "scheduled",
    icon: Mail,
    countdown: "1h 23m",
    time: "Today, 3:00 PM",
  },
  {
    id: 2,
    name: "Invoice Reminder",
    type: "scheduled",
    icon: FileText,
    countdown: "4h 12m",
    time: "Today, 6:00 PM",
  },
  {
    id: 3,
    name: "Weekly Report",
    type: "recurring",
    icon: Calendar,
    countdown: "18h 45m",
    time: "Tomorrow, 9:00 AM",
  },
];

export function NextTriggers() {
  const navigate = useNavigate();
  return (
    <WidgetCard
      title="Next Triggers"
      icon={<Clock className="h-5 w-5" />}
      footer={
        <button 
          className="text-xs text-primary hover:underline font-medium"
          onClick={() => navigate("/triggers")}
        >
          View All Triggers →
        </button>
      }
    >
      {triggers.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Keine anstehenden Trigger"
          description="Es sind derzeit keine geplanten Trigger aktiv."
        />
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger, index) => {
            const TriggerIcon = trigger.icon;
            return (
              <div
                key={trigger.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <TriggerIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{trigger.name}</p>
                  <p className="text-xs text-muted-foreground">{trigger.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-primary">
                    {trigger.countdown}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
