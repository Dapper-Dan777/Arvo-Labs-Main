import { Users } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../EmptyState";

const activities = [
  {
    id: 1,
    user: { name: "Adrian Thomé", initials: "AT", avatar: "" },
    action: "created",
    target: "Marketing Flow",
    time: "2 min ago",
  },
  {
    id: 2,
    user: { name: "Sarah Chen", initials: "SC", avatar: "" },
    action: "modified",
    target: "Invoice Automation",
    time: "15 min ago",
  },
  {
    id: 3,
    user: { name: "Max Weber", initials: "MW", avatar: "" },
    action: "deployed",
    target: "Email Campaign",
    time: "1 hour ago",
  },
  {
    id: 4,
    user: { name: "Lisa Park", initials: "LP", avatar: "" },
    action: "paused",
    target: "Data Sync",
    time: "2 hours ago",
  },
];

const actionColors = {
  created: "text-primary",
  modified: "text-primary",
  deployed: "text-purple-500",
  paused: "text-warning",
};

export function TeamActivity() {
  const navigate = useNavigate();
  return (
    <WidgetCard
      title="Team Activity"
      icon={<Users className="h-5 w-5" />}
      footer={
        <button 
          className="text-xs text-primary hover:underline font-medium"
          onClick={() => navigate("/team")}
        >
          View All Activity →
        </button>
      }
    >
      {activities.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Keine Team-Aktivitäten"
          description="Es gibt derzeit keine Aktivitäten im Team."
        />
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span
                    className={
                      actionColors[activity.action as keyof typeof actionColors]
                    }
                  >
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
