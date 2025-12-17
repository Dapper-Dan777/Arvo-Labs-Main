import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentFilters {
  type: string[];
  status: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface FilterSheetProps {
  onApplyFilters: (filters: DocumentFilters) => void;
  currentFilters: DocumentFilters;
  trigger?: React.ReactNode;
}

const DOCUMENT_TYPES = ['PDF', 'Excel', 'Word', 'PowerPoint'];
const DOCUMENT_STATUSES = ['Fertig', 'In Bearbeitung', 'Entwurf', 'In Prüfung'];

export function FilterSheet({ onApplyFilters, currentFilters, trigger }: FilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<DocumentFilters>(currentFilters);

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: DocumentFilters = {
      type: [],
      status: [],
      dateRange: 'all'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    setIsOpen(false);
  };

  const hasActiveFilters = filters.type.length > 0 || filters.status.length > 0 || filters.dateRange !== 'all';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className={cn(hasActiveFilters && "border-primary")}>
            <Filter className="w-4 h-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter anwenden</SheetTitle>
          <SheetDescription>
            Wähle Filterkriterien, um deine Dokumente zu filtern
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Document Type Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Dokumenttyp</Label>
            <div className="space-y-2">
              {DOCUMENT_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.type.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Status</Label>
            <div className="space-y-2">
              {DOCUMENT_STATUSES.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Zeitraum</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value: DocumentFilters['dateRange']) =>
                setFilters(prev => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="today">Heute</SelectItem>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Dieser Monat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Filter anwenden
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}





