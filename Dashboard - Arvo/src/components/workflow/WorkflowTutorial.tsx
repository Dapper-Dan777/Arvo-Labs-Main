import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, ArrowRight, ArrowLeft, X, CheckCircle2, Zap, Play, Plus, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkflows, WorkflowStatus } from "@/contexts/WorkflowContext";
import { useTutorial } from "@/contexts/TutorialContext";

interface TutorialStep {
  title: string;
  description: string;
  action?: string;
  highlight?: string;
  example?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Schritt 1: Workflow wurde erstellt",
    description: "Ein Beispiel-Workflow wurde für Sie erstellt. Sie sehen jetzt den Workflow-Editor mit einem Trigger und einer Action.",
    action: "Schauen Sie sich den geöffneten Workflow an",
    example: "Der Workflow zeigt bereits einen Gmail-Trigger und eine Slack-Action - genau wie in unserem Beispiel.",
  },
  {
    title: "Schritt 2: Trigger verstehen",
    description: "Der lila Node ist der Trigger 'New Email' von Gmail. Er startet den Workflow, wenn eine neue E-Mail eintrifft.",
    action: "Betrachten Sie den Trigger-Node im Editor",
    highlight: "trigger-node",
    example: "Trigger sind der Startpunkt jeder Automation - sie warten auf ein bestimmtes Ereignis.",
  },
  {
    title: "Schritt 3: Action verstehen",
    description: "Der grüne Node ist die Action 'Send Channel Message' von Slack. Diese wird ausgeführt, wenn der Trigger ausgelöst wird.",
    action: "Betrachten Sie den Action-Node im Editor",
    highlight: "action-node",
    example: "Actions sind die Schritte, die automatisch ausgeführt werden.",
  },
  {
    title: "Schritt 4: Verbindung verstehen",
    description: "Die Verbindungslinie zwischen den Nodes zeigt den Flow. Sie sehen, wie der Trigger zur Action führt.",
    action: "Schauen Sie sich die Verbindungslinie an",
    highlight: "connection",
    example: "Die Verbindung zeigt: Neue E-Mail → Slack-Nachricht senden",
  },
  {
    title: "Schritt 5: Trigger-Sidebar",
    description: "In der linken Sidebar finden Sie alle verfügbaren Trigger. Von hier können Sie neue Trigger zu Ihrem Workflow hinzufügen.",
    action: "Betrachten Sie die Trigger-Sidebar",
    highlight: "trigger-sidebar",
    example: "Klicken Sie auf einen Trigger, um ihn zum Workflow hinzuzufügen.",
  },
  {
    title: "Schritt 6: Action-Sidebar",
    description: "Unterhalb der Trigger finden Sie alle verfügbaren Actions. Hier können Sie neue Actions hinzufügen.",
    action: "Betrachten Sie die Action-Sidebar",
    highlight: "action-sidebar",
    example: "Scrollen Sie durch die Actions und klicken Sie auf eine, um sie hinzuzufügen.",
  },
  {
    title: "Schritt 7: Node konfigurieren",
    description: "Klicken Sie auf einen Node, um ihn zu konfigurieren. Versuchen Sie es mit dem Slack-Node - Sie können Channel und Nachricht anpassen.",
    action: "Klicken Sie auf den grünen Slack-Node",
    highlight: "action-node",
    example: "Hier können Sie den Channel (z.B. '#marketing') und die Nachricht anpassen.",
  },
  {
    title: "Schritt 8: Workflow speichern",
    description: "Klicken Sie auf 'Speichern' im Header, um Ihre Änderungen zu speichern.",
    action: "Speichern-Button klicken",
    highlight: "save-button",
  },
  {
    title: "Schritt 9: Workflow testen",
    description: "Klicken Sie auf 'Testen', um zu sehen, wie Ihr Workflow funktioniert. Sie sehen die schrittweise Ausführung.",
    action: "Testen-Button klicken (optional)",
    highlight: "test-button",
    example: "Der Test simuliert die Ausführung und zeigt, ob alles korrekt konfiguriert ist.",
  },
  {
    title: "Tutorial abgeschlossen! 🎉",
    description: "Glückwunsch! Sie haben gelernt, wie Workflows funktionieren. Sie können jetzt eigene Workflows erstellen oder diesen Tutorial-Workflow weiter anpassen.",
    example: "Der Workflow bleibt geöffnet. Sie können ihn bearbeiten, speichern oder später wieder finden.",
  },
];

