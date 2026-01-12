"use client";

import { useState } from "react";
import { Send, Inbox, Archive, Trash2, Star, Search, Plus, Filter, MoreVertical, Reply, ReplyAll, Forward, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { PageHeader } from "@/components/dashboard/PageHeader";

interface MailMessage {
  id: string;
  to: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
}

const mockSentMails: MailMessage[] = [
  {
    id: "1",
    to: "team@example.com",
    subject: "Workflow Update - Q4 2024",
    preview: "Hallo Team, ich möchte euch über die neuesten Updates zu unseren Workflows informieren...",
    date: "Heute, 16:45",
    read: true,
    starred: false,
  },
  {
    id: "2",
    to: "client@example.com",
    subject: "Projektstatus Update",
    preview: "Sehr geehrter Kunde, hier ist der aktuelle Status Ihres Projekts...",
    date: "Gestern, 11:20",
    read: true,
    starred: true,
  },
  {
    id: "3",
    to: "support@example.com",
    subject: "Feature Request",
    preview: "Hallo, ich hätte eine Anfrage für ein neues Feature...",
    date: "2 Tage",
    read: false,
    starred: false,
  },
];

export default function TeamMailPage() {
  const [mails, setMails] = useState(mockSentMails);
  const [selectedMail, setSelectedMail] = useState<MailMessage | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const filteredMails = mails.filter(
    (mail) =>
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    const newMail: MailMessage = {
      id: Date.now().toString(),
      to: to.trim(),
      subject: subject.trim(),
      preview: body.substring(0, 100) + "...",
      date: "Gerade eben",
      read: false,
      starred: false,
    };

    setMails([newMail, ...mails]);
    setTo("");
    setSubject("");
    setBody("");
    setComposeOpen(false);
    toast({
      title: "E-Mail gesendet",
      description: `E-Mail an ${to} wurde erfolgreich gesendet.`,
    });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Mail}
        title="Mail"
        description="E-Mails senden und verwalten"
      />
      
    <div className="flex h-[calc(100vh-4rem)] min-h-[600px] bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Button
            className="w-full bg-gradient-to-r from-primary to-purple-500"
            onClick={() => setComposeOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Verfassen
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-accent text-accent-foreground">
              <Send className="h-4 w-4" />
              <span>Gesendet</span>
              <Badge variant="secondary" className="ml-auto">
                {mails.length}
              </Badge>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent">
              <Inbox className="h-4 w-4" />
              <span>Entwürfe</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent">
              <Star className="h-4 w-4" />
              <span>Wichtig</span>
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

        {/* Mail List */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 border-r">
            <div className="divide-y">
              {filteredMails.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine E-Mails gefunden</p>
                </div>
              ) : (
                filteredMails.map((mail) => (
                  <div
                    key={mail.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                      !mail.read && "bg-primary/5",
                      selectedMail?.id === mail.id && "bg-accent"
                    )}
                    onClick={() => setSelectedMail(mail)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {mail.to.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("font-medium text-sm truncate", !mail.read && "font-semibold")}>
                            An: {mail.to}
                          </span>
                          {mail.starred && (
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                          )}
                        </div>
                        <p className={cn("text-sm truncate mb-1", !mail.read && "font-medium")}>
                          {mail.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{mail.preview}</p>
                        <p className="text-xs text-muted-foreground mt-1">{mail.date}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Antworten
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ReplyAll className="h-4 w-4 mr-2" />
                            Allen antworten
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Weiterleiten
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

          {/* Mail Detail View */}
          {selectedMail && (
            <div className="w-[600px] border-l bg-card flex flex-col shrink-0">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">{selectedMail.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>An: {selectedMail.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                <p className="text-xs text-muted-foreground">{selectedMail.date}</p>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMail.preview}
                    {"\n\n"}
                    Dies ist eine Beispiel-E-Mail. In einer echten Implementierung würde hier der vollständige E-Mail-Inhalt angezeigt werden.
                  </p>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neue E-Mail verfassen</DialogTitle>
            <DialogDescription>
              Sende eine neue E-Mail an einen Empfänger.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>An</Label>
              <Input
                placeholder="empfaenger@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Betreff</Label>
              <Input
                placeholder="Betreff der E-Mail"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nachricht</Label>
              <Textarea
                placeholder="Nachricht eingeben..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSend} className="bg-gradient-to-r from-primary to-purple-500">
              <Send className="h-4 w-4 mr-2" />
              Senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
