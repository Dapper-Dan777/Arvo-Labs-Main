import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Rocket,
  Zap,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Mail,
  Workflow,
  Plug,
  Calendar,
  Code,
  ArrowRight,
  FileCode,
  Lightbulb,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dokumentation() {
  const { t } = useLanguage();
  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-6 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t.documentation.breadcrumb.home}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t.documentation.breadcrumb.documentation}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* 1. Hero-Bereich "Dokumentation & Hilfe" */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                {t.documentation.hero.title}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
                {t.documentation.hero.description}
              </p>

              {/* Suchfeld */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t.documentation.hero.searchPlaceholder}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {t.documentation.hero.searchTip}
              </p>
            </div>

            {/* Dashboard-Bild - Hier später ein echtes Arvo-Labs-Screenshot/GIF einbauen */}
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format"
                alt="Arvo Labs Dashboard"
                className="rounded-xl border border-border shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sektion "Erste Schritte" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.documentation.gettingStarted.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.documentation.gettingStarted.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card: Was ist Arvo Labs? */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.documentation.gettingStarted.whatIsArvoLabs.title}</CardTitle>
                <CardDescription>
                  {t.documentation.gettingStarted.whatIsArvoLabs.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format"
                  alt="Arvo Labs Übersicht"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/was-ist-arvo-labs">
                    {t.documentation.gettingStarted.whatIsArvoLabs.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Card: Dein erster Workspace */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.documentation.gettingStarted.firstWorkspace.title}</CardTitle>
                <CardDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>{t.documentation.gettingStarted.firstWorkspace.items.create}</li>
                    <li>{t.documentation.gettingStarted.firstWorkspace.items.invite}</li>
                    <li>{t.documentation.gettingStarted.firstWorkspace.items.settings}</li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&auto=format"
                  alt="Workspace Setup"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/erster-workspace">
                    {t.documentation.gettingStarted.firstWorkspace.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Card: Erste Automatisierung erstellen */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.documentation.gettingStarted.firstAutomation.title}</CardTitle>
                <CardDescription>
                  {t.documentation.gettingStarted.firstAutomation.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&auto=format"
                  alt="Automatisierung"
                  className="rounded-lg w-full mb-4 object-cover h-20"
                />
              </CardContent>
              <CardFooter>
                <Button variant="opux" className="w-full" asChild>
                  <Link to="/dokumentation/erste-automatisierung">
                    {t.documentation.gettingStarted.firstAutomation.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Sektion "Features im Detail" */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.documentation.features.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.documentation.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Dashboard & Workspaces */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{t.documentation.features.dashboard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t.documentation.features.dashboard.items.overview}</li>
                  <li>• {t.documentation.features.dashboard.items.structure}</li>
                  <li>• {t.documentation.features.dashboard.items.control}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/dashboard-workspaces">{t.documentation.features.dashboard.button}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* KI-Chat & Assistenten */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{t.documentation.features.aiChat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t.documentation.features.aiChat.items.context}</li>
                  <li>• {t.documentation.features.aiChat.items.knowledge}</li>
                  <li>• {t.documentation.features.aiChat.items.delegate}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/ki-chat-assistenten">{t.documentation.features.aiChat.button}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Dokumente & Wissensbasis */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{t.documentation.features.documents.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t.documentation.features.documents.items.storage}</li>
                  <li>• {t.documentation.features.documents.items.versioning}</li>
                  <li>• {t.documentation.features.documents.items.search}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/dokumente-wissensbasis">{t.documentation.features.documents.button}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* E-Mail & Kommunikation */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{t.documentation.features.email.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t.documentation.features.email.items.autoReply}</li>
                  <li>• {t.documentation.features.email.items.templates}</li>
                  <li>• {t.documentation.features.email.items.tracking}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/email-kommunikation">{t.documentation.features.email.button}</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Automationen & Workflows */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                  <Workflow className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{t.documentation.features.automations.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t.documentation.features.automations.items.logic}</li>
                  <li>• {t.documentation.features.automations.items.recurring}</li>
                  <li>• {t.documentation.features.automations.items.integration}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/automationen-workflows">{t.documentation.features.automations.button}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Sektion "Integrationen & API" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.documentation.integrations.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.documentation.integrations.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Linke Spalte: Textblock */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {t.documentation.integrations.whyImportant.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.documentation.integrations.whyImportant.text1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t.documentation.integrations.whyImportant.text2}
              </p>
            </div>

            {/* Rechte Spalte: Cards */}
            <div className="space-y-4">
              {/* E-Mail-Postfächer */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.documentation.integrations.emailBoxes.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.documentation.integrations.emailBoxes.description}
                  </p>
                </CardContent>
              </Card>

              {/* Kalender & Termine */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.documentation.integrations.calendar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.documentation.integrations.calendar.description}
                  </p>
                </CardContent>
              </Card>

              {/* Weitere Integrationen */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plug className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.documentation.integrations.moreIntegrations.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.documentation.integrations.moreIntegrations.description}
                  </p>
                </CardContent>
              </Card>

              {/* API & Entwicklerbereich */}
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.documentation.integrations.api.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.documentation.integrations.api.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sektion "FAQ & Troubleshooting" */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.documentation.faq.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.documentation.faq.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  {t.documentation.faq.loginIssue.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      {t.documentation.faq.loginIssue.answer1}
                    </p>
                    <p>
                      {t.documentation.faq.loginIssue.answer2}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  {t.documentation.faq.planChange.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      {t.documentation.faq.planChange.answer1}
                    </p>
                    <p>
                      {t.documentation.faq.planChange.answer2}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  {t.documentation.faq.support.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      {t.documentation.faq.support.answer1}
                    </p>
                    <p>
                      {t.documentation.faq.support.answer2}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <Button variant="opux" size="lg" asChild className="mb-4">
              <Link to="/kontakt">
                {t.documentation.faq.contactButton}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              {t.documentation.faq.contactText}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Sektion "Ressourcen & Updates" */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {t.documentation.resources.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Produkt-Updates & Changelog */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileCode className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.documentation.resources.updates.title}</CardTitle>
                <CardDescription>
                  {t.documentation.resources.updates.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/updates">
                    {t.documentation.resources.updates.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Guides & Best Practices */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.documentation.resources.guides.title}</CardTitle>
                <CardDescription>
                  {t.documentation.resources.guides.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="opuxOutline" className="w-full" asChild>
                  <Link to="/dokumentation/guides">
                    {t.documentation.resources.guides.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

