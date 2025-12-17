import React, { useState } from 'react';
import { X, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useWidgets } from '@/contexts/WidgetContext';
import { cn } from '@/lib/utils';

// ============================================================
// WIDGET MANAGER
// Overlay zum Verwalten der Dashboard-Karten
// 
// DRAG-AND-DROP: Für Sortierung react-beautiful-dnd oder
// @dnd-kit/core einbinden und activeWidgets als sortierbare Liste rendern
// ============================================================

interface WidgetManagerProps {
  children: React.ReactNode;
}

export function WidgetManager({ children }: WidgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeWidgets, availableWidgets, addWidget, removeWidget } = useWidgets();
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md glass border-border overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-semibold">
            Dashboard-Karten verwalten
          </SheetTitle>
        </SheetHeader>
        
        {/* Aktive Karten */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Aktive Karten ({activeWidgets.length})
            </h3>
            
            {activeWidgets.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">
                Keine aktiven Karten. Füge unten Karten hinzu.
              </p>
            ) : (
              <div className="space-y-2">
                {activeWidgets.map((widget) => {
                  const Icon = widget.icon;
                  return (
                    <div 
                      key={widget.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl bg-card border border-border',
                        'transition-all duration-200 hover:border-primary/30'
                      )}
                    >
                      {/* DRAG-AND-DROP: Handle hier hinzufügen */}
                      <div className="text-muted-foreground cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{widget.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {widget.subtitle}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeWidget(widget.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Verfügbare Karten */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Verfügbare Karten hinzufügen
            </h3>
            
            {availableWidgets.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">
                Alle Karten sind bereits aktiv.
              </p>
            ) : (
              <div className="space-y-2">
                {availableWidgets.map((widget) => {
                  const Icon = widget.icon;
                  return (
                    <div 
                      key={widget.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-transparent',
                        'transition-all duration-200 hover:bg-muted/50 hover:border-border'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{widget.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {widget.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addWidget(widget.id)}
                      >
                        <Plus className="w-4 h-4" />
                        Hinzufügen
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
