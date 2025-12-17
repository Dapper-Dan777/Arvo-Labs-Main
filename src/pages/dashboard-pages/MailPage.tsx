import React, { useState } from 'react';
import { Mail, Plus, Send, Reply, ReplyAll, Forward, Archive, Trash2, Star, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================================
// MAIL PAGE
// Gmail-ähnliches E-Mail-Interface
// ============================================================

interface Email {
  id: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
}

const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    from: 'anna.schmidt@example.com',
    to: 'max@example.com',
    subject: 'Q4 Report Review',
    body: 'Hallo Max,\n\nich habe den Q4 Report fertiggestellt und würde gerne dein Feedback einholen. Könntest du ihn bitte bis Freitag durchsehen?\n\nViele Grüße,\nAnna',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '2',
    from: 'tom.mueller@example.com',
    to: 'max@example.com',
    cc: 'team@example.com',
    subject: 'Meeting Einladung: Sprint Planning',
    body: 'Hi Max,\n\nwir planen das nächste Sprint Planning Meeting für nächsten Montag um 10:00 Uhr.\n\nBist du dabei?\n\nTom',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '3',
    from: 'lisa.weber@example.com',
    to: 'max@example.com',
    subject: 'Design Review',
    body: 'Hallo,\n\nich habe die neuen Designs fertiggestellt. Könntest du sie bitte reviewen?\n\nLG,\nLisa',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: false,
    folder: 'inbox',
  },
];

const MailPage = () => {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | 'replyAll' | 'forward'>('new');
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const filteredEmails = emails.filter(email => {
    if (email.folder !== activeFolder) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;

  const handleCompose = (mode: 'new' | 'reply' | 'replyAll' | 'forward', email?: Email) => {
    setComposeMode(mode);
    if (mode === 'new') {
      setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
    } else if (email) {
      if (mode === 'reply') {
        setComposeData({
          to: email.from,
          cc: '',
          bcc: '',
          subject: `Re: ${email.subject}`,
          body: `\n\n--- Original Message ---\nVon: ${email.from}\nDatum: ${new Date(email.date).toLocaleString('de-DE')}\n\n${email.body}`,
        });
      } else if (mode === 'replyAll') {
        setComposeData({
          to: email.from,
          cc: email.cc || '',
          bcc: '',
          subject: `Re: ${email.subject}`,
          body: `\n\n--- Original Message ---\nVon: ${email.from}\nDatum: ${new Date(email.date).toLocaleString('de-DE')}\n\n${email.body}`,
        });
      } else if (mode === 'forward') {
        setComposeData({
          to: '',
          cc: '',
          bcc: '',
          subject: `Fwd: ${email.subject}`,
          body: `\n\n--- Weitergeleitete Nachricht ---\nVon: ${email.from}\nDatum: ${new Date(email.date).toLocaleString('de-DE')}\nAn: ${email.to}\n\n${email.body}`,
        });
      }
    }
    setIsComposeOpen(true);
  };

  const handleSend = () => {
    if (!composeData.to.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte gib einen Empfänger ein.',
        variant: 'destructive',
      });
      return;
    }

    const newEmail: Email = {
      id: Date.now().toString(),
      from: 'max@example.com',
      to: composeData.to,
      cc: composeData.cc || undefined,
      bcc: composeData.bcc || undefined,
      subject: composeData.subject || '(Kein Betreff)',
      body: composeData.body,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      folder: 'sent',
    };

    setEmails(prev => [newEmail, ...prev]);
    setIsComposeOpen(false);
    setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
    toast({
      title: 'E-Mail gesendet',
      description: `E-Mail an ${composeData.to} wurde gesendet.`,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Gestern';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('de-DE', { weekday: 'short' });
    }
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] pb-20 lg:pb-0">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 space-y-2 hidden lg:block">
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" onClick={() => handleCompose('new')}>
              <Plus className="w-4 h-4" />
              Verfassen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {composeMode === 'new' && 'Neue E-Mail'}
                {composeMode === 'reply' && 'Antworten'}
                {composeMode === 'replyAll' && 'Allen antworten'}
                {composeMode === 'forward' && 'Weiterleiten'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>An</Label>
                <Input
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="empfaenger@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>CC</Label>
                <Input
                  value={composeData.cc}
                  onChange={(e) => setComposeData(prev => ({ ...prev, cc: e.target.value }))}
                  placeholder="cc@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>BCC</Label>
                <Input
                  value={composeData.bcc}
                  onChange={(e) => setComposeData(prev => ({ ...prev, bcc: e.target.value }))}
                  placeholder="bcc@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Betreff</Label>
                <Input
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Betreff"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Nachricht</Label>
                <Textarea
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Nachricht schreiben..."
                  className="mt-1 min-h-[200px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSend} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Senden
                </Button>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-1 mt-4">
          {[
            { id: 'inbox', label: 'Posteingang', icon: Mail, count: unreadCount },
            { id: 'sent', label: 'Gesendet', icon: Send },
            { id: 'drafts', label: 'Entwürfe', icon: Mail },
            { id: 'trash', label: 'Papierkorb', icon: Trash2 },
          ].map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id as any)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  activeFolder === folder.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count !== undefined && folder.count > 0 && (
                  <Badge variant="secondary">{folder.count}</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="E-Mails durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => handleCompose('new')}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Keine E-Mails</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer transition-colors',
                    'hover:bg-muted/50',
                    !email.read && 'bg-primary/5',
                    selectedEmail?.id === email.id && 'bg-muted'
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmails(prev => prev.map(e => 
                        e.id === email.id ? { ...e, starred: !e.starred } : e
                      ));
                    }}
                  >
                    <Star className={cn("w-4 h-4", email.starred && "fill-yellow-500 text-yellow-500")} />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("font-medium truncate", !email.read && "font-semibold")}>
                        {email.from.split('@')[0]}
                      </p>
                      {!email.read && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className={cn("text-sm truncate", !email.read ? "font-medium" : "text-muted-foreground")}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.body.substring(0, 60)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(email.date)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCompose('reply', email); }}>
                          <Reply className="w-4 h-4 mr-2" />
                          Antworten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCompose('replyAll', email); }}>
                          <ReplyAll className="w-4 h-4 mr-2" />
                          Allen antworten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCompose('forward', email); }}>
                          <Forward className="w-4 h-4 mr-2" />
                          Weiterleiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                          <Archive className="w-4 h-4 mr-2" />
                          Archivieren
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { 
                            e.stopPropagation();
                            setEmails(prev => prev.filter(e => e.id !== email.id));
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Detail Sidebar */}
      {selectedEmail && (
        <div className="w-0 lg:w-[600px] border-l border-border flex flex-col transition-all">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{selectedEmail.subject}</h2>
              <p className="text-sm text-muted-foreground">
                Von: {selectedEmail.from} • {new Date(selectedEmail.date).toLocaleString('de-DE')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleCompose('reply', selectedEmail)}>
                <Reply className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleCompose('forward', selectedEmail)}>
                <Forward className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)}>
                ×
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Von: {selectedEmail.from}</p>
                <p>An: {selectedEmail.to}</p>
                {selectedEmail.cc && <p>CC: {selectedEmail.cc}</p>}
                {selectedEmail.bcc && <p>BCC: {selectedEmail.bcc}</p>}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailPage;





