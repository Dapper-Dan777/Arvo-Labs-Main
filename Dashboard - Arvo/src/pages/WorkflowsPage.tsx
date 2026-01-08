import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, FileText, Settings, ArrowRight, Workflow } from "lucide-react";
import { WorkflowTutorial } from "@/components/workflow/WorkflowTutorial";
import { useTutorial } from "@/contexts/TutorialContext";
import { useSectionGradient } from "@/lib/sectionGradients";

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const { setIsTutorialActive } = useTutorial();
  const sectionGradient = useSectionGradient(); // Workflows-Gradient: var(--gradient-workflows)
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const categories = [
    {
      id: "marketing",
      title: "Marketing Workflows",
      description: "Automatisieren Sie Ihre Marketing-Kampagnen, Lead-Generierung und Social Media",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      href: "/workflows/marketing",
      features: [
        "E-Mail-Kampagnen automatisieren",
        "Lead-Scoring & Qualifizierung",
        "Social Media Posting",
        "Marktanalysen & Reports",
      ],
    },
    {
      id: "invoicing",
      title: "Invoicing Workflows",
      description: "Automatisieren Sie Rechnungsprozesse, Zahlungserinnerungen und Finanzberichte",
      icon: FileText,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      href: "/workflows/invoicing",
      features: [
        "Automatische Rechnungserstellung",
        "Zahlungserinnerungen",
        "Rechnungsfreigabe-Workflows",
        "Finanzberichte generieren",
      ],
    },
    {
      id: "custom",
      title: "Custom Workflows",
      description: "Erstellen Sie individuelle Automatisierungen für Ihre spezifischen Geschäftsprozesse",
      icon: Settings,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      href: "/workflows/custom",
      features: [
        "Daten-Synchronisation",
        "Benutzerdefinierte Benachrichtigungen",
        "Multi-Step Automatisierungen",
        "Flexible Integrationen",
      ],
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg" style={{ background: sectionGradient }}>
            <Workflow className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Workflows</h1>
            <p className="text-sm text-muted-foreground">
              Wählen Sie eine Kategorie, um Ihre Automatisierungen zu verwalten
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
              onClick={() => navigate(category.href)}
            >
              <CardHeader className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-xl mt-4">{category.title}</CardTitle>
                <CardDescription className="text-white/90">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className={`h-1.5 w-1.5 rounded-full ${category.iconColor} bg-current mt-2 shrink-0`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 bg-gradient-to-r ${category.color} hover:opacity-90`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(category.href);
                  }}
                >
                  {category.title} öffnen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellstart</CardTitle>
          <CardDescription>
            Lernen Sie, wie Sie Ihre erste Automatisierung erstellen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setTutorialOpen(true);
                setIsTutorialActive(true);
              }}
            >
              Tutorial starten
            </Button>
            <p className="text-sm text-muted-foreground">
              Folgen Sie unserem interaktiven Tutorial und erstellen Sie Ihre erste Automation
            </p>
          </div>
        </CardContent>
      </Card>

      <WorkflowTutorial open={tutorialOpen} onOpenChange={setTutorialOpen} />
    </div>
  );
}
