import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Share2, Download, Trash2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DocumentActionsMenuProps {
  documentId: string;
  documentTitle: string;
  onView?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onAIAnalyze?: () => void;
}

export function DocumentActionsMenu({
  documentId,
  documentTitle,
  onView,
  onShare,
  onDelete,
  onAIAnalyze,
}: DocumentActionsMenuProps) {
  const handleView = () => {
    if (onView) {
      onView();
    } else {
      toast({
        title: 'Dokument öffnen',
        description: `Öffne "${documentTitle}"...`,
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Copy share link to clipboard
      const shareLink = `${window.location.origin}/documents/${documentId}`;
      navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Link kopiert',
        description: 'Der Link zum Dokument wurde in die Zwischenablage kopiert.',
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: 'Download gestartet',
      description: `Lade "${documentTitle}" herunter...`,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: 'Dokument löschen',
        description: `Möchtest du "${documentTitle}" wirklich löschen?`,
        variant: 'destructive',
      });
    }
  };

  const handleAIAnalyze = () => {
    if (onAIAnalyze) {
      onAIAnalyze();
    } else {
      toast({
        title: 'KI-Analyse',
        description: `Starte KI-Analyse für "${documentTitle}"...`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          Ansehen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAIAnalyze}>
          <Sparkles className="w-4 h-4 mr-2" />
          KI-Analyse
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Teilen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Herunterladen
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}





