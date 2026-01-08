import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, ArrowRight, ArrowLeft, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface WorkflowTutorialCardProps {
  open: boolean;
  onClose: () => void;
}

export function WorkflowTutorialCard({ open, onClose }: WorkflowTutorialCardProps) {
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep, 
    setHighlightElement,
    setIsTutorialActive,
  } = useTutorial();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 100, left: 300 });

  // Funktion zur Berechnung der optimalen Position
  const calculatePosition = useCallback(() => {
    if (!open || currentStep === null || !cardRef.current) return;

    const highlight = tutorialSteps[currentStep]?.highlight;
    const card = cardRef.current;
    const cardWidth = 320; // w-80 = 320px
    const padding = 16; // Abstand zum Viewport-Rand
    
    setTimeout(() => {
      let element: HTMLElement | null = null;
      let preferredPosition = { top: 100, left: 300 };
      
      if (highlight) {
        if (highlight === "trigger-node" || highlight === "action-node") {
          const nodes = document.querySelectorAll('[data-id*="trigger"], [data-id*="action"]');
          if (nodes.length > 0) {
            const node = highlight === "trigger-node" 
              ? Array.from(nodes).find(n => n.getAttribute('data-id')?.includes('trigger'))
              : Array.from(nodes).find(n => n.getAttribute('data-id')?.includes('action'));
            if (node) element = node as HTMLElement;
          }
        } else if (highlight === "trigger-sidebar" || highlight === "action-sidebar") {
          const sidebar = document.getElementById("trigger-sidebar-section") || 
                         document.getElementById("action-sidebar-section");
          if (sidebar) element = sidebar;
        } else if (highlight === "save-button" || highlight === "test-button") {
          const button = document.getElementById(highlight);
          if (button) element = button;
        }

        if (element) {
          const rect = element.getBoundingClientRect();
          
          // Berechne bevorzugte Position
          let top = rect.bottom + 10;
          let left = highlight?.includes("sidebar") ? rect.right + 10 : rect.left;

          // Viewport-Dimensionen
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Prüfe ob Karte nach rechts hinausragt
          if (left + cardWidth + padding > viewportWidth) {
            left = rect.left - cardWidth - 10;
            if (left < padding) {
              left = Math.max(padding, viewportWidth - cardWidth - padding);
            }
          }

          // Prüfe ob Karte nach links hinausragt
          if (left < padding) {
            left = padding;
          }

          preferredPosition = { top, left };
        }
      } else {
        // Kein Highlight - zentriere
        preferredPosition = {
          top: Math.max(padding, (window.innerHeight - 300) / 2),
          left: Math.max(padding, (window.innerWidth - cardWidth) / 2),
        };
      }

      // Aktualisiere Position nach Verzögerung, damit die Höhe korrekt berechnet wird
      setTimeout(() => {
        const actualCardHeight = card.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Finale Viewport-Prüfung mit tatsächlicher Höhe
        let finalTop = preferredPosition.top;
        let finalLeft = preferredPosition.left;

        // Stelle sicher, dass die gesamte Karte sichtbar ist (inkl. Buttons)
        if (finalTop + actualCardHeight + padding > viewportHeight) {
          // Verschiebe nach oben
          finalTop = Math.max(padding, viewportHeight - actualCardHeight - padding);
          
          // Falls das Element überlappt wird, verschiebe über das Element
          if (element) {
            const rect = element.getBoundingClientRect();
            if (finalTop < rect.top - actualCardHeight - 10) {
              finalTop = rect.top - actualCardHeight - 10;
            }
          }
          
          // Sicherstellen, dass mindestens oben sichtbar
          if (finalTop < padding) {
            finalTop = padding;
          }
        }

        setPosition({ top: finalTop, left: finalLeft });
      }, 100);
    }, 50);
  }, [open, currentStep]);

  // Position berechnen bei Änderungen
  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Position neu berechnen bei Fenstergrößenänderung
  useEffect(() => {
    if (!open) return;
    
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [open, calculatePosition]);

  if (!open || currentStep === null) return null;

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    } else {
      setIsTutorialActive(false);
      setCurrentStep(null);
      setHighlightElement(null);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  const handleSkip = () => {
    setIsTutorialActive(false);
    setCurrentStep(null);
    setHighlightElement(null);
    onClose();
  };

  return (
    <Card
      ref={cardRef}
      className="fixed z-[100] w-80 p-3 shadow-xl border-2 border-primary/20 bg-card"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Tutorial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1}/{tutorialSteps.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-5 w-5"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Progress value={progress} className="h-1" />

        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight">{currentStepData.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStepData.description}
          </p>

          {currentStepData.example && (
            <div className="bg-muted/50 p-2 rounded border-l-2 border-primary">
              <p className="text-xs leading-relaxed">
                <strong>Beispiel:</strong> {currentStepData.example}
              </p>
            </div>
          )}

          {currentStepData.action && (
            <div className="bg-primary/10 p-2 rounded border border-primary/20">
              <p className="font-medium text-xs mb-0.5">Was Sie jetzt tun:</p>
              <p className="text-xs leading-relaxed">{currentStepData.action}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-xs h-6 px-2"
          >
            Überspringen
          </Button>
          <div className="flex items-center gap-1">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="h-6 px-2"
              >
                <ArrowLeft className="h-3 w-3" />
              </Button>
            )}
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                <Button
                  onClick={() => {
                    navigate("/workflows");
                    handleSkip();
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-purple-500 h-6 px-2 text-xs"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Zurück
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-to-r from-primary to-purple-500 h-6 px-2 text-xs"
              >
                Weiter
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

