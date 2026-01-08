import { createContext, useContext, useState, ReactNode } from "react";

interface TutorialContextType {
  currentStep: number | null;
  setCurrentStep: (step: number | null) => void;
  tutorialWorkflowId: number | null;
  setTutorialWorkflowId: (id: number | null) => void;
  highlightElement: string | null;
  setHighlightElement: (element: string | null) => void;
  isTutorialActive: boolean;
  setIsTutorialActive: (active: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [tutorialWorkflowId, setTutorialWorkflowId] = useState<number | null>(null);
  const [highlightElement, setHighlightElement] = useState<string | null>(null);
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  return (
    <TutorialContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        tutorialWorkflowId,
        setTutorialWorkflowId,
        highlightElement,
        setHighlightElement,
        isTutorialActive,
        setIsTutorialActive,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}

