import React from 'react';
import { MessageCircle, Mail, FileText, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const quickActions = [
  { id: 'chat', label: 'Chat öffnen', icon: MessageCircle, path: '/dashboard/chat', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'mail', label: 'E-Mail senden', icon: Mail, path: '/dashboard/mail', color: 'bg-purple-500/10 text-purple-500' },
  { id: 'document', label: 'Dokument erstellen', icon: FileText, path: '/dashboard/documents', color: 'bg-green-500/10 text-green-500' },
  { id: 'dashboard', label: 'Dashboard anzeigen', icon: LayoutDashboard, path: '/dashboard/dashboards', color: 'bg-orange-500/10 text-orange-500' },
];

export function QuickActionsCard() {
  return (
    <Card className="arvo-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Schnellstart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                to={action.path}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border border-border',
                  'transition-all duration-200 hover:scale-[1.02] hover:border-primary/50',
                  'hover:shadow-lg hover:shadow-primary/10'
                )}
              >
                <div className={cn('p-2 rounded-lg', action.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
