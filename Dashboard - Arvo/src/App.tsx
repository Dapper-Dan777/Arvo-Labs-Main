import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "./ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const WorkflowCategoryPage = lazy(() => import("./pages/WorkflowCategoryPage"));
const WorkflowEditorPage = lazy(() => import("./pages/WorkflowEditorPage"));
const AutomationsPage = lazy(() => import("./pages/AutomationsPage"));
const TriggersPage = lazy(() => import("./pages/TriggersPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const InboxPage = lazy(() => import("./pages/InboxPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const WhiteboardPage = lazy(() => import("./pages/WhiteboardPage"));
const FormsPage = lazy(() => import("./pages/FormsPage"));
// Import CustomersPage, MailPage, TeamPage, and IntegrationsPage directly to avoid lazy loading issues
import CustomersPage from "./pages/CustomersPage";
import MailPage from "./pages/MailPage";
import TeamPage from "./pages/TeamPage";
import IntegrationsPage from "./pages/IntegrationsPage";
const GoalsPage = lazy(() => import("./pages/GoalsPage"));
const TimesheetsPage = lazy(() => import("./pages/TimesheetsPage"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage"));
const ChatbotsPage = lazy(() => import("./pages/ChatbotsPage"));
const ChatbotDetailPage = lazy(() => import("./pages/ChatbotDetailPage"));
const ChatbotPreviewPage = lazy(() => import("./pages/ChatbotPreviewPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotificationCenterPage = lazy(() => import("./pages/NotificationCenterPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const BackgroundDemoPage = lazy(() => import("./pages/BackgroundDemoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Laden...</p>
    </div>
  </div>
);

// Helper to wrap routes with Suspense
const SuspenseRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <IntegrationProvider>
            <WorkflowProvider>
              <TutorialProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/login" 
                      element={
                        <SuspenseRoute>
                          <LoginPage />
                        </SuspenseRoute>
                      } 
                    />
                    <Route 
                      path="/verify-email" 
                      element={
                        <SuspenseRoute>
                          <VerifyEmailPage />
                        </SuspenseRoute>
                      } 
                    />
                    <Route 
                      path="/auth/callback" 
                      element={
                        <SuspenseRoute>
                          <AuthCallbackPage />
                        </SuspenseRoute>
                      } 
                    />
                    
                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <DashboardPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <DashboardPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/workflows/:id/edit"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <WorkflowEditorPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/workflows/:category"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <WorkflowCategoryPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/automations"
                      element={
                        <ProtectedRoute>
                          <SuspenseRoute>
                            <AutomationsPage />
                          </SuspenseRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/triggers"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <TriggersPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <AnalyticsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/integrations"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <IntegrationsPage />
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inbox"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <InboxPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <DocumentsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/whiteboard"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <WhiteboardPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/forms"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <FormsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/customers"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <CustomersPage />
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mail"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <MailPage />
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/goals"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <GoalsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/timesheets"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <TimesheetsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/team"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <TeamPage />
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ai-assistant"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <AIAssistantPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chatbots"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <ChatbotsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chatbots/:id"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <ChatbotDetailPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chatbots/:id/preview"
                      element={
                        <ProtectedRoute>
                          <SuspenseRoute>
                            <ChatbotPreviewPage />
                          </SuspenseRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <SettingsPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <NotificationCenterPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/help"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <HelpPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/background-demo"
                      element={
                        <ProtectedRoute>
                          <AppShell>
                            <SuspenseRoute>
                              <BackgroundDemoPage />
                            </SuspenseRoute>
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                    <Route 
                      path="*" 
                      element={
                        <SuspenseRoute>
                          <NotFound />
                        </SuspenseRoute>
                      } 
                    />
                </Routes>
              </BrowserRouter>
                </TooltipProvider>
              </TutorialProvider>
            </WorkflowProvider>
          </IntegrationProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
