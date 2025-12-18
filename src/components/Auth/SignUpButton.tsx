import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SignUpButtonProps {
  mode?: 'modal' | 'redirect';
  redirectUrl?: string;
  children: React.ReactNode;
}

export function SignUpButton({ mode = 'modal', redirectUrl, children }: SignUpButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, {
      full_name: fullName,
    });

    if (error) {
      toast({
        title: 'Fehler',
        description: error.message || 'Registrierung fehlgeschlagen',
        variant: 'destructive',
      });
      setIsLoading(false);
    } else {
      toast({
        title: 'Erfolg',
        description: 'Bitte prüfe deine E-Mail, um dein Konto zu bestätigen.',
      });
      setOpen(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    }
  };

  if (mode === 'redirect') {
    return (
      <Button onClick={() => navigate('/auth/sign-up')}>
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrieren</DialogTitle>
            <DialogDescription>
              Erstelle ein neues Konto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Lädt...' : 'Registrieren'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

