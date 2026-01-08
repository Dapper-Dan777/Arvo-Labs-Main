import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useWorkflows, WorkflowStatus, WorkflowCategory } from "@/contexts/WorkflowContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { WorkflowTutorial } from "@/components/workflow/WorkflowTutorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Pause, MoreHorizontal, AlertCircle, Trash2, Edit, TrendingUp, FileText, Settings, Sparkles, Copy, Share2, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { workflowTemplates, getTemplatesByCategory, type WorkflowTemplate } from "@/lib/workflowTemplates";
import { shareWorkflow, getShareUrl, copyWorkflow, deleteSharedWorkflow, getAllSharedWorkflows } from "@/lib/workflowSharing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryConfig: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  colorDark: string;
  description: string;
  templates: Array<{ name: string; description: string; icon: string; workflow: any }>;
}> = {
  marketing: {
    title: "Marketing Workflows",
    subtitle: "Automatisieren Sie Ihre Marketing-Kampagnen",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500",
    colorDark: "from-purple-600 to-pink-600",
    description: "Erstellen Sie automatisierte Marketing-Workflows für E-Mail-Kampagnen, Social Media, Lead-Generierung und mehr.",
    templates: [
      {
        name: "Lead Scoring Automation",
        description: "Bewerten Sie Leads automatisch basierend auf Verhalten",
        icon: "⭐",
        workflow: {
          name: "Lead Scoring Automation",
          category: "marketing" as WorkflowCategory,
          description: "Automatische Lead-Bewertung",
        },
      },
      {
        name: "Email Campaign Trigger",
        description: "Starte E-Mail-Kampagnen basierend auf Aktionen",
        icon: "📧",
        workflow: {
          name: "Email Campaign Trigger",
          category: "marketing" as WorkflowCategory,
          description: "Automatische E-Mail-Kampagnen",
        },
      },
      {
        name: "Social Media Scheduler",
        description: "Automatisiere Social Media Posts",
        icon: "📱",
        workflow: {
          name: "Social Media Scheduler",
          category: "marketing" as WorkflowCategory,
          description: "Automatische Social Media Posts",
        },
      },
    ],
  },
  invoicing: {
    title: "Invoicing Workflows",
    subtitle: "Automatisieren Sie Rechnungsprozesse",
    icon: <FileText className="h-6 w-6" />,
    color: "from-primary to-primary/80",
    colorDark: "from-primary/90 to-primary/70",
    description: "Automatisieren Sie die Erstellung, Versendung und Nachverfolgung von Rechnungen.",
    templates: [
      {
        name: "Automatic Invoice Generation",
        description: "Erstelle automatisch Rechnungen bei neuen Bestellungen",
        icon: "🧾",
        workflow: {
          name: "Automatic Invoice Generation",
          category: "invoicing" as WorkflowCategory,
          description: "Automatische Rechnungserstellung",
        },
      },
      {
        name: "Payment Reminder",
        description: "Sende Zahlungserinnerungen für überfällige Rechnungen",
        icon: "💳",
        workflow: {
          name: "Payment Reminder",
          category: "invoicing" as WorkflowCategory,
          description: "Automatische Zahlungserinnerungen",
        },
      },
      {
        name: "Invoice Approval Workflow",
        description: "Automatisieren Sie den Rechnungsfreigabeprozess",
        icon: "✅",
        workflow: {
          name: "Invoice Approval Workflow",
          category: "invoicing" as WorkflowCategory,
          description: "Rechnungsfreigabe-Automatisierung",
        },
      },
    ],
  },
  custom: {
    title: "Custom Workflows",
    subtitle: "Erstellen Sie individuelle Automatisierungen",
    icon: <Settings className="h-6 w-6" />,
    color: "from-primary to-primary/80",
    colorDark: "from-primary/90 to-primary/70",
    description: "Erstellen Sie Ihre eigenen, individuellen Workflows für spezifische Geschäftsprozesse.",
    templates: [
      {
        name: "Data Sync Workflow",
        description: "Synchronisiere Daten zwischen verschiedenen Systemen",
        icon: "🔄",
        workflow: {
          name: "Data Sync Workflow",
          category: "custom" as WorkflowCategory,
          description: "Daten-Synchronisation",
        },
      },
      {
        name: "Custom Notification System",
        description: "Erstelle ein benutzerdefiniertes Benachrichtigungssystem",
        icon: "🔔",
        workflow: {
          name: "Custom Notification System",
          category: "custom" as WorkflowCategory,
          description: "Benutzerdefinierte Benachrichtigungen",
        },
      },
      {
        name: "Multi-Step Automation",
        description: "Komplexe mehrstufige Automatisierung",
        icon: "⚙️",
        workflow: {
          name: "Multi-Step Automation",
          category: "custom" as WorkflowCategory,
          description: "Mehrstufige Automatisierung",
        },
      },
    ],
  },
};

