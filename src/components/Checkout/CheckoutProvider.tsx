import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { CheckoutForm } from './CheckoutForm';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CheckoutProviderProps {
  priceId: string;
  planName: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutProvider({ 
  priceId, 
  planName, 
  userId, 
  onSuccess, 
  onCancel 
}: CheckoutProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    // Lade Stripe
    getStripe().then((stripeInstance) => {
      if (!stripeInstance) {
        setError('Stripe konnte nicht geladen werden. Bitte prüfe deine Konfiguration.');
        setIsLoading(false);
        return;
      }
      setStripe(stripeInstance);
    });
  }, []);

  useEffect(() => {
    if (!stripe || !priceId || !userId) return;

    // Erstelle Payment Intent (für einmalige Zahlungen) oder Setup Intent (für Subscriptions)
    async function createPaymentIntent() {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            priceId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Fehler beim Erstellen der Payment Intent');
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('Kein client_secret erhalten');
        }
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        setError(err.message || 'Fehler beim Erstellen der Payment Intent');
      } finally {
        setIsLoading(false);
      }
    }

    createPaymentIntent();
  }, [stripe, priceId, userId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Checkout wird vorbereitet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Zurück
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret || !stripe) {
    return null;
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        clientSecret: clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm
        priceId={priceId}
        planName={planName}
        userId={userId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}
