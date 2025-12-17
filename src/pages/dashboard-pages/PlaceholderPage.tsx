import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// ANPASSEN: Diese Seite wird als Platzhalter für noch nicht implementierte Routen verwendet
export default function PlaceholderPage() {
  const location = useLocation();
  
  // Extract page name from path
  const pageName = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="arvo-card max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-2xl">
            <Construction className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {pageName || 'Seite'}
          </h1>
          <p className="text-muted-foreground mb-6">
            Diese Seite wird gerade entwickelt. Schau bald wieder vorbei!
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Zurück zur Startseite
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
