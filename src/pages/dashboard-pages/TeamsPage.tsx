import React, { useState } from 'react';
import { Users, Plus, MessageCircle, UserPlus, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ============================================================
// TEAMS PAGE
// Team-Verwaltung mit Erstellung, Mitgliedern und Team-Chat
// ============================================================

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Entwicklung',
    description: 'Frontend & Backend Entwicklung',
    members: [
      { id: '1', name: 'Max Kowalski', email: 'max@example.com', role: 'owner' },
      { id: '2', name: 'Anna Schmidt', email: 'anna@example.com', role: 'admin' },
      { id: '3', name: 'Tom Müller', email: 'tom@example.com', role: 'member' },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Design',
    description: 'UI/UX Design Team',
    members: [
      { id: '4', name: 'Lisa Weber', email: 'lisa@example.com', role: 'owner' },
      { id: '5', name: 'Max Kowalski', email: 'max@example.com', role: 'member' },
    ],
    createdAt: '2024-02-01',
  },
];

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Team-Namen ein.',
        variant: 'destructive',
      });
      return;
    }

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      members: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTeams(prev => [...prev, team]);
    setIsCreateDialogOpen(false);
    setNewTeam({ name: '', description: '' });
    toast({
      title: 'Team erstellt',
      description: `"${team.name}" wurde erfolgreich erstellt.`,
    });
  };

  const handleAddMember = (teamId: string) => {
    if (!newMemberEmail.trim()) {
      toast({
        title: 'Fehlende E-Mail',
        description: 'Bitte gib eine E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          name: newMemberEmail.split('@')[0],
          email: newMemberEmail,
          role: 'member',
        };
        return {
          ...team,
          members: [...team.members, newMember],
        };
      }
      return team;
    }));

    setNewMemberEmail('');
    toast({
      title: 'Mitglied hinzugefügt',
      description: `${newMemberEmail} wurde zum Team hinzugefügt.`,
    });
  };

  const handleOpenChat = (team: Team) => {
    setSelectedTeam(team);
    setIsChatOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-1">
            {teams.length} Team{teams.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Team erstellen</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Team erstellen</DialogTitle>
              <DialogDescription>
                Erstelle ein neues Team und füge Mitglieder hinzu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Team-Name *</label>
                <Input
                  placeholder="z.B. Entwicklung"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Beschreibung</label>
                <Input
                  placeholder="Kurze Beschreibung des Teams"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreateTeam} className="w-full">
                Team erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Teams durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Keine Teams gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Mitglieder ({team.members.length})</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const email = prompt('E-Mail-Adresse:');
                        if (email) {
                          setNewMemberEmail(email);
                          handleAddMember(team.id);
                        }
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member) => (
                      <Avatar key={member.id} className="border-2 border-background">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenChat(team)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const email = prompt('E-Mail-Adresse:');
                      if (email) {
                        setNewMemberEmail(email);
                        handleAddMember(team.id);
                      }
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Team Chat Sheet */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedTeam?.name} Chat</SheetTitle>
            <SheetDescription>
              Team-Chat für {selectedTeam?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Team-Chat wird hier angezeigt</p>
                <p className="text-sm mt-2">
                  Später wird hier eine vollständige Chat-Funktion integriert
                </p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex gap-2">
                <Input placeholder="Nachricht schreiben..." />
                <Button>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TeamsPage;





