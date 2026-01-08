"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";

interface DashboardComingSoonProps {
  plan: string;
  accountType: "user" | "team";
}

export function DashboardComingSoon({ plan, accountType }: DashboardComingSoonProps) {
  const planDisplay = plan.charAt(0).toUpperCase() + plan.slice(1);
  const accountTypeDisplay = accountType === "user" ? "User" : "Team";

  return (
    <DashboardLayout plan={plan} accountType={accountType}>
      {/* Hero Section - Opux Style */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6 animate-fade-up opacity-0" style={{ animationDelay: "0ms" }}>
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Coming Soon</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
              {accountTypeDisplay} {planDisplay} Dashboard
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: "200ms" }}>
              Wir arbeiten intensiv an deinem Dashboard. Hier wird bald das vollständige {accountTypeDisplay} {planDisplay} Dashboard verfügbar sein.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
              <Button variant="opux" size="lg" asChild>
                <Link href="/preise">
                  Preise ansehen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" size="lg" asChild>
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section - Opux Style */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Was kommt auf dich zu?
            </h2>
            <p className="text-muted-foreground text-lg">
              Dein Dashboard wird mit leistungsstarken Features ausgestattet sein
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <InfoCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Automatisierung"
              description="Erstelle und verwalte deine Workflows ganz einfach"
            />
            <InfoCard
              icon={<ArrowRight className="w-6 h-6" />}
              title="Integrationen"
              description="Verbinde deine Tools nahtlos miteinander"
            />
            <InfoCard
              icon={<Clock className="w-6 h-6" />}
              title="Analytics"
              description="Behalte den Überblick über deine Prozesse"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Bereit für den Start?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Wir informieren dich, sobald dein Dashboard verfügbar ist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="opux" size="lg" asChild>
                <Link href="/kontakt">
                  Kontakt aufnehmen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="animated-card p-6 rounded-[15px] border border-border bg-transparent" 
         style={{
           boxShadow: '0px var(--card-box-shadow-1-y) var(--card-box-shadow-1-blur) var(--card-box-shadow-1), 0px var(--card-box-shadow-2-y) var(--card-box-shadow-2-blur) var(--card-box-shadow-2), 0 0 0 1px var(--card-border-color)'
         }}>
      <div className="card-shine"></div>
      <div className="card-background">
        <div className="tiles">
          <div className="tile tile-1"></div>
          <div className="tile tile-2"></div>
          <div className="tile tile-3"></div>
          <div className="tile tile-4"></div>
          <div className="tile tile-5"></div>
          <div className="tile tile-6"></div>
          <div className="tile tile-7"></div>
          <div className="tile tile-8"></div>
          <div className="tile tile-9"></div>
          <div className="tile tile-10"></div>
        </div>
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>
      <div className="card-content">
        <span className="card-icon mx-auto mb-4 block w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground">
          {icon}
        </span>
        <h3 className="font-semibold mb-3 text-center" style={{ color: 'hsl(var(--card-label-color))' }}>{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed text-center">{description}</p>
      </div>
    </div>
  );
}

