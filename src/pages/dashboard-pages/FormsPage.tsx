import React, { useState } from 'react';
import { FileInput, Plus, Search, Eye, Edit2, Trash2, Copy, MoreVertical, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// ============================================================
// FORMS PAGE
// Formular-Verwaltung mit Erstellung und Bearbeitung
// ============================================================

interface Form {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'closed';
  responses: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_FORMS: Form[] = [
  {
    id: '1',
    title: 'Feedback-Formular Q4',
    description: 'Sammelt Feedback für Q4 Review',
    status: 'published',
    responses: 24,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-15',
  },
  {
    id: '2',
    title: 'Team-Umfrage',
    description: 'Zufriedenheitsumfrage im Team',
    status: 'published',
    responses: 12,
    createdAt: '2024-12-08',
    updatedAt: '2024-12-12',
  },
  {
    id: '3',
    title: 'Event-Anmeldung',
    description: 'Anmeldung für Weihnachtsfeier',
    status: 'draft',
    responses: 0,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-14',
  },
];

const FormsPage = () => {
  const [forms, setForms] = useState<Form[]>(MOCK_FORMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', description: '' });

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!newForm.title.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Titel ein.',
        variant: 'destructive',
      });
      return;
    }

    const form: Form = {
      id: Date.now().toString(),
      title: newForm.title,
      description: newForm.description,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setForms(prev => [form, ...prev]);
    setIsCreateDialogOpen(false);
    setNewForm({ title: '', description: '' });
    toast({
      title: 'Formular erstellt',
      description: `"${form.title}" wurde erstellt. Du kannst es jetzt bearbeiten.`,
    });
  };

  const getStatusColor = (status: Form['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'closed':
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: Form['status']) => {
    switch (status) {
      case 'published':
        return 'Veröffentlicht';
      case 'draft':
        return 'Entwurf';
      case 'closed':
        return 'Geschlossen';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Formulare</h1>
          <p className="text-muted-foreground mt-1">
            {forms.length} Formular{forms.length !== 1 ? 'e' : ''}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Formular erstellen</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Formular</DialogTitle>
              <DialogDescription>
                Erstelle ein neues Formular und füge Felder hinzu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Titel *</label>
                <Input
                  placeholder="z.B. Feedback-Formular"
                  value={newForm.title}
                  onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Beschreibung</label>
                <Input
                  placeholder="Kurze Beschreibung"
                  value={newForm.description}
                  onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Erstellen und bearbeiten
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Formulare durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <FileInput className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Keine Formulare gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    {form.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Vorschau
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Teilen
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplizieren
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(form.status)}>
                    {getStatusLabel(form.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {form.responses} Antwort{form.responses !== 1 ? 'en' : ''}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast({ title: 'Formular bearbeiten', description: `"${form.title}" wird geöffnet...` })}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toast({ title: 'Vorschau', description: `Vorschau von "${form.title}"` })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Zuletzt bearbeitet: {new Date(form.updatedAt).toLocaleDateString('de-DE')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsPage;





