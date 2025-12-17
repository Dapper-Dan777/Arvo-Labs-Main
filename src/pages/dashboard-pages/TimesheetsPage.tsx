import React, { useState } from 'react';
import { Clock, Plus, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTimeEntries, createTimeEntry, type TimeEntry } from '@/lib/supabase-queries';
import { toast } from '@/hooks/use-toast';
import { TimeChart } from '@/components/timesheets/TimeChart';

// ============================================================
// TIMESHEETS PAGE
// Zeiterfassung mit Buchungen - Supabase-Integration
// ============================================================

type TimeRange = 'day' | 'week' | 'month' | 'year';

const TimesheetsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [newEntry, setNewEntry] = useState({
    project: '',
    duration: '',
    description: '',
  });
  const queryClient = useQueryClient();

  // Fetch time entries
  const { data: timeEntries = [], isLoading, refetch, error } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: () => getTimeEntries(),
    retry: 1, // Only retry once
    retryOnMount: false, // Don't retry on mount if it failed before
  });

  // Create time entry mutation
  const createMutation = useMutation({
    mutationFn: createTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      setIsDialogOpen(false);
      setNewEntry({ project: '', duration: '', description: '' });
    },
  });

  const handleSubmit = async () => {
    if (!newEntry.project.trim() || !newEntry.duration.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte fülle alle Pflichtfelder aus.',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      date: new Date().toISOString().split('T')[0],
      project: newEntry.project,
      duration: newEntry.duration,
      description: newEntry.description || undefined,
    });
  };

  // Calculate stats
  const todayEntries = timeEntries.filter(
    entry => entry.date === new Date().toISOString().split('T')[0]
  );
  const todayTotal = todayEntries.reduce((sum, entry) => {
    const match = entry.duration.match(/(\d+)h\s*(\d+)m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return sum + hours * 60 + minutes;
    }
    return sum;
  }, 0);

  const todayHours = Math.floor(todayTotal / 60);
  const todayMinutes = todayTotal % 60;

  // Week calculation (simplified)
  const weekTotal = timeEntries.slice(0, 7).reduce((sum, entry) => {
    const match = entry.duration.match(/(\d+)h\s*(\d+)m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return sum + hours * 60 + minutes;
    }
    return sum;
  }, 0);

  const weekHours = Math.floor(weekTotal / 60);
  const weekMinutes = weekTotal % 60;

  // Group entries by date
  const groupedEntries = timeEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Aktualisiert',
      description: 'Zeitbuchungen wurden aktualisiert.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex items-center justify-center py-12">
          <Clock className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show error state only for critical errors (not for missing table - we use mock data)
  if (error && !error.message?.includes('time_entries') && !error.message?.includes('schema cache')) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-12 h-12 mb-4 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Fehler beim Laden</h2>
          <p className="text-muted-foreground mb-4">
            Die Zeitbuchungen konnten nicht geladen werden.
          </p>
          <div className="text-sm text-muted-foreground space-y-2 mb-4">
            <p>Mögliche Ursachen:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Supabase ist nicht konfiguriert (Umgebungsvariablen fehlen)</li>
              <li>Netzwerkfehler</li>
            </ul>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Zeiterfassung</h1>
          <p className="text-muted-foreground mt-1">
            {timeEntries.length} erfasste Buchungen
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            aria-label="Aktualisieren"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Neue Buchung</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Neue Zeitbuchung</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Projekt *</label>
                  <Input
                    placeholder="z.B. Arvo Labs Dashboard"
                    value={newEntry.project}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, project: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Dauer *</label>
                  <Input
                    placeholder="z.B. 2h 30m"
                    value={newEntry.duration}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Beschreibung</label>
                  <Input
                    placeholder="Was hast du gemacht?"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Wird gespeichert...' : 'Buchung speichern'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground">Heute</p>
          <p className="text-2xl font-bold text-foreground">
            {todayHours}h {todayMinutes}m
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground">Diese Woche</p>
          <p className="text-2xl font-bold text-foreground">
            {weekHours}h {weekMinutes}m
          </p>
        </div>
      </div>

      {/* Time Chart */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Arbeitszeit-Übersicht</h2>
          {(!import.meta.env.VITE_SUPABASE_URL || timeEntries.length === 0) && (
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              Demo-Daten
            </div>
          )}
        </div>
        <TimeChart
          entries={timeEntries}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>
      
      {/* Entries by Date */}
      {Object.keys(groupedEntries).length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Noch keine Zeitbuchungen</p>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle deine erste Buchung mit dem Button oben
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([date, entries]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {new Date(date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl',
                      'bg-card border border-border',
                      'transition-all duration-200',
                      'hover:border-primary/30'
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{entry.project}</p>
                      <p className="text-sm text-muted-foreground">{entry.duration}</p>
                      {entry.description && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.description}</p>
                      )}
                    </div>
                    
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500">
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimesheetsPage;