interface WorkflowTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkflowTutorial({ open, onOpenChange }: WorkflowTutorialProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addWorkflow } = useWorkflows();
  const { 
    currentStep, 
    setCurrentStep, 
    tutorialWorkflowId, 
    setTutorialWorkflowId,
    setHighlightElement,
    setIsTutorialActive 
  } = useTutorial();

  // Erstelle Beispiel-Workflow beim Öffnen des Tutorials
  useEffect(() => {
    if (open && currentStep === null && !tutorialWorkflowId) {
      const tutorialWorkflow = {
        name: "Tutorial: E-Mail zu Slack",
        status: "paused" as WorkflowStatus,
        progress: 0,
        lastRun: "Never",
        duration: "—",
        description: "Beispiel-Workflow für das Tutorial - Sende Slack-Nachricht bei neuer E-Mail",
        icon: "📧",
        isTutorial: true,
        nodes: [
          {
            id: "trigger_1",
            type: "trigger" as const,
            label: "New Email",
            config: { service: "Gmail", type: "email", event: "new_email" },
            position: { x: 100, y: 200 },
          },
          {
            id: "action_1",
            type: "action" as const,
            label: "Send Channel Message",
            config: { service: "Slack", type: "slack", action: "Send Channel Message", channel: "#marketing", message: "Neue E-Mail empfangen" },
            position: { x: 400, y: 200 },
          },
        ],
        connections: [
          {
            id: "conn_1",
            source: "trigger_1",
            target: "action_1",
          },
        ],
      };

      const created = addWorkflow(tutorialWorkflow);
      setTutorialWorkflowId(created.id);
      setIsTutorialActive(true);
      setCurrentStep(0);
      
      // Navigiere zum Editor
      setTimeout(() => {
        navigate(`/workflows/${created.id}/edit`);
        // Öffne Tutorial nach Navigation
        setTimeout(() => {
          // Tutorial wird automatisch durch isTutorialActive angezeigt
        }, 500);
      }, 100);
    }
  }, [open, currentStep, tutorialWorkflowId, addWorkflow, navigate, setIsTutorialActive, setTutorialWorkflowId, setCurrentStep]);

  // Update Highlight basierend auf aktuellem Schritt
  useEffect(() => {
    if (currentStep !== null && tutorialSteps[currentStep]?.highlight) {
      setHighlightElement(tutorialSteps[currentStep].highlight || null);
    } else {
      setHighlightElement(null);
    }
  }, [currentStep, setHighlightElement]);

  // Prüfe ob wir im Editor sind
  const isInEditor = location.pathname.includes("/workflows/") && location.pathname.includes("/edit");

  const handleNext = () => {
    if (currentStep !== null && currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Tutorial schließen, nach kurzer Verzögerung wieder öffnen (für Highlight-Effekt)
      onOpenChange(false);
      setTimeout(() => {
        onOpenChange(true);
      }, 100);
    } else {
      // Tutorial beenden
      setIsTutorialActive(false);
      setCurrentStep(null);
      setHighlightElement(null);
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep !== null && currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onOpenChange(false);
      setTimeout(() => {
        onOpenChange(true);
      }, 100);
    }
  };

  const handleSkip = () => {
    setIsTutorialActive(false);
    setCurrentStep(null);
    setHighlightElement(null);
    onOpenChange(false);
  };

  // Zeige Tutorial nur im Editor oder wenn es direkt geöffnet wird
  const shouldShowDialog = open && currentStep !== null && (isInEditor || !isInEditor);
  
  // Wenn wir nicht im Editor sind, warte bis wir dort sind
  if (!isInEditor && currentStep !== null) {
    // Warte auf Navigation
    return null;
  }

  const currentStepData = tutorialSteps[currentStep || 0];
  const progress = currentStep !== null ? ((currentStep + 1) / tutorialSteps.length) * 100 : 0;

  return (
    <Dialog open={shouldShowDialog} onOpenChange={(open) => {
      if (!open) {
        handleSkip();
      }
    }}>
      <DialogContent 
        className="max-w-sm p-4 [&>button]:hidden" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={handleSkip}
      >
        <DialogHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-1.5 text-base">
              <HelpCircle className="h-4 w-4 text-primary" />
              Tutorial
            </DialogTitle>
            <span className="text-xs text-muted-foreground">
              {currentStep !== null ? currentStep + 1 : 0}/{tutorialSteps.length}
            </span>
          </div>
          <DialogDescription className="text-xs">
            Schritt {currentStep !== null ? currentStep + 1 : 0} von {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Progress value={progress} className="h-1.5" />
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight">{currentStepData.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{currentStepData.description}</p>
            
            {currentStepData.example && (
              <div className="bg-muted/50 p-2.5 rounded-lg border-l-2 border-primary">
                <p className="text-xs leading-relaxed">
                  <strong>Beispiel:</strong> {currentStepData.example}
                </p>
              </div>
            )}

            {currentStepData.action && (
              <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-xs mb-0.5">Was Sie jetzt tun:</p>
                    <p className="text-xs leading-relaxed">{currentStepData.action}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Guide für bestimmte Schritte */}
            {currentStep === 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-lg border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📧</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium">Trigger: New Email</span>
                    </div>
                    <div className="text-sm text-muted-foreground">→</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Action: Send Slack Message</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-2 bg-purple-500 text-white rounded text-sm font-medium">
                    Trigger
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <div className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium">
                    Action
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ziehen Sie eine Verbindung vom rechten Punkt des Triggers zum linken Punkt der Action.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between pt-2 border-t gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSkip}
            className="text-xs h-7 px-2"
          >
            Überspringen
          </Button>
          <div className="flex items-center gap-1.5">
            {currentStep !== null && currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="h-7 px-2"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                <span className="text-xs">Zurück</span>
              </Button>
            )}
            {currentStep !== null && currentStep === tutorialSteps.length - 1 ? (
              <>
                <Button
                  onClick={() => {
                    navigate("/workflows");
                    handleSkip();
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-purple-500 h-7 px-2 text-xs"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Zurück
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  Schließen
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-to-r from-primary to-purple-500 h-7 px-2 text-xs"
              >
                <span className="text-xs">Weiter</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

