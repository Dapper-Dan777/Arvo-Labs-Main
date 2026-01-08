import { Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type TimeRange = "today" | "week" | "month" | "year" | "all";

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
  variant?: "default" | "compact";
}

const timeRangeLabels: Record<TimeRange, string> = {
  today: "Heute",
  week: "Diese Woche",
  month: "Dieser Monat",
  year: "Letztes Jahr",
  all: "Alle",
};

export function TimeRangeFilter({
  value,
  onChange,
  className,
  variant = "default",
}: TimeRangeFilterProps) {
  if (variant === "compact") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("w-[140px] h-8", className)}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeRangeLabels[value]}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(timeRangeLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[160px]", className)}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{timeRangeLabels[value]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(timeRangeLabels).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Hilfsfunktion zum Berechnen von Datumsbereichen
 */
export function getTimeRangeDates(range: TimeRange): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start: Date;

  switch (range) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      break;
    case "week":
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Montag als Wochenstart
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff, 0, 0, 0, 0);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    case "all":
    default:
      start = new Date(0); // Beginn der Zeit
      break;
  }

  return { start, end };
}

