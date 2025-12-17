import React, { useState, useMemo } from 'react';
import { FileText, Search, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FilterSheet, type DocumentFilters } from '@/components/documents/FilterSheet';
import { ExportButton } from '@/components/documents/ExportButton';
import { DocumentActionsMenu } from '@/components/documents/DocumentActionsMenu';
import { DocumentViewDialog } from '@/components/documents/DocumentViewDialog';
import { toast } from '@/hooks/use-toast';

// ============================================================
// DOCUMENTS PAGE
// Dokumenten-Center mit Tabelle, Filtern, Export und Actions
// ============================================================

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
}

// ANPASSEN: Dummy-Daten, später durch Supabase-Query ersetzen
const DOCUMENTS: Document[] = [
  { id: '1', title: 'Q4 Report 2024', type: 'PDF', date: '15.12.2024', status: 'Fertig' },
  { id: '2', title: 'Projektplan 2025', type: 'Excel', date: '14.12.2024', status: 'In Bearbeitung' },
  { id: '3', title: 'Meeting Notes', type: 'Word', date: '13.12.2024', status: 'Fertig' },
  { id: '4', title: 'Budget Übersicht', type: 'Excel', date: '12.12.2024', status: 'Entwurf' },
  { id: '5', title: 'Präsentation Q3', type: 'PowerPoint', date: '10.12.2024', status: 'Fertig' },
  { id: '6', title: 'Vertragsentwurf', type: 'PDF', date: '08.12.2024', status: 'In Prüfung' },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-red-500/10 text-red-500',
  Excel: 'bg-green-500/10 text-green-500',
  Word: 'bg-blue-500/10 text-blue-500',
  PowerPoint: 'bg-orange-500/10 text-orange-500',
};

const STATUS_COLORS: Record<string, string> = {
  'Fertig': 'bg-green-500/10 text-green-500',
  'In Bearbeitung': 'bg-yellow-500/10 text-yellow-500',
  'Entwurf': 'bg-muted text-muted-foreground',
  'In Prüfung': 'bg-blue-500/10 text-blue-500',
};

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DocumentFilters>({
    type: [],
    status: [],
    dateRange: 'all',
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter and search documents
  const filteredDocs = useMemo(() => {
    let result = [...DOCUMENTS];

    // Search filter
    if (searchQuery) {
      result = result.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(doc => filters.type.includes(doc.type));
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(doc => filters.status.includes(doc.status));
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      result = result.filter(doc => {
        const docDate = new Date(doc.date.split('.').reverse().join('-'));
        return docDate >= filterDate;
      });
    }

    return result;
  }, [searchQuery, filters]);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  const handleAIAnalyze = (document: Document) => {
    toast({
      title: 'KI-Analyse gestartet',
      description: `Analysiere "${document.title}"...`,
    });
    // TODO: Implement AI analysis
  };

  const handleDeleteDocument = (document: Document) => {
    toast({
      title: 'Dokument löschen',
      description: `Möchtest du "${document.title}" wirklich löschen?`,
      variant: 'destructive',
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            toast({
              title: 'Gelöscht',
              description: `"${document.title}" wurde gelöscht.`,
            });
          }}
        >
          Bestätigen
        </Button>
      ),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dokumente</h1>
          <p className="text-muted-foreground mt-1">
            {filteredDocs.length} von {DOCUMENTS.length} Dokumenten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton data={filteredDocs} filename="dokumente" variant="outline" size="default" />
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Dokumente durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterSheet
          onApplyFilters={setFilters}
          currentFilters={filters}
        />
      </div>
      
      {/* Documents List */}
      <div className="space-y-2">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Keine Dokumente gefunden</p>
            <p className="text-sm text-muted-foreground mt-1">
              Versuche andere Suchbegriffe oder Filter
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-card border border-border',
                'transition-all duration-200',
                'hover:border-primary/30'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                TYPE_COLORS[doc.type] || 'bg-muted'
              )}>
                <FileText className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{doc.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'px-2 py-0.5 text-[10px] font-medium rounded-full',
                    TYPE_COLORS[doc.type]
                  )}>
                    {doc.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                </div>
              </div>
              
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full hidden sm:block',
                STATUS_COLORS[doc.status]
              )}>
                {doc.status}
              </span>
              
              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleViewDocument(doc)}
                  aria-label="Dokument ansehen"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleAIAnalyze(doc)}
                  aria-label="KI-Analyse"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
                <DocumentActionsMenu
                  documentId={doc.id}
                  documentTitle={doc.title}
                  onView={() => handleViewDocument(doc)}
                  onAIAnalyze={() => handleAIAnalyze(doc)}
                  onDelete={() => handleDeleteDocument(doc)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document View Dialog */}
      {selectedDocument && (
        <DocumentViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
