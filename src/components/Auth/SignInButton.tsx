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

interface SignInButtonProps {
  mode?: 'modal' | 'redirect';
  redirectUrl?: string;
  children: React.ReactNode;
}

export function SignInButton({ mode = 'modal', redirectUrl, children }: SignInButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Fehler',
        description: error.message || 'Anmeldung fehlgeschlagen',
        variant: 'destructive',
      });
      setIsLoading(false);
    } else {
      setOpen(false);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    }
  };

  if (mode === 'redirect') {
    return (
      <Button onClick={() => navigate('/auth/sign-in')}>
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
            <DialogTitle>Anmelden</DialogTitle>
            <DialogDescription>
              Melde dich mit deinem Konto an
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Lädt...' : 'Anmelden'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

