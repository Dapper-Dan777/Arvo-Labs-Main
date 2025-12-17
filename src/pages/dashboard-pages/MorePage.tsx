import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MORE_SECTIONS } from '@/config/moreSections';
import { cn } from '@/lib/utils';

// ============================================================
// MORE PAGE
// Sekundäre Navigation für zusätzliche Bereiche
// ============================================================

const MorePage = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mehr</h1>
        <p className="text-muted-foreground mt-1">
          Weitere Funktionen und Einstellungen
        </p>
      </div>
      
      <div className="grid gap-3">
        {MORE_SECTIONS.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link
              key={section.id}
              to={section.path}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl',
                'bg-card border border-border',
                'transition-all duration-200',
                'hover:border-primary/30 hover:bg-card/80',
                'active:scale-[0.98]'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{section.label}</p>
                  {section.requiresPlan && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary uppercase">
                      {section.requiresPlan}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {section.description}
                </p>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MorePage;
