import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index.tsx";
import Funktionen from "./pages/Funktionen.tsx";
import Preise from "./pages/Preise.tsx";
import UseCases from "./pages/UseCases.tsx";
import Kontakt from "./pages/Kontakt.tsx";
import Support from "./pages/Support.tsx";
import UeberUns from "./pages/UeberUns.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Datenschutz from "./pages/Datenschutz.tsx";
import Impressum from "./pages/Impressum.tsx";
import AGB from "./pages/AGB.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dokumentation from "./pages/Dokumentation.tsx";
import WasIstArvoLabs from "./pages/dokumentation/WasIstArvoLabs.tsx";
import ErsterWorkspace from "./pages/dokumentation/ErsterWorkspace.tsx";
import ErsteAutomatisierung from "./pages/dokumentation/ErsteAutomatisierung.tsx";
import DashboardWorkspaces from "./pages/dokumentation/DashboardWorkspaces.tsx";
import KiChatAssistenten from "./pages/dokumentation/KiChatAssistenten.tsx";
import DokumenteWissensbasis from "./pages/dokumentation/DokumenteWissensbasis.tsx";
import EmailKommunikation from "./pages/dokumentation/EmailKommunikation.tsx";
import AutomationenWorkflows from "./pages/dokumentation/AutomationenWorkflows.tsx";
import Updates from "./pages/dokumentation/Updates.tsx";
import Guides from "./pages/dokumentation/Guides.tsx";
import DashboardRedirect from "./pages/DashboardRedirect.tsx";
import DashboardStarter from "./pages/DashboardStarter.tsx";
import DashboardPro from "./pages/DashboardPro.tsx";
import DashboardEnterprise from "./pages/DashboardEnterprise.tsx";
import DashboardIndividual from "./pages/DashboardIndividual.tsx";
import DashboardChat from "./pages/dashboard/DashboardChat.tsx";
import DashboardDocuments from "./pages/dashboard/DashboardDocuments.tsx";
import DashboardMail from "./pages/dashboard/DashboardMail.tsx";
import DashboardGoals from "./pages/dashboard/DashboardGoals.tsx";
import DashboardTimesheets from "./pages/dashboard/DashboardTimesheets.tsx";
import DashboardInbox from "./pages/dashboard/DashboardInbox.tsx";
import DashboardTeams from "./pages/dashboard/DashboardTeams.tsx";
import DashboardDashboards from "./pages/dashboard/DashboardDashboards.tsx";
import DashboardAssistant from "./pages/dashboard/DashboardAssistant.tsx";
import DashboardWhiteboards from "./pages/dashboard/DashboardWhiteboards.tsx";
import DashboardForms from "./pages/dashboard/DashboardForms.tsx";
import DashboardMore from "./pages/dashboard/DashboardMore.tsx";
import DashboardBilling from "./pages/dashboard/DashboardBilling.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import AuthCallback from "./pages/auth/AuthCallback.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <SpeedInsights />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/funktionen" element={<Funktionen />} />
              <Route path="/preise" element={<Preise />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/support" element={<Support />} />
              <Route path="/ueber-uns" element={<UeberUns />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/dokumentation" element={<Dokumentation />} />
              <Route path="/dokumentation/was-ist-arvo-labs" element={<WasIstArvoLabs />} />
              <Route path="/dokumentation/erster-workspace" element={<ErsterWorkspace />} />
              <Route path="/dokumentation/erste-automatisierung" element={<ErsteAutomatisierung />} />
              <Route path="/dokumentation/dashboard-workspaces" element={<DashboardWorkspaces />} />
              <Route path="/dokumentation/ki-chat-assistenten" element={<KiChatAssistenten />} />
              <Route path="/dokumentation/dokumente-wissensbasis" element={<DokumenteWissensbasis />} />
              <Route path="/dokumentation/email-kommunikation" element={<EmailKommunikation />} />
              <Route path="/dokumentation/automationen-workflows" element={<AutomationenWorkflows />} />
              <Route path="/dokumentation/updates" element={<Updates />} />
              <Route path="/dokumentation/guides" element={<Guides />} />
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              <Route path="/dashboard/billing" element={<ProtectedRoute><DashboardBilling /></ProtectedRoute>} />
              <Route path="/dashboard/starter" element={<ProtectedRoute><DashboardStarter /></ProtectedRoute>} />
              <Route path="/dashboard/pro" element={<ProtectedRoute><DashboardPro /></ProtectedRoute>} />
              <Route path="/dashboard/enterprise" element={<ProtectedRoute><DashboardEnterprise /></ProtectedRoute>} />
              <Route path="/dashboard/individual" element={<ProtectedRoute><DashboardIndividual /></ProtectedRoute>} />
              <Route path="/dashboard/chat" element={<ProtectedRoute><DashboardChat /></ProtectedRoute>} />
              <Route path="/dashboard/inbox" element={<ProtectedRoute><DashboardInbox /></ProtectedRoute>} />
              <Route path="/dashboard/documents" element={<ProtectedRoute><DashboardDocuments /></ProtectedRoute>} />
              <Route path="/dashboard/mail" element={<ProtectedRoute><DashboardMail /></ProtectedRoute>} />
              <Route path="/dashboard/goals" element={<ProtectedRoute><DashboardGoals /></ProtectedRoute>} />
              <Route path="/dashboard/timesheets" element={<ProtectedRoute><DashboardTimesheets /></ProtectedRoute>} />
              <Route path="/dashboard/teams" element={<ProtectedRoute><DashboardTeams /></ProtectedRoute>} />
              <Route path="/dashboard/dashboards" element={<ProtectedRoute><DashboardDashboards /></ProtectedRoute>} />
              <Route path="/dashboard/assistant" element={<ProtectedRoute><DashboardAssistant /></ProtectedRoute>} />
              <Route path="/dashboard/whiteboards" element={<ProtectedRoute><DashboardWhiteboards /></ProtectedRoute>} />
              <Route path="/dashboard/forms" element={<ProtectedRoute><DashboardForms /></ProtectedRoute>} />
              <Route path="/dashboard/more" element={<ProtectedRoute><DashboardMore /></ProtectedRoute>} />
              <Route path="/dashboard/more/:sectionId" element={<ProtectedRoute><DashboardMore /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
