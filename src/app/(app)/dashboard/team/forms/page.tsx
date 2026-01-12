"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Eye, Edit, Trash2, Copy, MoreVertical, BarChart3, Users, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Form {
  id: string;
  name: string;
  responses: number;
  status: "active" | "draft" | "closed";
  created: string;
  lastModified: string;
}

const mockForms: Form[] = [
  {
    id: "1",
    name: "Kundenzufriedenheitsumfrage",
    responses: 124,
    status: "active",
    created: "2024-01-15",
    lastModified: "Heute, 10:30",
  },
  {
    id: "2",
    name: "Onboarding-Formular",
    responses: 89,
    status: "active",
    created: "2024-01-10",
    lastModified: "Gestern, 14:20",
  },
  {
    id: "3",
    name: "Feedback-Formular",
    responses: 0,
    status: "draft",
    created: "2024-01-20",
    lastModified: "2 Tage",
  },
  {
    id: "4",
    name: "Event-Registrierung",
    responses: 256,
    status: "closed",
    created: "2023-12-01",
    lastModified: "1 Woche",
  },
];

export default function TeamFormsPage() {
  const [mounted, setMounted] = useState(false);
  const [forms, setForms] = useState(mockForms);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [editFormName, setEditFormName] = useState("");
  const [editFormStatus, setEditFormStatus] = useState<"active" | "draft" | "closed">("draft");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewingForm, setPreviewingForm] = useState<Form | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analyzingForm, setAnalyzingForm] = useState<Form | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateForm = () => {
    if (!newFormName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Formularnamen ein.",
        variant: "destructive",
      });
      return;
    }

    const newForm: Form = {
      id: Date.now().toString(),
      name: newFormName,
      responses: 0,
      status: "draft",
      created: new Date().toISOString().split("T")[0],
      lastModified: "Gerade eben",
    };

    setForms([newForm, ...forms]);
    setNewFormName("");
    setSelectedTemplate(null);
    setCreateDialogOpen(false);
    toast({
      title: "Formular erstellt",
      description: `${newFormName} wurde erfolgreich erstellt.`,
    });
  };

  const handleEdit = (form: Form) => {
    setEditingForm(form);
    setEditFormName(form.name);
    setEditFormStatus(form.status);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingForm || !editFormName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Formularnamen ein.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const lastModified = `Heute, ${timeString}`;

    setForms(
      forms.map((f) =>
        f.id === editingForm.id
          ? {
              ...f,
              name: editFormName.trim(),
              status: editFormStatus,
              lastModified,
            }
          : f
      )
    );

    setEditDialogOpen(false);
    setEditingForm(null);
    toast({
      title: "Formular aktualisiert",
      description: `${editFormName} wurde erfolgreich aktualisiert.`,
    });
  };

  const handlePreview = (form: Form) => {
    setPreviewingForm(form);
    setPreviewDialogOpen(true);
  };

  const handleDuplicate = (form: Form) => {
    const duplicatedForm: Form = {
      ...form,
      id: Date.now().toString(),
      name: `${form.name} (Kopie)`,
      responses: 0,
      status: "draft",
      created: new Date().toISOString().split("T")[0],
      lastModified: "Gerade eben",
    };

    setForms([duplicatedForm, ...forms]);
    toast({
      title: "Formular dupliziert",
      description: `${duplicatedForm.name} wurde erfolgreich erstellt.`,
    });
  };

  const handleAnalyze = (form: Form) => {
    setAnalyzingForm(form);
    setAnalysisDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const form = forms.find((f) => f.id === id);
    setForms(forms.filter((f) => f.id !== id));
    toast({
      title: "Formular gelöscht",
      description: `${form?.name} wurde erfolgreich gelöscht.`,
    });
  };

  const getStatusBadge = (status: Form["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Aktiv</Badge>;
      case "draft":
        return <Badge variant="outline">Entwurf</Badge>;
      case "closed":
        return <Badge variant="secondary">Geschlossen</Badge>;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={ClipboardList}
        title="Formulare"
        description="Erstelle und verwalte Formulare"
      />
      
      <div className="flex items-center justify-end">
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-to-r from-primary to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Neues Formular
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt Formulare</p>
                <p className="text-2xl font-bold">{forms.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Formulare</p>
                <p className="text-2xl font-bold">
                  {forms.filter((f) => f.status === "active").length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt Antworten</p>
                <p className="text-2xl font-bold">
                  {forms.reduce((sum, f) => sum + f.responses, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      {mounted ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="draft">Entwürfe</TabsTrigger>
          </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{form.name}</CardTitle>
                      {getStatusBadge(form.status)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(form)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePreview(form)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Vorschau
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(form)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplizieren
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(form.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Antworten</span>
                      <span className="font-medium">{form.responses}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Zuletzt bearbeitet</span>
                      <span className="text-muted-foreground">{form.lastModified}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(form)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ansehen
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleAnalyze(form)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analysieren
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms
              .filter((f) => f.status === "active")
              .map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{form.name}</CardTitle>
                    {getStatusBadge(form.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Antworten</span>
                        <span className="font-medium">{form.responses}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms
              .filter((f) => f.status === "draft")
              .map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{form.name}</CardTitle>
                    {getStatusBadge(form.status)}
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(form)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 border-b">
            <button className="px-4 py-2 border-b-2 border-primary">Alle</button>
            <button className="px-4 py-2">Aktiv</button>
            <button className="px-4 py-2">Entwürfe</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <Badge variant={form.status === "active" ? "default" : "secondary"}>
                      {form.status === "active" ? "Aktiv" : form.status === "draft" ? "Entwurf" : "Geschlossen"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{form.responses} Antworten</p>
                    <p className="text-xs text-muted-foreground">Zuletzt bearbeitet: {form.lastModified}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Form Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Formular erstellen</DialogTitle>
            <DialogDescription>
              Erstelle ein neues Formular für Umfragen, Registrierungen oder Feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Formularname</Label>
              <Input
                placeholder="z.B. Kundenzufriedenheitsumfrage"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Vorlage (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedTemplate === "empty" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col"
                  onClick={() => setSelectedTemplate(selectedTemplate === "empty" ? null : "empty")}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Leer</span>
                </Button>
                <Button
                  variant={selectedTemplate === "survey" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col"
                  onClick={() => setSelectedTemplate(selectedTemplate === "survey" ? null : "survey")}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-xs">Umfrage</span>
                </Button>
                <Button
                  variant={selectedTemplate === "registration" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col"
                  onClick={() => setSelectedTemplate(selectedTemplate === "registration" ? null : "registration")}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-xs">Registrierung</span>
                </Button>
                <Button
                  variant={selectedTemplate === "feedback" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col"
                  onClick={() => setSelectedTemplate(selectedTemplate === "feedback" ? null : "feedback")}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="text-xs">Feedback</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateForm} className="bg-gradient-to-r from-primary to-purple-500">
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formular bearbeiten</DialogTitle>
            <DialogDescription>
              Ändere den Namen oder den Status des Formulars.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Formularname</Label>
              <Input
                placeholder="Formularname"
                value={editFormName}
                onChange={(e) => setEditFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button
                  variant={editFormStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditFormStatus("draft")}
                >
                  Entwurf
                </Button>
                <Button
                  variant={editFormStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditFormStatus("active")}
                >
                  Aktiv
                </Button>
                <Button
                  variant={editFormStatus === "closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditFormStatus("closed")}
                >
                  Geschlossen
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-primary to-purple-500">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vorschau: {previewingForm?.name}</DialogTitle>
            <DialogDescription>
              So sieht Ihr Formular für Benutzer aus.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {previewingForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{previewingForm.name}</CardTitle>
                  {getStatusBadge(previewingForm.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Ihr Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>E-Mail</Label>
                    <Input type="email" placeholder="ihre@email.de" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nachricht</Label>
                    <Textarea placeholder="Ihre Nachricht..." rows={4} />
                  </div>
                  <Button className="w-full" disabled>
                    Absenden (Vorschau)
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Dies ist eine Vorschau. Das Formular ist nicht funktionsfähig.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analyse: {analyzingForm?.name}</DialogTitle>
            <DialogDescription>
              Detaillierte Statistiken und Analysen für dieses Formular.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {analyzingForm && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Gesamt Antworten</p>
                    <p className="text-3xl font-bold mt-2">{analyzingForm.responses}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-2">{getStatusBadge(analyzingForm.status)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Erstellt</p>
                    <p className="text-lg font-semibold mt-2">{analyzingForm.created}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Zuletzt bearbeitet</p>
                    <p className="text-lg font-semibold mt-2">{analyzingForm.lastModified}</p>
                  </CardContent>
                </Card>
              </div>
            )}
            {analyzingForm && analyzingForm.responses > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aktivitätsverlauf</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>Letzte 24 Stunden</span>
                      <span className="font-semibold">
                        {Math.floor(analyzingForm.responses * 0.15)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>Letzte 7 Tage</span>
                      <span className="font-semibold">
                        {Math.floor(analyzingForm.responses * 0.45)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>Letzte 30 Tage</span>
                      <span className="font-semibold">
                        {Math.floor(analyzingForm.responses * 0.75)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {analyzingForm && analyzingForm.responses === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Noch keine Antworten vorhanden. Das Formular wurde noch nicht ausgefüllt.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalysisDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
