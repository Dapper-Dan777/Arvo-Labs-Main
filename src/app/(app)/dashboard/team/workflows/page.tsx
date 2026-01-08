"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, FileText, Settings, ArrowRight, Workflow } from "lucide-react";
import { useSectionGradient } from "@/lib/sectionGradients";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function TeamWorkflowsPage() {
  const router = useRouter();
  const sectionGradient = useSectionGradient();
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
      href: "/dashboard/team/workflows/marketing",
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
      href: "/dashboard/team/workflows/invoicing",
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
      href: "/dashboard/team/workflows/custom",
      features: [
        "Daten-Synchronisation",
        "Benutzerdefinierte Benachrichtigungen",
        "Multi-Step Automatisierungen",
        "Flexible Integrationen",
      ],
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Workflow}
        title="Workflows"
        description="Wählen Sie eine Kategorie, um Ihre Automatisierungen zu verwalten"
      />

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
              onClick={() => router.push(category.href)}
            >
              <CardHeader className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-white mt-4">{category.title}</CardTitle>
                <CardDescription className="text-white/90">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 ${category.iconColor} bg-current`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 bg-gradient-to-r ${category.color} text-white hover:opacity-90`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(category.href);
                  }}
                >
                  Workflows öffnen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

