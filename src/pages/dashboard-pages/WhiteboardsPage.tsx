import React, { useState } from 'react';
import { PenTool, Plus, Search, Grid3x3, List, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from '@/hooks/use-toast';

// ============================================================
// WHITEBOARDS PAGE
// Whiteboard-Verwaltung mit Layout
// ============================================================

interface Whiteboard {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_WHITEBOARDS: Whiteboard[] = [
  {
    id: '1',
    name: 'Projektplanung Q1',
    description: 'Strategie und Timeline für Q1 2025',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-15',
  },
  {
    id: '2',
    name: 'Team Brainstorming',
    description: 'Ideen für neue Features',
    createdAt: '2024-12-08',
    updatedAt: '2024-12-12',
  },
  {
    id: '3',
    name: 'Architektur-Diagramm',
    description: 'System-Architektur Übersicht',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-14',
  },
];

const WhiteboardsPage = () => {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>(MOCK_WHITEBOARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWhiteboard, setNewWhiteboard] = useState({ name: '', description: '' });
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<Whiteboard | null>(null);

  const filteredWhiteboards = whiteboards.filter(wb =>
    wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wb.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!newWhiteboard.name.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Namen ein.',
        variant: 'destructive',
      });
      return;
    }

    const whiteboard: Whiteboard = {
      id: Date.now().toString(),
      name: newWhiteboard.name,
      description: newWhiteboard.description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setWhiteboards(prev => [whiteboard, ...prev]);
    setIsCreateDialogOpen(false);
    setNewWhiteboard({ name: '', description: '' });
    toast({
      title: 'Whiteboard erstellt',
      description: `"${whiteboard.name}" wurde erstellt.`,
    });
  };

  const handleOpenWhiteboard = (whiteboard: Whiteboard) => {
    setSelectedWhiteboard(whiteboard);
    toast({
      title: 'Whiteboard öffnen',
      description: `"${whiteboard.name}" wird geöffnet...`,
    });
    // TODO: Hier wird später die Whiteboard-API integriert
  };

  if (selectedWhiteboard) {
    return (
      <div className="h-[calc(100vh-8rem)] pb-20 lg:pb-0 flex flex-col">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{selectedWhiteboard.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedWhiteboard.description}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedWhiteboard(null)}>
            Zurück
          </Button>
        </div>
        <div className="flex-1 bg-muted/30 border border-border m-4 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PenTool className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">Whiteboard-Ansicht</p>
            <p className="text-sm text-muted-foreground">
              Hier wird später die Whiteboard-API integriert
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Whiteboards</h1>
          <p className="text-muted-foreground mt-1">
            {whiteboards.length} Whiteboard{whiteboards.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Whiteboard erstellen</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Whiteboard</DialogTitle>
              <DialogDescription>
                Erstelle ein neues Whiteboard für deine Ideen
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  placeholder="z.B. Projektplanung"
                  value={newWhiteboard.name}
                  onChange={(e) => setNewWhiteboard(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Beschreibung</label>
                <Input
                  placeholder="Kurze Beschreibung"
                  value={newWhiteboard.description}
                  onChange={(e) => setNewWhiteboard(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and View Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Whiteboards durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Whiteboards */}
      {filteredWhiteboards.length === 0 ? (
        <div className="text-center py-12">
          <PenTool className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Keine Whiteboards gefunden</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWhiteboards.map((whiteboard) => (
            <Card
              key={whiteboard.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleOpenWhiteboard(whiteboard)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold mb-1">{whiteboard.name}</h3>
                {whiteboard.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {whiteboard.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Zuletzt bearbeitet: {new Date(whiteboard.updatedAt).toLocaleDateString('de-DE')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredWhiteboards.map((whiteboard) => (
            <Card
              key={whiteboard.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleOpenWhiteboard(whiteboard)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PenTool className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{whiteboard.name}</h3>
                    {whiteboard.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {whiteboard.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(whiteboard.updatedAt).toLocaleDateString('de-DE')}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhiteboardsPage;





