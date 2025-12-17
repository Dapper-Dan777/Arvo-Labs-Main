import React from 'react';
import { Sparkles, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TodayCardProps {
  userName: string;
}

export function TodayCard({ userName }: TodayCardProps) {
  return (
    <Card className="arvo-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold">Heute bei Arvo</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ANPASSEN: Begrüßungstext hier */}
        <p className="text-muted-foreground text-sm">
          Guten Tag, {userName}! Hier ist dein täglicher Überblick über deine wichtigsten Aufgaben und Aktivitäten.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Active Workflows */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Aktive Workflows</span>
            </div>
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground mt-1">Keine laufenden Automatisierungen</p>
          </div>

          {/* Today's Focus */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Heutiger Fokus</span>
            </div>
            <p className="text-sm font-medium text-foreground">Starte mit deinen wichtigsten Tasks</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary text-xs mt-2"
            >
              Fokus festlegen →
            </Button>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Tagesübersicht starten
        </Button>
      </CardContent>
    </Card>
  );
}
