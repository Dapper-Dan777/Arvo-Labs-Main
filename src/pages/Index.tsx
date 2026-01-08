import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Zap, Target, Rocket, Mail, BarChart3, Workflow, Shield, Plug, Smartphone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section - Opux Style */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-6 animate-fade-up opacity-0" style={{ animationDelay: "0ms" }}>
              {t.hero.badge}
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
              {t.hero.title}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: "200ms" }}>
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
              <Button variant="opux" size="lg" asChild>
                <Link to="/preise">
                  {t.hero.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" size="lg" asChild>
                <Link to="/funktionen">{t.hero.secondary}</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-12 max-w-xl mx-auto animate-fade-up opacity-0" style={{ animationDelay: "400ms" }}>
              {t.hero.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section - Opux Style */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.problem.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.problem.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ProblemCard
              title={t.problem.card1.title}
              description={t.problem.card1.description}
            />
            <ProblemCard
              title={t.problem.card2.title}
              description={t.problem.card2.description}
            />
            <ProblemCard
              title={t.problem.card3.title}
              description={t.problem.card3.description}
            />
          </div>
        </div>
      </section>

      {/* Solution Section - Opux Style */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.solution.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.solution.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              icon={<Target className="w-6 h-6" />}
              step="01"
              title={t.solution.step1.title}
              description={t.solution.step1.description}
            />
            <StepCard
              icon={<Zap className="w-6 h-6" />}
              step="02"
              title={t.solution.step2.title}
              description={t.solution.step2.description}
            />
            <StepCard
              icon={<Rocket className="w-6 h-6" />}
              step="03"
              title={t.solution.step3.title}
              description={t.solution.step3.description}
            />
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.features.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Mail className="w-5 h-5" />}
              title={t.features.email.title}
              description={t.features.email.description}
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title={t.features.reporting.title}
              description={t.features.reporting.description}
            />
            <FeatureCard
              icon={<Workflow className="w-5 h-5" />}
              title={t.features.workflows.title}
              description={t.features.workflows.description}
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title={t.features.security.title}
              description={t.features.security.description}
            />
            <FeatureCard
              icon={<Plug className="w-5 h-5" />}
              title={t.features.integrations.title}
              description={t.features.integrations.description}
            />
            <FeatureCard
              icon={<Smartphone className="w-5 h-5" />}
              title={t.features.mobile.title}
              description={t.features.mobile.description}
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="opuxOutline" size="lg" asChild>
              <Link to="/funktionen">
                {t.hero.secondary}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.faq.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <FAQItem question={t.faq.q1.question} answer={t.faq.q1.answer} />
            <FAQItem question={t.faq.q2.question} answer={t.faq.q2.answer} />
            <FAQItem question={t.faq.q3.question} answer={t.faq.q3.answer} />
            <FAQItem question={t.faq.q4.question} answer={t.faq.q4.answer} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.cta.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="opux" size="lg" asChild>
                <Link to="/kontakt">
                  {t.cta.primary}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="opuxOutline" size="lg" asChild>
                <Link to="/funktionen">{t.cta.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ProblemCard({ title, description }: { title: string; description: string }) {
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
        <h3 className="font-semibold mb-3" style={{ color: 'hsl(var(--card-label-color))' }}>{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({ icon, step, title, description }: { icon: React.ReactNode; step: string; title: string; description: string }) {
  return (
    <div className="animated-card text-center p-6 rounded-[15px] border border-border bg-transparent"
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
        <span className="text-xs text-muted-foreground font-medium">{step}</span>
        <h3 className="font-semibold mt-2 mb-3" style={{ color: 'hsl(var(--card-label-color))' }}>{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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
        <span className="card-icon mb-4 block w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
          {icon}
        </span>
        <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--card-label-color))' }}>{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-card hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-card border-t border-border">
          <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
