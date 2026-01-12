"use client";

import { useState } from "react";
import { Target, Plus, Calendar, TrendingUp, CheckCircle2, Circle, Award, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: string;
  deadline: string;
  status: "active" | "completed" | "paused";
  category: "workflow" | "team" | "revenue" | "personal";
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "10 neue Workflows erstellen",
    description: "Automatisierung von wiederkehrenden Aufgaben",
    progress: 70,
    target: "10",
    deadline: "2024-02-28",
    status: "active",
    category: "workflow",
  },
  {
    id: "2",
    title: "Team auf 15 Mitglieder erweitern",
    description: "Neue Talente für das Entwicklerteam",
    progress: 80,
    target: "15",
    deadline: "2024-03-15",
    status: "active",
    category: "team",
  },
  {
    id: "3",
    title: "Monatliches Revenue-Ziel erreichen",
    description: "€50.000 monatliches Umsatzziel",
    progress: 45,
    target: "50000",
    deadline: "2024-01-31",
    status: "active",
    category: "revenue",
  },
  {
    id: "4",
    title: "Alle Integrationen testen",
    description: "Qualitätssicherung für alle API-Integrationen",
    progress: 100,
    target: "100%",
    deadline: "2024-01-20",
    status: "completed",
    category: "workflow",
  },
];

const categoryConfig = {
  workflow: { label: "Workflow", color: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30" },
  team: { label: "Team", color: "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border-primary/20 dark:border-primary/30" },
  revenue: { label: "Revenue", color: "bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30" },
  personal: { label: "Persönlich", color: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/30" },
};

export default function TeamGoalsPage() {
  const [goals, setGoals] = useState(mockGoals);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    category: "workflow" as Goal["category"],
  });
  const { toast } = useToast();

  const filteredGoals = goals.filter(
    (goal) => filter === "all" || goal.status === filter || goal.category === filter
  );

  const handleCreateGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      status: "active",
    };

    setGoals([goal, ...goals]);
    setNewGoal({
      title: "",
      description: "",
      target: "",
      deadline: "",
      category: "workflow",
    });
    setCreateDialogOpen(false);
    toast({
      title: "Ziel erstellt",
      description: `${newGoal.title} wurde erfolgreich erstellt.`,
    });
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, progress: Math.min(100, Math.max(0, progress)), status: progress >= 100 ? "completed" : goal.status }
          : goal
      )
    );
  };

  const activeGoals = goals.filter((g) => g.status === "active").length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const averageProgress =
    goals.filter((g) => g.status === "active").reduce((sum, g) => sum + g.progress, 0) /
    (activeGoals || 1);

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Target}
        title="Ziele"
        description="Verfolge deine Ziele und Meilensteine"
      />
      
      <div className="flex items-center justify-end">
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-to-r from-primary to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Neues Ziel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Ziele</p>
                <p className="text-2xl font-bold">{activeGoals}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                <p className="text-2xl font-bold">{completedGoals}</p>
              </div>
              <Award className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durchschnittlicher Fortschritt</p>
                <p className="text-2xl font-bold">{Math.round(averageProgress)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Ziele</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
            <SelectItem value="paused">Pausiert</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((goal) => {
          const category = categoryConfig[goal.category];
          return (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={cn("text-xs", category.color)}>
                    {category.label}
                  </Badge>
                  {goal.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-base">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Fortschritt</span>
                      <span className="text-xs font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Ziel: {goal.target}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                  {goal.status === "active" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                      >
                        +10%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateProgress(goal.id, 100)}
                      >
                        Abschließen
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Goal Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Ziel erstellen</DialogTitle>
            <DialogDescription>
              Definiere ein neues Ziel, das du erreichen möchtest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titel *</Label>
              <Input
                placeholder="z.B. 10 neue Workflows erstellen"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                placeholder="Beschreibe dein Ziel..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zielwert *</Label>
                <Input
                  placeholder="z.B. 10"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Frist</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal({ ...newGoal, category: value as Goal["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="personal">Persönlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateGoal} className="bg-gradient-to-r from-primary to-purple-500">
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
