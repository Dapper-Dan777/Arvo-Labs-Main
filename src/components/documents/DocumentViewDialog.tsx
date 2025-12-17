import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    title: string;
    type: string;
    date: string;
    status: string;
  };
}

export function DocumentViewDialog({ open, onOpenChange, document }: DocumentViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>
            Dokument-Details und Vorschau
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Document Info */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
              document.type === 'PDF' && 'bg-red-500/10 text-red-500',
              document.type === 'Excel' && 'bg-green-500/10 text-green-500',
              document.type === 'Word' && 'bg-blue-500/10 text-blue-500',
              document.type === 'PowerPoint' && 'bg-orange-500/10 text-orange-500',
            )}>
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Typ</p>
                  <p className="font-medium">{document.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Datum</p>
                  <p className="font-medium">{document.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{document.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-medium font-mono text-xs">{document.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Placeholder */}
          <div className="border border-border rounded-lg p-8 bg-muted/30 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Dokument-Vorschau wird hier angezeigt
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Für eine vollständige Vorschau öffne das Dokument in der entsprechenden Anwendung.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Herunterladen
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Teilen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}