const statusConfig = {
  running: {
    icon: Play,
    color: "text-primary",
    bg: "bg-primary/10",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  paused: {
    icon: Pause,
    color: "text-warning",
    bg: "bg-warning/10",
    badge: "bg-warning/10 text-warning border-warning/20",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function WorkflowCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { workflows, toggleWorkflowStatus, deleteWorkflow, addWorkflow } = useWorkflows();
  const { toast } = useToast();
  const { setIsTutorialActive } = useTutorial();
  const [newWorkflowOpen, setNewWorkflowOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Bestimme die aktive Kategorie
  const path = location.pathname;
  
  // Wenn auf edit route, zeige nichts (wird von WorkflowEditorPage gehandhabt)
  if (path.includes("/edit")) {
    return null;
  }
  
  // Wenn wir auf "/" sind oder keine gültige Kategorie, verwende Marketing als Fallback
  let activeCategory = "marketing";
  if (category && categoryConfig[category]) {
    activeCategory = category;
  } else if (path === "/" || path === "/workflows") {
    activeCategory = "marketing";
  }
  
  // Redirect zu Marketing wenn auf "/" oder ungültige Kategorie
  useEffect(() => {
    if (path.includes("/edit")) {
      return;
    }
    
    if (path === "/" || path === "/workflows" || (category && !categoryConfig[category])) {
      setIsRedirecting(true);
      navigate("/workflows/marketing", { replace: true });
      // Reset nach kurzer Zeit
      setTimeout(() => setIsRedirecting(false), 100);
    }
  }, [category, path, navigate]);
  
  // Verwende Marketing als Fallback wenn category nicht existiert
  const config = categoryConfig[activeCategory] || categoryConfig["marketing"];
  
  // Sicherstellen dass config existiert
  if (!config) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }
  
  // Zeige Loading während Redirect
  if (isRedirecting) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Weiterleitung...</p>
        </div>
      </div>
    );
  }
  
  // Filtere Workflows nach Kategorie
  const categoryWorkflows = workflows.filter(w => 
    !w.isTutorial && (w.category === activeCategory || (!w.category && activeCategory === "all"))
  );

  const statusCounts = {
    running: categoryWorkflows.filter((w) => w.status === "running").length,
    paused: categoryWorkflows.filter((w) => w.status === "paused").length,
    error: categoryWorkflows.filter((w) => w.status === "error").length,
    total: categoryWorkflows.length,
  };

  const handleToggleStatus = (id: number) => {
    toggleWorkflowStatus(id);
    const workflow = categoryWorkflows.find(w => w.id === id);
    toast({
      title: `Workflow ${workflow?.status === "running" ? "pausiert" : "gestartet"}`,
      description: `${workflow?.name} wurde erfolgreich ${workflow?.status === "running" ? "pausiert" : "gestartet"}.`,
    });
  };

  const handleDelete = (id: number) => {
    const workflow = categoryWorkflows.find(w => w.id === id);
    deleteWorkflow(id);
    toast({
      title: "Workflow gelöscht",
      description: `${workflow?.name} wurde erfolgreich gelöscht.`,
    });
  };

  const handleCreateFromTemplate = (template: any) => {
    const newWorkflow = {
      ...template.workflow,
      status: "paused" as WorkflowStatus,
      progress: 0,
      lastRun: "Never",
      duration: "—",
      icon: template.icon,
      nodes: [],
      connections: [],
    };
    
    const created = addWorkflow(newWorkflow);
    setNewWorkflowOpen(false);
    toast({
      title: "Workflow erstellt",
      description: `${template.name} wurde erfolgreich erstellt.`,
    });
    navigate(`/workflows/${created.id}/edit`);
  };

  // Prüfe ob Dark Mode aktiv ist
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Observer für Änderungen am DOM (wenn Theme geändert wird)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Erstelle Gradient-Style basierend auf Theme
  const getGradientStyle = () => {
    const gradientClass = isDark ? config.colorDark : config.color;
    // Konvertiere Tailwind-Klassen zu CSS-Gradient
    const gradientMap: Record<string, string> = {
      "from-purple-500 to-pink-500": "linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))",
      "from-purple-600 to-pink-600": "linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119))",
      "from-blue-500 to-cyan-500": "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
      "from-blue-600 to-cyan-600": "linear-gradient(to right, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7))",
      "from-cyan-500 to-cyan-600": "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
      "from-cyan-600 to-cyan-700": "linear-gradient(to right, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7))",
    };
    return { background: gradientMap[gradientClass] || gradientMap["from-purple-500 to-pink-500"] };
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-auto min-h-full">
      {/* Header */}
      <div 
        className="bg-gradient-to-r p-6 rounded-lg text-white"
        style={getGradientStyle()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
              {config.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-white">{config.title}</h1>
              <p className="text-white/90 dark:text-white/80">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setNewWorkflowOpen(true)}
              className="bg-white text-gray-900 hover:bg-white/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setTutorialOpen(true);
                setIsTutorialActive(true);
              }}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10"
            >
              Tutorial
            </Button>
          </div>
        </div>
        <p className="mt-4 text-white/80 dark:text-white/70 text-sm max-w-2xl">{config.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{statusCounts.running}</div>
            <div className="text-sm text-muted-foreground">Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{statusCounts.paused}</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{statusCounts.error}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Section */}
      {categoryWorkflows.length === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{config.templates[0]?.icon}</div>
              <h3 className="text-xl font-semibold mb-2">Keine {config.title} vorhanden</h3>
              <p className="text-muted-foreground mb-6">{config.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {config.templates.map((template, idx) => (
                <Card
                  key={idx}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                  onClick={() => handleCreateFromTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="text-3xl mb-3">{template.icon}</div>
                    <h4 className="font-semibold mb-1">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button
                onClick={() => navigate(`/workflows/${category}/new`)}
                className="bg-gradient-to-r from-primary to-purple-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Leeren Workflow erstellen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      {categoryWorkflows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ihre Workflows</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewWorkflowOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Workflow hinzufügen
            </Button>
          </div>
          <div className="grid gap-4">
            {categoryWorkflows.map((workflow) => {
              const statusCfg = statusConfig[workflow.status as keyof typeof statusConfig];
              const StatusIcon = statusCfg.icon;

              return (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn("p-2 rounded-lg", statusCfg.bg)}>
                          {workflow.icon ? (
                            <span className="text-2xl">{workflow.icon}</span>
                          ) : (
                            <StatusIcon className={cn("h-5 w-5", statusCfg.color)} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{workflow.name}</h3>
                            <Badge variant="outline" className={cn("text-xs", statusCfg.badge)}>
                              {workflow.status}
                            </Badge>
                          </div>
                          {workflow.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {workflow.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <Progress value={workflow.progress} className="h-1.5 flex-1 max-w-xs" />
                            <span className="text-xs text-muted-foreground">{workflow.duration}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{workflow.lastRun}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:ml-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(workflow.id)}
                        >
                          {workflow.status === "running" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/workflows/${workflow.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(workflow.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* New Workflow Dialog */}
      <Dialog open={newWorkflowOpen} onOpenChange={setNewWorkflowOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Workflow erstellen</DialogTitle>
            <DialogDescription>
              Wählen Sie eine Vorlage oder erstellen Sie einen leeren Workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Vorlagen
              </Label>
              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {/* Neue Templates aus workflowTemplates */}
                {getTemplatesByCategory(category || "all").map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      const newWorkflow = {
                        name: template.name,
                        description: template.description,
                        category: template.category as WorkflowCategory,
                        status: "paused" as WorkflowStatus,
                        progress: 0,
                        lastRun: "Never",
                        duration: "—",
                        nodes: template.nodes,
                        connections: template.connections,
                      };
                      const created = addWorkflow(newWorkflow);
                      setNewWorkflowOpen(false);
                      navigate(`/workflows/${created.id}/edit`);
                      toast({
                        title: "Workflow aus Vorlage erstellt",
                        description: `${template.name} wurde erfolgreich erstellt.`,
                      });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Alte Templates aus config */}
                {config.templates.map((template, idx) => (
                  <Card
                    key={`old-${idx}`}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCreateFromTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newWorkflow = {
                    name: `New ${config.title}`,
                    category: category as WorkflowCategory,
                    status: "paused" as WorkflowStatus,
                    progress: 0,
                    lastRun: "Never",
                    duration: "—",
                    nodes: [],
                    connections: [],
                  };
                  const created = addWorkflow(newWorkflow);
                  setNewWorkflowOpen(false);
                  navigate(`/workflows/${created.id}/edit`);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Leeren Workflow erstellen
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewWorkflowOpen(false)}>
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

