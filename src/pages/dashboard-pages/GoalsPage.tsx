import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle, Edit2, Trash2, ChevronDown, ChevronRight, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

// ============================================================
// GOALS PAGE
// Ziele-Verwaltung mit Unterzielen
// ============================================================

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  subGoals: SubGoal[];
  createdAt: string;
  updatedAt: string;
}

const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Q1 2025 Strategie finalisieren',
    description: 'Alle strategischen Ziele für Q1 definieren und dokumentieren',
    dueDate: '2025-01-31',
    completed: false,
    subGoals: [
      { id: '1-1', title: 'Marktanalyse abschließen', completed: true, createdAt: '2024-12-01' },
      { id: '1-2', title: 'Budget planen', completed: false, createdAt: '2024-12-01' },
      { id: '1-3', title: 'Team-Ziele definieren', completed: false, createdAt: '2024-12-01' },
    ],
    createdAt: '2024-12-01',
    updatedAt: '2024-12-15',
  },
  {
    id: '2',
    title: 'Neue Features entwickeln',
    description: 'Dashboard-Features implementieren',
    dueDate: '2025-02-28',
    completed: false,
    subGoals: [
      { id: '2-1', title: 'Design-System erweitern', completed: true, createdAt: '2024-12-05' },
      { id: '2-2', title: 'API-Integration', completed: false, createdAt: '2024-12-05' },
    ],
    createdAt: '2024-12-05',
    updatedAt: '2024-12-14',
  },
  {
    id: '3',
    title: 'Team-Workshop durchführen',
    description: 'Q4 Review und Q1 Planning',
    completed: true,
    subGoals: [],
    createdAt: '2024-11-20',
    updatedAt: '2024-12-10',
  },
];

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['1', '2']));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', dueDate: '' });
  const [newSubGoal, setNewSubGoal] = useState<Record<string, string>>({});

  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Titel ein.',
        variant: 'destructive',
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || undefined,
      dueDate: newGoal.dueDate || undefined,
      completed: false,
      subGoals: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setGoals(prev => [goal, ...prev]);
    setIsCreateDialogOpen(false);
    setNewGoal({ title: '', description: '', dueDate: '' });
    toast({
      title: 'Ziel erstellt',
      description: `"${goal.title}" wurde erstellt.`,
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      dueDate: goal.dueDate || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingGoal || !newGoal.title.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Titel ein.',
        variant: 'destructive',
      });
      return;
    }

    setGoals(prev => prev.map(g =>
      g.id === editingGoal.id
        ? {
            ...g,
            title: newGoal.title,
            description: newGoal.description || undefined,
            dueDate: newGoal.dueDate || undefined,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : g
    ));

    setIsEditDialogOpen(false);
    setEditingGoal(null);
    setNewGoal({ title: '', description: '', dueDate: '' });
    toast({
      title: 'Ziel aktualisiert',
      description: 'Das Ziel wurde erfolgreich aktualisiert.',
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast({
      title: 'Ziel gelöscht',
      description: 'Das Ziel wurde gelöscht.',
    });
  };

  const handleToggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed, updatedAt: new Date().toISOString().split('T')[0] } : g
    ));
  };

  const handleAddSubGoal = (goalId: string) => {
    const title = newSubGoal[goalId]?.trim();
    if (!title) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Titel ein.',
        variant: 'destructive',
      });
      return;
    }

    const subGoal: SubGoal = {
      id: `${goalId}-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? { ...g, subGoals: [...g.subGoals, subGoal], updatedAt: new Date().toISOString().split('T')[0] }
        : g
    ));

    setNewSubGoal(prev => ({ ...prev, [goalId]: '' }));
    toast({
      title: 'Unterziel hinzugefügt',
      description: `"${title}" wurde hinzugefügt.`,
    });
  };

  const handleToggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? {
            ...g,
            subGoals: g.subGoals.map(sg =>
              sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
            ),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : g
    ));
  };

  const handleEditSubGoal = (goalId: string, subGoalId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? {
            ...g,
            subGoals: g.subGoals.map(sg =>
              sg.id === subGoalId ? { ...sg, title: newTitle } : sg
            ),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : g
    ));
  };

  const handleDeleteSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? {
            ...g,
            subGoals: g.subGoals.filter(sg => sg.id !== subGoalId),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : g
    ));
    toast({
      title: 'Unterziel gelöscht',
      description: 'Das Unterziel wurde gelöscht.',
    });
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ziele</h1>
          <p className="text-muted-foreground mt-1">
            {completedGoals} von {totalGoals} Zielen erreicht ({progress}%)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ziel erstellen</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Ziel</DialogTitle>
              <DialogDescription>
                Erstelle ein neues Ziel und füge Unterziele hinzu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Titel *</Label>
                <Input
                  placeholder="z.B. Q1 Strategie finalisieren"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  placeholder="Beschreibe dein Ziel..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fälligkeitsdatum</Label>
                <Input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Ziel erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Fortschritt</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Noch keine Ziele</p>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle dein erstes Ziel mit dem Button oben
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const isExpanded = expandedGoals.has(goal.id);
            const completedSubGoals = goal.subGoals.filter(sg => sg.completed).length;
            const subGoalProgress = goal.subGoals.length > 0
              ? Math.round((completedSubGoals / goal.subGoals.length) * 100)
              : 0;

            return (
              <Card key={goal.id} className={cn(goal.completed && 'opacity-60')}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleToggleGoal(goal.id)}
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <CardTitle className={cn(goal.completed && 'line-through text-muted-foreground')}>
                        {goal.title}
                      </CardTitle>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {goal.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(goal.dueDate).toLocaleDateString('de-DE')}
                          </div>
                        )}
                        {goal.subGoals.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {completedSubGoals}/{goal.subGoals.length} Unterziele
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleGoal(goal.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditGoal(goal)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="space-y-4">
                    {/* Sub Goals Progress */}
                    {goal.subGoals.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">Unterziele</span>
                          <span className="text-xs text-muted-foreground">{subGoalProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/50 transition-all"
                            style={{ width: `${subGoalProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sub Goals List */}
                    <div className="space-y-2">
                      {goal.subGoals.map((subGoal) => (
                        <div
                          key={subGoal.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={subGoal.completed}
                            onCheckedChange={() => handleToggleSubGoal(goal.id, subGoal.id)}
                          />
                          <Input
                            value={subGoal.title}
                            onChange={(e) => handleEditSubGoal(goal.id, subGoal.id, e.target.value)}
                            onBlur={(e) => {
                              if (!e.target.value.trim()) {
                                handleEditSubGoal(goal.id, subGoal.id, subGoal.title);
                              }
                            }}
                            className={cn(
                              "flex-1 h-8 text-sm",
                              subGoal.completed && "line-through text-muted-foreground"
                            )}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteSubGoal(goal.id, subGoal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add Sub Goal */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Input
                        placeholder="Unterziel hinzufügen..."
                        value={newSubGoal[goal.id] || ''}
                        onChange={(e) => setNewSubGoal(prev => ({ ...prev, [goal.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubGoal(goal.id);
                          }
                        }}
                        className="h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddSubGoal(goal.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ziel bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Details deines Ziels
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Titel *</Label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Fälligkeitsdatum</Label>
              <Input
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Speichern
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingGoal(null);
                }}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsPage;

