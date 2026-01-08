"use client";

import { useState } from "react";
import { Mail, Inbox, Send, Archive, Trash2, Star, Search, Filter, Plus, MoreVertical, Download, Reply, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  attachments?: number;
  category: "primary" | "social" | "promotions" | "updates";
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "Sarah Chen",
    fromEmail: "sarah@example.com",
    subject: "Workflow Review Meeting",
    preview: "Hallo, ich würde gerne einen Termin für das Review unseres neuen Workflows vereinbaren...",
    date: "Heute, 14:30",
    read: false,
    starred: true,
    category: "primary",
  },
  {
    id: "2",
    from: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "New commit in repository",
    preview: "A new commit was pushed to the main branch...",
    date: "Heute, 12:15",
    read: false,
    starred: false,
    category: "updates",
  },
  {
    id: "3",
    from: "Slack",
    fromEmail: "notifications@slack.com",
    subject: "New message in #development",
    preview: "You have 5 new messages in the development channel...",
    date: "Gestern, 18:45",
    read: true,
    starred: false,
    category: "social",
  },
  {
    id: "4",
    from: "Newsletter",
    fromEmail: "news@tech.com",
    subject: "Weekly Tech Updates",
    preview: "Check out the latest updates in automation technology...",
    date: "Gestern, 10:20",
    read: true,
    starred: false,
    category: "promotions",
  },
  {
    id: "5",
    from: "Marcus Weber",
    fromEmail: "marcus@example.com",
    subject: "Integration API Keys",
    preview: "Die API Keys für die neue Integration sind bereit...",
    date: "2 Tage",
    read: false,
    starred: true,
    attachments: 2,
    category: "primary",
  },
];

const emailProviders = [
  { value: "gmail", label: "Gmail", icon: "📧" },
  { value: "outlook", label: "Microsoft Outlook", icon: "📬" },
  { value: "yahoo", label: "Yahoo Mail", icon: "📮" },
  { value: "custom", label: "Custom IMAP/SMTP", icon: "⚙️" },
];

export default function TeamInboxPage() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const { toast } = useToast();

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || email.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = emails.filter((e) => !e.read).length;
  const starredCount = emails.filter((e) => e.starred).length;

  const handleConnectEmail = () => {
    if (!selectedProvider) {
      toast({
        title: "Fehler",
        description: "Bitte wähle einen E-Mail-Anbieter aus.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "E-Mail verbunden",
      description: `${emailProviders.find((p) => p.value === selectedProvider)?.label} wurde erfolgreich verbunden.`,
    });
    setConnectDialogOpen(false);
    setSelectedProvider("");
  };

  const handleToggleStar = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  };

  const handleToggleRead = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, read: !e.read } : e)));
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Inbox}
        title="Posteingang"
        description="E-Mails verwalten und organisieren"
      />
      
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Button
            className="w-full bg-gradient-to-r from-primary to-purple-500"
            onClick={() => setConnectDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            E-Mail verbinden
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                filterCategory === "all" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setFilterCategory("all")}
            >
              <Inbox className="h-4 w-4" />
              <span>Alle E-Mails</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </button>
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                filterCategory === "primary" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setFilterCategory("primary")}
            >
              <Mail className="h-4 w-4" />
              <span>Wichtig</span>
            </button>
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                filterCategory === "starred" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setFilterCategory("starred")}
            >
              <Star className="h-4 w-4" />
              <span>Markiert</span>
              {starredCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {starredCount}
                </Badge>
              )}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent">
              <Send className="h-4 w-4" />
              <span>Gesendet</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent">
              <Archive className="h-4 w-4" />
              <span>Archiv</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent">
              <Trash2 className="h-4 w-4" />
              <span>Papierkorb</span>
            </button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Bar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="E-Mails durchsuchen..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 border-r">
            <div className="divide-y">
              {filteredEmails.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine E-Mails gefunden</p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                      !email.read && "bg-primary/5",
                      selectedEmail?.id === email.id && "bg-accent"
                    )}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {email.from.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("font-medium text-sm truncate", !email.read && "font-semibold")}>
                            {email.from}
                          </span>
                          {email.starred && (
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                          )}
                          {email.attachments && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {email.attachments} Anhänge
                            </Badge>
                          )}
                        </div>
                        <p className={cn("text-sm truncate mb-1", !email.read && "font-medium")}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                        <p className="text-xs text-muted-foreground mt-1">{email.date}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStar(email.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            {email.starred ? "Markierung entfernen" : "Markieren"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleRead(email.id)}>
                            {email.read ? "Als ungelesen markieren" : "Als gelesen markieren"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archivieren
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Email Detail View */}
          {selectedEmail && (
            <div className="w-[600px] border-l bg-card flex flex-col shrink-0">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {selectedEmail.from.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{selectedEmail.from}</p>
                        <p className="text-xs">{selectedEmail.fromEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStar(selectedEmail.id)}>
                      <Star className={cn("h-4 w-4", selectedEmail.starred && "fill-yellow-500 text-yellow-500")} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Herunterladen
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archivieren
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{selectedEmail.date}</p>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.preview}
                    {"\n\n"}
                    Dies ist eine Beispiel-E-Mail. In einer echten Implementierung würde hier der vollständige E-Mail-Inhalt angezeigt werden.
                  </p>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Connect Email Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-Mail-Postfach verbinden</DialogTitle>
            <DialogDescription>
              Wähle deinen E-Mail-Anbieter aus, um dein Postfach zu verbinden.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>E-Mail-Anbieter</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Anbieter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {emailProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <div className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        <span>{provider.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProvider === "custom" && (
              <>
                <div className="space-y-2">
                  <Label>IMAP Server</Label>
                  <Input placeholder="imap.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Benutzername</Label>
                  <Input placeholder="deine@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Passwort</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConnectEmail} className="bg-gradient-to-r from-primary to-purple-500">
              Verbinden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
