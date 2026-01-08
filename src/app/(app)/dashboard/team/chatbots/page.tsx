"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Bot, Edit, Trash2, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useSectionGradient } from "@/lib/sectionGradients";
import { Chatbot, ChatbotInput, getChatbotsForUser, createChatbot, deleteChatbot } from "@/lib/chatbots";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatbotsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const sectionGradient = useSectionGradient();
  
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "Du bist ein hilfreicher Assistent für Arvo Labs. Antworte freundlich und professionell.",
  });

  // Lade Chatbots
  useEffect(() => {
    if (user?.id) {
      loadChatbots();
    }
  }, [user?.id]);

  const loadChatbots = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await getChatbotsForUser(user.id);
      setChatbots(data);
    } catch (error) {
      console.error("Error loading chatbots:", error);
      toast({
        title: "Fehler",
        description: "Chatbots konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user?.id) return;
    if (!formData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen ein.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Generiere Mock-Agent-ID (ohne externe API)
      const mockAgentId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Erstelle Chatbot in Supabase
      const input: ChatbotInput = {
        name: formData.name,
        description: formData.description || undefined,
        chatbase_agent_id: mockAgentId,
        config: {
          customInstructions: formData.instructions,
        },
      };

      await createChatbot(user.id, input);
      
      toast({
        title: "Chatbot erstellt",
        description: `${formData.name} wurde erfolgreich erstellt.`,
      });

      setCreateDialogOpen(false);
      setFormData({ name: "", description: "", instructions: "Du bist ein hilfreicher Assistent für Arvo Labs. Antworte freundlich und professionell." });
      loadChatbots();
    } catch (error: any) {
      console.error("Error creating chatbot:", error);
      toast({
        title: "Fehler",
        description: error.message || "Chatbot konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedChatbot || !user?.id) return;

    try {
      await deleteChatbot(selectedChatbot.id, user.id);
      toast({
        title: "Chatbot gelöscht",
        description: `${selectedChatbot.name} wurde gelöscht.`,
      });
      setDeleteDialogOpen(false);
      setSelectedChatbot(null);
      loadChatbots();
    } catch (error: any) {
      console.error("Error deleting chatbot:", error);
      toast({
        title: "Fehler",
        description: error.message || "Chatbot konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={MessageCircle}
        title="Chatbots"
        description="Erstellen und verwalten Sie Ihre KI-Chatbots"
      />
      
      <div className="flex items-center justify-end">
        <Button
          onClick={() => setCreateDialogOpen(true)}
          style={{ background: sectionGradient }}
          className="text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Bot erstellen
        </Button>
      </div>

      {/* Chatbots Grid */}
      {chatbots.length === 0 ? (
        <EmptyState
          title="Noch keine Chatbots vorhanden"
          description="Erstellen Sie Ihren ersten Chatbot, um mit Kunden zu interagieren und Fragen zu beantworten."
          icon={Bot}
          action={{
            label: "Ersten Bot erstellen",
            icon: Plus,
            onClick: () => setCreateDialogOpen(true),
          }}
          tip="Chatbots helfen Ihnen dabei, Kundenanfragen automatisch zu beantworten und Ihre Knowledge Base zu nutzen."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                      {chatbot.description && (
                        <CardDescription className="mt-1">
                          {chatbot.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Agent ID:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {chatbot.chatbase_agent_id.substring(0, 20)}...
                      </code>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/team/chatbots/${chatbot.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/team/chatbots/${chatbot.id}/preview`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedChatbot(chatbot);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neuen Chatbot erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Chatbot mit Chatbase. Geben Sie die grundlegenden Informationen ein.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Support Bot, Sales Assistant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kurze Beschreibung des Chatbots"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Custom Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Wie soll sich der Chatbot verhalten?"
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Definieren Sie, wie sich der Chatbot verhalten soll und welche Rolle er einnimmt.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              style={{ background: sectionGradient }}
              className="text-white"
            >
              {isSubmitting ? "Wird erstellt..." : "Bot erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chatbot löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie wirklich "{selectedChatbot?.name}" löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

