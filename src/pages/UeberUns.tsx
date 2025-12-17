import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import AboutHero from "@/components/AboutHero";
import { Badge } from "@/components/ui/badge";
import { 
  Inbox, 
  Boxes, 
  Search, 
  Clock, 
  LayoutDashboard, 
  Sparkles,
  Zap,
  Shield,
  Lightbulb,
  Users,
  Flag,
  Eye
} from "lucide-react";

export default function UeberUns() {
  const { t } = useLanguage();

  const problems = [
    {
      icon: Inbox,
      title: "Überfüllte Postfächer und verpasste Nachrichten",
      description: "Wichtige E-Mails gehen in der Masse unter und werden übersehen."
    },
    {
      icon: Boxes,
      title: "Zu viele verstreute Tools und laufende Abos",
      description: "Überblick verloren über alle Tools und Abonnements, die man vergisst."
    },
    {
      icon: Search,
      title: "Kein klares Bild, was heute wirklich wichtig ist",
      description: "Keine Priorisierung – alles scheint gleich wichtig zu sein."
    }
  ];

  const features = [
    {
      icon: Clock,
      text: "Zeitersparnis"
    },
    {
      icon: LayoutDashboard,
      text: "Übersicht statt Tool‑Chaos"
    },
    {
      icon: Sparkles,
      text: "Automatisierung direkt im Dashboard"
    }
  ];

  const values = [
    {
      icon: Zap,
      title: t.about.values.simplicity.title,
      description: t.about.values.simplicity.description
    },
    {
      icon: Shield,
      title: t.about.values.reliability.title,
      description: t.about.values.reliability.description
    },
    {
      icon: Lightbulb,
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description
    }
  ];

  return (
    <Layout>
      {/* Section 1: Hero mit Video */}
      <AboutHero />

      {/* Section 2: Für wen ist Arvo Labs? */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-[#262626] rounded-xl p-6 md:p-10 hover:border-primary/30 transition-colors duration-200">
              {/* Icon + Headline Flex Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                  Für wen ist Arvo Labs?
                </h3>
              </div>
              
              {/* Body Text */}
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Vom ländlichen Handwerksbetrieb bis zur Einzelperson: Arvo Labs passt sich deinem Alltag an – nicht umgekehrt. Wenn du zu viele Tools, zu viele E-Mails und zu wenig Überblick hast, bist du hier richtig.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Welche Probleme lösen wir? */}
      <section className="py-20 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-semibold text-foreground mb-12 text-center">
            Welche Probleme lösen wir?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {problems.map((problem, index) => {
              const IconComponent = problem.icon;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl p-8 bg-background/50 hover:scale-[1.02] hover:border-primary/50 transition-all duration-200 ease-in-out"
                >
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Headline */}
                  <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
                    {problem.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center">
                    {problem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Warum Arvo Labs entstanden ist */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Warum Arvo Labs entstanden ist
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 text-center">
              Arvo Labs ist aus einem eigenen Frust entstanden: Für jede Kleinigkeit ein neues Tool, überall Abos und trotzdem das Gefühl, nichts im Griff zu haben. Mit Arvo Labs kommt alles an einem Ort zusammen – übersichtlich, klar strukturiert und mit Automatisierungen, die dir Routinearbeit abnehmen, statt dir neue Aufgaben zu machen.
            </p>
            
            {/* Feature Buttons mit Icons */}
            <div className="flex flex-wrap justify-center gap-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{feature.text}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Mission */}
      <section className="py-20 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-[#262626] rounded-xl p-6 md:p-10 text-center hover:border-primary/30 transition-colors duration-200">
              {/* Icon Circle Container */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                <Flag className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              
              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {t.about.mission.title}
              </h2>
              
              {/* Body Text */}
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t.about.mission.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Vision */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-[#262626] rounded-xl p-6 md:p-10 text-center hover:border-primary/30 transition-colors duration-200">
              {/* Icon Circle Container */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                <Eye className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              
              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {t.about.vision.title}
              </h2>
              
              {/* Body Text */}
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t.about.vision.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Unsere Werte */}
      <section className="py-20 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-semibold text-foreground mb-12 text-center">
            {t.about.values.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="space-y-4 text-center">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
