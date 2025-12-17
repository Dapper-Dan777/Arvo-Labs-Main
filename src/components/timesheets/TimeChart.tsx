import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TimeEntry } from '@/lib/supabase-queries';

type TimeRange = 'day' | 'week' | 'month' | 'year';

interface TimeChartProps {
  entries: TimeEntry[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

// Farbpalette für verschiedene Tage/Wochen/Monate
const COLOR_PALETTE = [
  'bg-blue-500',      // Index 0
  'bg-green-500',     // Index 1
  'bg-purple-500',    // Index 2
  'bg-orange-500',    // Index 3
  'bg-pink-500',      // Index 4
  'bg-cyan-500',      // Index 5
  'bg-yellow-500',    // Index 6
  'bg-indigo-500',    // Index 7
  'bg-red-500',       // Index 8
  'bg-teal-500',      // Index 9
  'bg-amber-500',     // Index 10
  'bg-emerald-500',   // Index 11
  'bg-violet-500',    // Index 12
  'bg-rose-500',      // Index 13
  'bg-sky-500',       // Index 14
];

// Wochentag-Farben (Mo-So) - für bessere Erkennbarkeit
const WEEKDAY_COLORS = [
  'bg-blue-500',      // Montag
  'bg-green-500',     // Dienstag
  'bg-purple-500',    // Mittwoch
  'bg-orange-500',    // Donnerstag
  'bg-pink-500',      // Freitag
  'bg-cyan-500',      // Samstag
  'bg-yellow-500',    // Sonntag
];

export function TimeChart({ entries, timeRange, onTimeRangeChange }: TimeChartProps) {
  // Parse duration string (e.g., "4h 30m") to minutes
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)h\s*(\d+)m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  };

  // Get color based on date and time range
  const getColor = (date: Date, index: number): string => {
    if (timeRange === 'day') {
      // Für Tag-Ansicht: Farbe basierend auf Wochentag
      const dayOfWeek = date.getDay(); // 0 = Sonntag, 1 = Montag, etc.
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Montag, 6 = Sonntag
      return WEEKDAY_COLORS[adjustedDay] || COLOR_PALETTE[index % COLOR_PALETTE.length];
    } else if (timeRange === 'week') {
      // Für Woche-Ansicht: Farbe basierend auf Wochentag der Woche
      const dayOfWeek = date.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      return WEEKDAY_COLORS[adjustedDay] || COLOR_PALETTE[index % COLOR_PALETTE.length];
    } else if (timeRange === 'month') {
      // Für Monat-Ansicht: Farbe basierend auf Monat (rotierend)
      return COLOR_PALETTE[date.getMonth() % COLOR_PALETTE.length];
    } else if (timeRange === 'year') {
      // Für Jahr-Ansicht: Farbe basierend auf Monat
      return COLOR_PALETTE[date.getMonth() % COLOR_PALETTE.length];
    }
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
  };

  // Generate all periods for the selected time range (even without data)
  const generateAllPeriods = (): { label: string; date: Date; value: number }[] => {
    const now = new Date();
    const periods: { label: string; date: Date; value: number }[] = [];

    switch (timeRange) {
      case 'day': {
        // Letzte 7 Tage
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push({
            label: date.toLocaleDateString('de-DE', { 
              weekday: 'short',
              day: '2-digit', 
              month: '2-digit' 
            }),
            date,
            value: 0,
          });
        }
        break;
      }
      case 'week': {
        // Letzte 4 Wochen
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (i * 7) - now.getDay() + 1); // Montag der Woche
          periods.push({
            label: `KW ${getWeekNumber(weekStart)}`,
            date: weekStart,
            value: 0,
          });
        }
        break;
      }
      case 'month': {
        // Letzte 6 Monate
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({
            label: date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }),
            date,
            value: 0,
          });
        }
        break;
      }
      case 'year': {
        // Letzte 12 Monate
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({
            label: date.toLocaleDateString('de-DE', { month: 'short' }),
            date,
            value: 0,
          });
        }
        break;
      }
    }

    return periods;
  };

  // Group and aggregate data based on time range
  const chartData = useMemo(() => {
    // Generate all periods first
    const allPeriods = generateAllPeriods();
    const dataMap = new Map<string, { label: string; value: number; date: Date }>();

    // Initialize all periods with 0
    allPeriods.forEach(period => {
      dataMap.set(period.label, { ...period, value: 0 });
    });

    // Fill in actual data
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const minutes = parseDuration(entry.duration);
      let key: string;

      switch (timeRange) {
        case 'day': {
          const dayKey = entryDate.toLocaleDateString('de-DE', { 
            weekday: 'short',
            day: '2-digit', 
            month: '2-digit' 
          });
          key = dayKey;
          break;
        }
        case 'week': {
          const weekStart = new Date(entryDate);
          weekStart.setDate(entryDate.getDate() - entryDate.getDay() + 1); // Montag
          key = `KW ${getWeekNumber(weekStart)}`;
          break;
        }
        case 'month': {
          key = entryDate.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
          break;
        }
        case 'year': {
          key = entryDate.toLocaleDateString('de-DE', { month: 'short' });
          break;
        }
        default:
          key = entryDate.toLocaleDateString('de-DE');
      }

      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        existing.value += minutes;
      } else {
        // Fallback: add if not in predefined periods
        dataMap.set(key, {
          label: key,
          value: minutes,
          date: entryDate,
        });
      }
    });

    // Convert to array and sort by date
    return Array.from(dataMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [entries, timeRange]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const maxHours = Math.ceil(maxValue / 60);

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['day', 'week', 'month', 'year'] as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimeRangeChange(range)}
            className="capitalize"
          >
            {range === 'day' && 'Tag'}
            {range === 'week' && 'Woche'}
            {range === 'month' && 'Monat'}
            {range === 'year' && 'Jahr'}
          </Button>
        ))}
      </div>

      {/* Chart - Always displayed */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2 p-4 rounded-xl bg-card border border-border" style={{ 
          minHeight: '256px'
        }}>
          {chartData.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const color = getColor(item.date, index);
            const hasData = item.value > 0;

            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all cursor-pointer group-hover:opacity-90 group-hover:scale-105',
                      hasData ? color : 'bg-muted',
                      !hasData && 'opacity-30'
                    )}
                    style={{ 
                      height: `${Math.max(height, 2)}%`, 
                      minHeight: hasData ? '4px' : '2px' 
                    }}
                    title={`${item.label}: ${hasData ? formatHours(item.value) : 'Keine Daten'}`}
                  />
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                    {hasData ? formatHours(item.value) : 'Keine Daten'}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground text-center truncate w-full">
                  {item.label.length > 12 ? item.label.substring(0, 12) + '...' : item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>0h</span>
          <span>{maxHours}h</span>
        </div>

        {/* Color Legend */}
        {timeRange === 'day' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border flex-wrap">
            <span className="font-medium">Wochentage:</span>
            <div className="flex gap-2 flex-wrap">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, idx) => (
                <div key={day} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded', WEEKDAY_COLORS[idx])} />
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {timeRange === 'week' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border flex-wrap">
            <span className="font-medium">Wochen:</span>
            <div className="flex gap-2 flex-wrap">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded', getColor(item.date, idx))} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {timeRange === 'month' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border flex-wrap">
            <span className="font-medium">Monate:</span>
            <div className="flex gap-2 flex-wrap">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded', getColor(item.date, idx))} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {timeRange === 'year' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border flex-wrap">
            <span className="font-medium">Monate:</span>
            <div className="flex gap-2 flex-wrap">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded', getColor(item.date, idx))} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
