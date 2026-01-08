"use client";

import { useState } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Clock, 
  Search, 
  Users, 
  Hash,
  Settings,
  Bell,
  Pin,
  Archive,
  Edit2,
  Trash2,
  UserPlus,
  CheckCircle2,
  XCircle,
  Filter,
  Grid3x3,
  List,
  Send,
  Paperclip,
  Smile,
  MessageCircle,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  avatar: string;
  initials: string;
  status: "online" | "offline" | "away" | "busy";
  lastActive: string;
  department?: string;
}

interface ChannelMessage {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  message: string;
  timestamp: Date;
  edited?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: "public" | "private";
  unread?: number;
  pinned?: boolean;
  memberIds: string[];
  description?: string;
  messages?: ChannelMessage[];
}

const initialChannels: Channel[] = [
  { 
    id: "general", 
    name: "General", 
    type: "public", 
    unread: 0, 
    pinned: true, 
    memberIds: ["1", "2", "3", "4", "5", "6"], 
    description: "Allgemeiner Kanal für alle Teammitglieder",
    messages: [
      { id: "1", userId: "1", userName: "Adrian Thomé", userInitials: "AT", message: "Willkommen im General Channel! 👋", timestamp: new Date(Date.now() - 86400000) },
      { id: "2", userId: "2", userName: "Sarah Chen", userInitials: "SC", message: "Hallo zusammen! Freue mich auf die Zusammenarbeit.", timestamp: new Date(Date.now() - 82800000) },
    ]
  },
  { 
    id: "announcements", 
    name: "Announcements", 
    type: "public", 
    unread: 2, 
    memberIds: ["1", "2", "3"], 
    description: "Wichtige Ankündigungen",
    messages: [
      { id: "3", userId: "1", userName: "Adrian Thomé", userInitials: "AT", message: "Neues Feature wurde deployed! 🚀", timestamp: new Date(Date.now() - 3600000) },
    ]
  },
  { 
    id: "development", 
    name: "Development", 
    type: "private", 
    unread: 5, 
    memberIds: ["2", "6"], 
    description: "Entwicklungsteam",
    messages: []
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    type: "public", 
    unread: 0, 
    memberIds: ["3", "4"], 
    description: "Marketing-Team",
    messages: []
  },
  { 
    id: "support", 
    name: "Support", 
    type: "public", 
    unread: 1, 
    memberIds: ["4", "5"], 
    description: "Kundensupport",
    messages: []
  },
];

const initialTeamMembers: TeamMember[] = [
  { 
    id: "1", 
    name: "Adrian Thomé", 
    email: "adrian@arvo-labs.com", 
    role: "Admin", 
    avatar: "", 
    initials: "AT", 
    status: "online", 
    lastActive: "Now",
    department: "Management"
  },
  { 
    id: "2", 
    name: "Sarah Chen", 
    email: "sarah@arvo-labs.com", 
    role: "Editor", 
    avatar: "", 
    initials: "SC", 
    status: "online", 
    lastActive: "Now",
    department: "Development"
  },
  { 
    id: "3", 
    name: "Marcus Weber", 
    email: "marcus@arvo-labs.com", 
    role: "Viewer", 
    avatar: "", 
    initials: "MW", 
    status: "offline", 
    lastActive: "2h ago",
    department: "Marketing"
  },
  { 
    id: "4", 
    name: "Lisa Müller", 
    email: "lisa@arvo-labs.com", 
    role: "Editor", 
    avatar: "", 
    initials: "LM", 
    status: "away", 
    lastActive: "15 min ago",
    department: "Design"
  },
  { 
    id: "5", 
    name: "Tom Anderson", 
    email: "tom@arvo-labs.com", 
    role: "Viewer", 
    avatar: "", 
    initials: "TA", 
    status: "busy", 
    lastActive: "1d ago",
    department: "Sales"
  },
  {
    id: "6",
    name: "Emma Schmidt",
    email: "emma@arvo-labs.com",
    role: "Editor",
    avatar: "",
    initials: "ES",
    status: "online",
    lastActive: "Now",
    department: "Development"
  },
];

const StatusIndicator = ({ status }: { status: TeamMember["status"] }) => {
  const colors = {
    online: "bg-primary border-primary",
    offline: "bg-muted-foreground border-muted-foreground",
    away: "bg-warning border-warning",
    busy: "bg-destructive border-destructive",
  };

  return (
    <span className={cn(
      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
      colors[status]
    )} />
  );
};

