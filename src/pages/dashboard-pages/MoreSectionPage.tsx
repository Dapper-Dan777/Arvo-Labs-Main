import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getMoreSectionById } from '@/config/moreSections';

// ============================================================
// MORE SECTION PAGE
// Dynamische Seite für alle More-Bereiche
// ============================================================

// Dummy-Daten für Ziele
const DUMMY_GOALS = [
  { id: '1', title: '10 Workflows automatisieren', progress: 70, target: 10, current: 7 },
  { id: '2', title: 'Team-Produktivität um 20% steigern', progress: 45, target: 20, current: 9 },
  { id: '3', title: 'Dokumentation vervollständigen', progress: 90, target: 100, current: 90 },
];

// Dummy-Daten für Automatisierungen
const DUMMY_AUTOMATIONS = [
  { id: '1', name: 'E-Mail zu Task', runs: 156, savedHours: 12, status: 'active' },
  { id: '2', name: 'Wöchentlicher Report', runs: 24, savedHours: 8, status: 'active' },
  { id: '3', name: 'Dokument-Archivierung', runs: 89, savedHours: 6, status: 'paused' },
];

// Dummy-Schnellaktionen
const QUICK_ACTIONS = [
  { id: '1', label: 'Neues Dokument erstellen', icon: '📄' },
  { id: '2', label: 'Meeting planen', icon: '📅' },
  { id: '3', label: 'Task hinzufügen', icon: '✓' },
  { id: '4', label: 'KI-Assistent fragen', icon: '🤖' },
];

const MoreSectionPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? getMoreSectionById(sectionId) : null;
  
  if (!section) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <Link to="/more" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Link>
        <h1 className="text-2xl font-bold">Bereich nicht gefunden</h1>
      </div>
    );
  }
  
  const Icon = section.icon;
  
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <Link to="/more" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{section.label}</h1>
            <p className="text-muted-foreground">{section.description}</p>
          </div>
        </div>
      </div>
      
      {/* Content basierend auf Section */}
      {sectionId === 'goals-progress' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Aktive Ziele</h2>
          {DUMMY_GOALS.map((goal) => (
            <div key={goal.id} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{goal.title}</p>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </div>
      )}
      
      {sectionId === 'automations' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Deine Automatisierungen</h2>
          {DUMMY_AUTOMATIONS.map((auto) => (
            <div key={auto.id} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{auto.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {auto.runs} Ausführungen · {auto.savedHours}h gespart
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  auto.status === 'active' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {auto.status === 'active' ? 'Aktiv' : 'Pausiert'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {sectionId === 'quick-actions' && (
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto py-6 flex-col gap-2 border-border hover:border-primary/50"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      )}
      
      {/* Fallback für andere Sections */}
      {!['goals-progress', 'automations', 'quick-actions'].includes(sectionId || '') && (
        <div className="p-8 rounded-xl bg-card border border-border text-center">
          <p className="text-muted-foreground">
            Dieser Bereich wird noch entwickelt.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoreSectionPage;
