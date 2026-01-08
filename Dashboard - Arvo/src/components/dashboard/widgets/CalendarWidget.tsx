import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { WidgetCard } from "../WidgetCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Mock events
  const events = [
    { day: 5, title: "Team Meeting" },
    { day: 12, title: "Deadline" },
    { day: 20, title: "Review" },
  ];
  
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  const hasEvent = (day: number) => {
    return events.some(e => e.day === day);
  };
  
  const getEventForDay = (day: number) => {
    return events.find(e => e.day === day);
  };
  
  return (
    <WidgetCard
      title="Kalender"
      icon={<Calendar className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToPreviousMonth}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">
              {monthNames[month]} {year}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={goToToday}
            >
              Heute
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToNextMonth}
            aria-label="Nächster Monat"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const event = getEventForDay(day);
              const todayClass = isToday(day);
              
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-md text-xs transition-colors",
                    todayClass
                      ? "bg-primary text-primary-foreground font-semibold"
                      : hasEvent(day)
                      ? "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                      : "hover:bg-muted cursor-pointer"
                  )}
                  title={event?.title}
                >
                  <span>{day}</span>
                  {event && (
                    <div className="h-1 w-1 rounded-full bg-primary mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Events List */}
        {events.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">Kommende Ereignisse</p>
            {events.map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-medium">{event.day}. {monthNames[month]}</span>
                <span className="text-muted-foreground">{event.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetCard>
  );
}






