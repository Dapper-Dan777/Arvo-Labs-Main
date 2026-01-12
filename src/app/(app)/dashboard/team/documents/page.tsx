"use client";

import { useState } from "react";
import { FileText, Upload, Search, Filter, MoreVertical, Download, Trash2, File, Folder, Plus, Sparkles, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xls" | "txt" | "other";
  size: string;
  modified: string;
  folder?: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Workflow_Dokumentation.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "Heute, 10:30",
    folder: "Dokumentation",
  },
  {
    id: "2",
    name: "API_Integration_Guide.docx",
    type: "doc",
    size: "1.8 MB",
    modified: "Gestern, 14:20",
    folder: "Anleitungen",
  },
  {
    id: "3",
    name: "Q4_Report_2024.xlsx",
    type: "xls",
    size: "5.2 MB",
    modified: "2 Tage",
    folder: "Reports",
  },
  {
    id: "4",
    name: "Meeting_Notes.txt",
    type: "txt",
    size: "45 KB",
    modified: "3 Tage",
  },
  {
    id: "5",
    name: "Contract_Template.pdf",
    type: "pdf",
    size: "890 KB",
    modified: "1 Woche",
    folder: "Vorlagen",
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return "📄";
    case "doc":
      return "📝";
    case "xls":
      return "📊";
    case "txt":
      return "📃";
    default:
      return "📎";
  }
};

export default function TeamDocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [summarizeDialogOpen, setSummarizeDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [summarizePrompt, setSummarizePrompt] = useState("");
  const { toast } = useToast();

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    toast({
      title: "Dokument hochgeladen",
      description: "Das Dokument wurde erfolgreich hochgeladen.",
    });
    setUploadDialogOpen(false);
  };

  const handleSummarize = () => {
    if (!selectedDocument) return;
    toast({
      title: "Zusammenfassung erstellt",
      description: `Eine KI-Zusammenfassung für "${selectedDocument.name}" wird erstellt...`,
    });
    setSummarizeDialogOpen(false);
    setSelectedDocument(null);
    setSummarizePrompt("");
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast({
      title: "Dokument gelöscht",
      description: "Das Dokument wurde erfolgreich gelöscht.",
    });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={FileText}
        title="Dokumente"
        description="Verwalte und organisiere deine Dokumente effizient"
      />
      
      <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setSummarizeDialogOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Zusammenfassen
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-gradient-to-r from-primary to-purple-500">
            <Upload className="h-4 w-4 mr-2" />
            Hochladen
          </Button>
        </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Dokumente durchsuchen..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="doc">Word</SelectItem>
            <SelectItem value="xls">Excel</SelectItem>
            <SelectItem value="txt">Text</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            Liste
          </Button>
        </div>
      </div>

      {/* Documents */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle Dokumente</TabsTrigger>
          <TabsTrigger value="recent">Kürzlich</TabsTrigger>
          <TabsTrigger value="starred">Favoriten</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{getFileIcon(doc.type)}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Herunterladen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedDocument(doc);
                            setSummarizeDialogOpen(true);
                          }}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Zusammenfassen
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-medium text-sm mb-1 truncate">{doc.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>{doc.modified}</span>
                    </div>
                    {doc.folder && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {doc.folder}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.modified}</span>
                          {doc.folder && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {doc.folder}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Herunterladen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedDocument(doc);
                            setSummarizeDialogOpen(true);
                          }}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Zusammenfassen
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
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
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine kürzlich geöffneten Dokumente</p>
          </div>
        </TabsContent>

        <TabsContent value="starred">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine favorisierten Dokumente</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
            <DialogDescription>
              Wähle eine Datei aus, die du hochladen möchtest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Ziehe Dateien hierher oder klicke zum Auswählen
              </p>
              <Button variant="outline" size="sm">
                Datei auswählen
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Ordner (optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ordner auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docs">Dokumentation</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="templates">Vorlagen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpload} className="bg-gradient-to-r from-primary to-purple-500">
              Hochladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summarize Dialog */}
      <Dialog open={summarizeDialogOpen} onOpenChange={setSummarizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dokument zusammenfassen</DialogTitle>
            <DialogDescription>
              {selectedDocument
                ? `Erstelle eine KI-Zusammenfassung für "${selectedDocument.name}"`
                : "Erstelle eine KI-Zusammenfassung für ein Dokument"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedDocument && (
              <div className="space-y-2">
                <Label>Dokument auswählen</Label>
                <Select onValueChange={(value) => {
                  const doc = documents.find((d) => d.id === value);
                  setSelectedDocument(doc || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dokument auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Anforderungen (optional)</Label>
              <Textarea
                placeholder="z.B. 'Fasse die wichtigsten Punkte zusammen' oder 'Erstelle eine Executive Summary'"
                value={summarizePrompt}
                onChange={(e) => setSummarizePrompt(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSummarizeDialogOpen(false);
              setSelectedDocument(null);
              setSummarizePrompt("");
            }}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSummarize}
              disabled={!selectedDocument}
              className="bg-gradient-to-r from-primary to-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Zusammenfassen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