const RoleBadge = ({ role }: { role: TeamMember["role"] }) => {
  const variants: Record<string, { bg: string; text: string; border: string }> = {
    Admin: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    Editor: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    Viewer: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  };

  const variant = variants[role];

  return (
    <Badge variant="outline" className={cn(variant.bg, variant.text, variant.border, "text-xs")}>
      <Shield className="h-3 w-3 mr-1" />
      {role}
    </Badge>
  );
};

export default function TeamTeamsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [channels, setChannels] = useState(initialChannels);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [activeChannel, setActiveChannel] = useState<string>("general");
  const [channelSearchQuery, setChannelSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Viewer");
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "Viewer" as TeamMember["role"], department: "" });
  const [searchMemberOpen, setSearchMemberOpen] = useState(false);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [assignMemberOpen, setAssignMemberOpen] = useState(false);
  const [membersToAssign, setMembersToAssign] = useState<string[]>([]);
  const [keywordsConfigOpen, setKeywordsConfigOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [mentionNotifications, setMentionNotifications] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [fileInputRefState, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  const activeChannelData = channels.find((c) => c.id === activeChannel);

  const activeChannelMembers = activeChannelData 
    ? teamMembers.filter(m => activeChannelData.memberIds.includes(m.id))
    : teamMembers;

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(channelSearchQuery.toLowerCase())
  );

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: "",
      initials: inviteEmail.substring(0, 2).toUpperCase(),
      status: "offline",
      lastActive: "Never",
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Viewer");
    toast({
      title: "Einladung gesendet",
      description: `Einladung wurde an ${inviteEmail} gesendet.`,
    });
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department || "",
    });
    setEditMemberOpen(true);
  };

  const handleSaveMember = () => {
    if (!selectedMember) return;

    setTeamMembers(
      teamMembers.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              name: editForm.name,
              email: editForm.email,
              role: editForm.role,
              department: editForm.department || undefined,
            }
          : m
      )
    );
    setEditMemberOpen(false);
    setSelectedMember(null);
    toast({
      title: "Mitglied aktualisiert",
      description: `${editForm.name} wurde erfolgreich aktualisiert.`,
    });
  };

  const handleRemoveMember = (member: TeamMember) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== member.id));
    toast({
      title: "Mitglied entfernt",
      description: `${member.name} wurde aus dem Team entfernt.`,
    });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChannelData) return;

    const currentUser = teamMembers[0];
    const newMessage: ChannelMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userInitials: currentUser.initials,
      message: messageInput.trim(),
      timestamp: new Date(),
    };

    setChannels(
      channels.map((c) =>
        c.id === activeChannel
          ? { ...c, messages: [...(c.messages || []), newMessage], unread: 0 }
          : c
      )
    );

    setMessageInput("");
    toast({
      title: "Nachricht gesendet",
      description: "Ihre Nachricht wurde im Channel gepostet.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf maximal 10MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Datei angehängt",
      description: `${file.name} wurde erfolgreich angehängt. (Simuliert)`,
    });

    if (messageInput.trim() || file.name) {
      const fileMessage = messageInput 
        ? `${messageInput}\n📎 ${file.name}`
        : `📎 ${file.name}`;
      setMessageInput(fileMessage);
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setEmojiPickerOpen(false);
  };

  const popularEmojis = [
    "😀", "😂", "🥰", "😎", "🤔", "😊", "👍", "❤️", "🔥", "✨",
    "🎉", "✅", "❌", "⚠️", "💡", "🚀", "📝", "📎", "🔔", "⭐",
    "💯", "🎯", "👏", "🙌", "🤝", "💪", "🎊", "🎈", "🎁", "🍕"
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "gerade eben";
    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    if (days < 7) return `vor ${days} Tag${days !== 1 ? "en" : ""}`;
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  };

  const handleToggleChannelPin = (channelId: string) => {
    setChannels(
      channels.map((c) =>
        c.id === channelId ? { ...c, pinned: !c.pinned } : c
      )
    );
  };

  const handleMarkChannelRead = (channelId: string) => {
    setChannels(
      channels.map((c) => (c.id === channelId ? { ...c, unread: 0 } : c))
    );
    toast({
      title: "Als gelesen markiert",
      description: "Alle Nachrichten wurden als gelesen markiert.",
    });
  };

  const handleCreateChannel = () => {
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: "New Channel",
      type: "public",
      unread: 0,
      memberIds: ["1"],
    };
    setChannels([...channels, newChannel]);
    handleChannelSelect(newChannel.id);
    setChannelSettingsOpen(true);
    toast({
      title: "Channel erstellt",
      description: "Neuer Channel wurde erstellt. Weisen Sie nun Mitglieder zu.",
    });
  };

  const handleAssignMembersToChannel = () => {
    if (!activeChannelData) return;
    
    setChannels(
      channels.map((c) =>
        c.id === activeChannel ? { ...c, memberIds: membersToAssign } : c
      )
    );
    setAssignMemberOpen(false);
    setMembersToAssign([]);
    toast({
      title: "Mitglieder zugewiesen",
      description: `${membersToAssign.length} Mitglieder wurden dem Channel zugewiesen.`,
    });
  };

  const handleChannelSearch = () => {
    setSearchMemberOpen(true);
    toast({
      title: "Suche",
      description: "Suche in diesem Channel...",
    });
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Benachrichtigungen deaktiviert" : "Benachrichtigungen aktiviert",
      description: `Kanalbenachrichtigungen wurden ${notificationsEnabled ? "deaktiviert" : "aktiviert"}.`,
    });
  };

  const handleTogglePin = () => {
    if (activeChannelData) {
      handleToggleChannelPin(activeChannel);
      toast({
        title: activeChannelData.pinned ? "Anheften aufgehoben" : "Angeheftet",
        description: `Channel wurde ${activeChannelData.pinned ? "vom Anheften entfernt" : "angeheftet"}.`,
      });
    }
  };

  const handleArchiveChannel = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel) {
      setChannels(channels.filter((c) => c.id !== channelId));
      if (activeChannel === channelId) {
        const remainingChannels = channels.filter((c) => c.id !== channelId);
        if (remainingChannels.length > 0) {
          handleChannelSelect(remainingChannels[0].id);
        } else {
          setActiveChannel("");
        }
      }
      toast({
        title: "Channel archiviert",
        description: `${channel.name} wurde erfolgreich archiviert.`,
      });
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannel(channelId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Left Sidebar - Channels */}
      <div className={cn(
        "border-r border-border bg-card flex flex-col shrink-0 transition-all duration-200 overflow-hidden",
        sidebarOpen ? "w-64" : "w-0 border-r-0"
      )}>
        {sidebarOpen && (
        <>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base">Kanäle</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCreateChannel} title="Channel erstellen">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kanal suchen..."
              className="pl-9 h-9 text-sm"
              value={channelSearchQuery}
              onChange={(e) => setChannelSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredChannels.filter((c) => c.pinned).length > 0 && (
              <>
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Angeheftet
                </div>
                {filteredChannels
                  .filter((c) => c.pinned)
                  .map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent group relative",
                        activeChannel === channel.id && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 text-left truncate">{channel.name}</span>
                      {channel.unread && channel.unread > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs flex items-center justify-center">
                          {channel.unread > 99 ? "99+" : channel.unread}
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-1">
                            <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleChannelPin(channel.id)}>
                            {channel.pinned ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Anheften aufheben
                              </>
                            ) : (
                              <>
                                <Pin className="h-4 w-4 mr-2" />
                                Anheften
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkChannelRead(channel.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Als gelesen markieren
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleArchiveChannel(channel.id)}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archivieren
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </button>
                  ))}
                <Separator className="my-2" />
              </>
            )}
              {filteredChannels.filter((c) => !c.pinned).length > 0 && (
                <>
                  {filteredChannels.filter((c) => c.pinned).length > 0 && (
                    <Separator className="my-2" />
                  )}
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Kanäle
                  </div>
                </>
              )}
            {filteredChannels
              .filter((c) => !c.pinned)
              .map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent group relative",
                    activeChannel === channel.id && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left truncate">{channel.name}</span>
                  {channel.unread && channel.unread > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs flex items-center justify-center">
                      {channel.unread > 99 ? "99+" : channel.unread}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-1">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleChannelPin(channel.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        Anheften
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMarkChannelRead(channel.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Als gelesen markieren
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleArchiveChannel(channel.id)}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archivieren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full justify-start h-9 text-sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Mitglied einladen
          </Button>
        </div>
        </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background transition-all duration-200">
        {/* Top Bar */}
        <div className="border-b border-border bg-card shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3 min-w-0">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSidebarOpen(true)}
                  title="Kanäle anzeigen"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <Hash className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <h1 className="font-semibold text-lg truncate">{activeChannelData?.name || "General"}</h1>
                <p className="text-sm text-muted-foreground">
                  {activeChannelData?.type === "private" ? "Privater Kanal" : "Öffentlicher Kanal"} • {activeChannelData?.memberIds?.length || 0} Mitglieder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                title="Suchen"
                onClick={handleChannelSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", notificationsEnabled && "bg-primary/10 text-primary")}
                title={notificationsEnabled ? "Benachrichtigungen aktiv" : "Benachrichtigungen deaktiviert"}
                onClick={handleToggleNotifications}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", activeChannelData?.pinned && "bg-primary/10 text-primary")}
                title={activeChannelData?.pinned ? "Anheften aufheben" : "Anheften"}
                onClick={handleTogglePin}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                title="Channel-Einstellungen"
                onClick={() => setChannelSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {activeChannelData?.messages && activeChannelData.messages.length > 0 ? (
                activeChannelData.messages.map((msg) => {
                  const sender = teamMembers.find((m) => m.id === msg.userId);
                  return (
                    <div key={msg.id} className="flex items-start gap-3 group">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {msg.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{msg.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-2">Keine Nachrichten in diesem Channel</p>
                  <p className="text-xs text-muted-foreground">
                    Seien Sie der Erste, der eine Nachricht sendet!
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border bg-card p-4">
            <div className="max-w-4xl mx-auto flex items-end gap-2">
              <input
                type="file"
                ref={(el) => setFileInputRef(el)}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 shrink-0" 
                title="Datei anhängen"
                onClick={() => fileInputRefState?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder={`Nachricht in #${activeChannelData?.name || "channel"} senden...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="pr-10 min-h-[36px]"
                />
                <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      title="Emoji"
                      type="button"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3" align="end">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Emoji auswählen</div>
                      <div className="grid grid-cols-10 gap-1">
                        {popularEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="p-2 hover:bg-accent rounded-md text-lg transition-colors cursor-pointer"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-gradient-to-r from-primary to-purple-500 h-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teammitglied einladen</DialogTitle>
            <DialogDescription>
              Senden Sie eine Einladung an ein neues Teammitglied per E-Mail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">E-Mail-Adresse *</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="name@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Rolle *</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as TeamMember["role"])}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Vollzugriff</SelectItem>
                  <SelectItem value="Editor">Editor - Kann bearbeiten</SelectItem>
                  <SelectItem value="Viewer">Viewer - Nur Ansicht</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleInviteMember}
              className="bg-gradient-to-r from-primary to-purple-500"
            >
              <Mail className="h-4 w-4 mr-2" />
              Einladung senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitglied bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Details des Teammitglieds.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-Mail-Adresse *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rolle *</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value as TeamMember["role"] })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Abteilung</Label>
              <Input
                id="edit-department"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                placeholder="z.B. Development, Marketing..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveMember} className="bg-gradient-to-r from-primary to-purple-500">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Channel Settings Dialog */}
      <Dialog open={channelSettingsOpen} onOpenChange={setChannelSettingsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Channel-Einstellungen</DialogTitle>
            <DialogDescription>
              Verwalten Sie die Einstellungen für "{activeChannelData?.name || "Channel"}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Allgemeine Einstellungen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="channel-name">Channel-Name</Label>
                  <Input
                    id="channel-name"
                    value={activeChannelData?.name || ""}
                    onChange={(e) => {
                      setChannels(
                        channels.map((c) =>
                          c.id === activeChannel ? { ...c, name: e.target.value } : c
                        )
                      );
                    }}
                    placeholder="Channel-Name eingeben..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel-description">Beschreibung</Label>
                  <Input
                    id="channel-description"
                    value={activeChannelData?.description || ""}
                    onChange={(e) => {
                      setChannels(
                        channels.map((c) =>
                          c.id === activeChannel ? { ...c, description: e.target.value } : c
                        )
                      );
                    }}
                    placeholder="Beschreibung des Channels..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel-type">Typ</Label>
                  <Select
                    value={activeChannelData?.type || "public"}
                    onValueChange={(value) => {
                      setChannels(
                        channels.map((c) =>
                          c.id === activeChannel ? { ...c, type: value as "public" | "private" } : c
                        )
                      );
                    }}
                  >
                    <SelectTrigger id="channel-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Öffentlich - Alle können beitreten</SelectItem>
                      <SelectItem value="private">Privat - Nur eingeladene Mitglieder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Members Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Kanalmitglieder</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeChannelData?.memberIds.length || 0} Mitglieder in diesem Channel
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMembersToAssign(activeChannelData?.memberIds || []);
                    setChannelSettingsOpen(false);
                    setAssignMemberOpen(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Verwalten
                </Button>
              </div>
              <ScrollArea className="h-64 border rounded-md">
                <div className="p-3 space-y-2">
                  {activeChannelMembers.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Keine Mitglieder zugewiesen</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setMembersToAssign([]);
                          setChannelSettingsOpen(false);
                          setAssignMemberOpen(true);
                        }}
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-2" />
                        Mitglieder hinzufügen
                      </Button>
                    </div>
                  ) : (
                    activeChannelMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative shrink-0">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs font-medium">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <StatusIndicator status={member.status} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <RoleBadge role={member.role} />
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Benachrichtigungen</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <Label htmlFor="notifications-toggle" className="text-sm font-medium">
                      Channel-Benachrichtigungen
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Erhalte Benachrichtigungen für alle Nachrichten in diesem Channel
                    </p>
                  </div>
                  <Button
                    variant={notificationsEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleNotifications}
                    id="notifications-toggle"
                  >
                    {notificationsEnabled ? "Aktiviert" : "Deaktiviert"}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <Label className="text-sm font-medium">Mentions & Keywords</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Benachrichtigungen nur bei Erwähnungen oder Schlüsselwörtern
                      {keywords.length > 0 && (
                        <span className="block mt-1 text-primary">
                          {keywords.length} Schlüsselwort{keywords.length !== 1 ? 'e' : ''} konfiguriert
                        </span>
                      )}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setKeywordsConfigOpen(true)}
                  >
                    Konfigurieren
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Channel Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Channel-Aktionen</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (activeChannelData) {
                      handleToggleChannelPin(activeChannel);
                      toast({
                        title: activeChannelData.pinned ? "Anheften aufgehoben" : "Angeheftet",
                        description: `Channel wurde ${activeChannelData.pinned ? "vom Anheften entfernt" : "angeheftet"}.`,
                      });
                    }
                  }}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {activeChannelData?.pinned ? "Anheften aufheben" : "Channel anheften"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (activeChannelData) {
                      handleMarkChannelRead(activeChannel);
                    }
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Als gelesen markieren
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    if (activeChannelData) {
                      handleArchiveChannel(activeChannel);
                      setChannelSettingsOpen(false);
                    }
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Channel archivieren
                </Button>
              </div>
            </div>

            {activeChannelData?.type === "private" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Berechtigungen</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <Label className="text-sm font-medium">Mitglieder können Nachrichten senden</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Erlaube allen Mitgliedern, Nachrichten zu posten
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Aktiviert
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <Label className="text-sm font-medium">Mitglieder können Dateien teilen</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Erlaube allen Mitgliedern, Dateien hochzuladen
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Aktiviert
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChannelSettingsOpen(false)}>
              Schließen
            </Button>
            <Button
              onClick={() => {
                setChannelSettingsOpen(false);
                toast({
                  title: "Einstellungen gespeichert",
                  description: "Channel-Einstellungen wurden erfolgreich gespeichert.",
                });
              }}
              className="bg-gradient-to-r from-primary to-purple-500"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Members Dialog */}
      <Dialog open={assignMemberOpen} onOpenChange={setAssignMemberOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mitglieder zuweisen</DialogTitle>
            <DialogDescription>
              Wählen Sie die Mitglieder aus, die diesem Channel zugewiesen werden sollen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-md max-h-96 overflow-y-auto">
              <div className="divide-y">
                {teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={membersToAssign.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMembersToAssign([...membersToAssign, member.id]);
                        } else {
                          setMembersToAssign(membersToAssign.filter((id) => id !== member.id));
                        }
                      }}
                      className="rounded border-border"
                    />
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <StatusIndicator status={member.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                    <RoleBadge role={member.role} />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignMemberOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleAssignMembersToChannel}
              className="bg-gradient-to-r from-primary to-purple-500"
            >
              Zuweisen ({membersToAssign.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Channel Search Dialog */}
      <Dialog open={searchMemberOpen} onOpenChange={setSearchMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suche im Channel</DialogTitle>
            <DialogDescription>
              Suchen Sie nach Nachrichten, Dateien und Mitgliedern in diesem Channel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Suche nach Nachrichten, Dateien, Mitgliedern..."
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Verfügbare Suchoperatoren:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><code className="bg-muted px-1 rounded">from:@username</code> - Nachrichten von einem Benutzer</li>
                <li><code className="bg-muted px-1 rounded">has:file</code> - Nachrichten mit Dateien</li>
                <li><code className="bg-muted px-1 rounded">in:channel</code> - Suche in spezifischem Channel</li>
                <li><code className="bg-muted px-1 rounded">before:date</code> - Nachrichten vor einem Datum</li>
                <li><code className="bg-muted px-1 rounded">after:date</code> - Nachrichten nach einem Datum</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSearchMemberOpen(false)}>
              Schließen
            </Button>
            <Button onClick={() => {
              setSearchMemberOpen(false);
              toast({
                title: "Suche gestartet",
                description: "Die Suche wird durchgeführt...",
              });
            }}>
              <Search className="h-4 w-4 mr-2" />
              Suchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keywords & Mentions Configuration Dialog */}
      <Dialog open={keywordsConfigOpen} onOpenChange={setKeywordsConfigOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mentions & Keywords konfigurieren</DialogTitle>
            <DialogDescription>
              Erhalten Sie Benachrichtigungen nur bei Erwähnungen oder bestimmten Schlüsselwörtern in diesem Channel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Mentions Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Label className="text-sm font-medium">Bei Erwähnungen benachrichtigen</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Erhalte Benachrichtigungen, wenn jemand dich in diesem Channel erwähnt (@mention)
                  </p>
                </div>
                <Button
                  variant={mentionNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMentionNotifications(!mentionNotifications);
                    toast({
                      title: mentionNotifications ? "Erwähnungen deaktiviert" : "Erwähnungen aktiviert",
                      description: `Benachrichtigungen bei Erwähnungen wurden ${!mentionNotifications ? "aktiviert" : "deaktiviert"}.`,
                    });
                  }}
                >
                  {mentionNotifications ? "Aktiviert" : "Deaktiviert"}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Keywords Management */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Schlüsselwörter</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Erhalte Benachrichtigungen, wenn eines dieser Wörter in Nachrichten vorkommt
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {keywords.length} aktiv
                </Badge>
              </div>

              {/* Add Keyword */}
              <div className="flex gap-2">
                <Input
                  placeholder="Schlüsselwort eingeben..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newKeyword.trim()) {
                      if (!keywords.includes(newKeyword.trim().toLowerCase())) {
                        setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
                        setNewKeyword("");
                        toast({
                          title: "Schlüsselwort hinzugefügt",
                          description: `"${newKeyword.trim()}" wurde zur Liste hinzugefügt.`,
                        });
                      } else {
                        toast({
                          title: "Schlüsselwort bereits vorhanden",
                          description: "Dieses Schlüsselwort ist bereits in der Liste.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newKeyword.trim()) {
                      if (!keywords.includes(newKeyword.trim().toLowerCase())) {
                        setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
                        setNewKeyword("");
                        toast({
                          title: "Schlüsselwort hinzugefügt",
                          description: `"${newKeyword.trim()}" wurde zur Liste hinzugefügt.`,
                        });
                      } else {
                        toast({
                          title: "Schlüsselwort bereits vorhanden",
                          description: "Dieses Schlüsselwort ist bereits in der Liste.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  disabled={!newKeyword.trim() || keywords.includes(newKeyword.trim().toLowerCase())}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Keywords List */}
              {keywords.length > 0 ? (
                <div className="border rounded-md p-3 bg-muted/30 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm px-3 py-1 flex items-center gap-2"
                      >
                        <span>{keyword}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            const updatedKeywords = keywords.filter((_, i) => i !== index);
                            setKeywords(updatedKeywords);
                            toast({
                              title: "Schlüsselwort entfernt",
                              description: `"${keyword}" wurde aus der Liste entfernt.`,
                            });
                          }}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-6 text-center bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Noch keine Schlüsselwörter hinzugefügt
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fügen Sie Schlüsselwörter hinzu, um Benachrichtigungen zu erhalten, wenn sie in Nachrichten vorkommen.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Info Box */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 text-primary mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Tipps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Schlüsselwörter sind nicht case-sensitive</li>
                    <li>Benachrichtigungen werden nur für neue Nachrichten gesendet</li>
                    <li>Erwähnungen haben immer Vorrang vor Schlüsselwort-Benachrichtigungen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setKeywordsConfigOpen(false);
              }}
            >
              Schließen
            </Button>
            <Button
              onClick={() => {
                setKeywordsConfigOpen(false);
                toast({
                  title: "Einstellungen gespeichert",
                  description: `Mentions & Keywords wurden erfolgreich konfiguriert. ${keywords.length} Schlüsselwort${keywords.length !== 1 ? 'e' : ''} aktiv.`,
                });
              }}
              className="bg-gradient-to-r from-primary to-purple-500"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

