import React, { useState, FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  priceId: string;
  planName: string;
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({ priceId, planName, userId, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe ist nicht bereit');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Formular-Validierung fehlgeschlagen');
        setIsProcessing(false);
        return;
      }

      // Für Subscriptions: Verwende confirmSetup statt confirmPayment
      // Das Setup Intent speichert die Zahlungsmethode, danach erstellen wir die Subscription
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/billing?success=true`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Zahlung fehlgeschlagen');
        toast({
          title: 'Fehler',
          description: confirmError.message || 'Zahlung fehlgeschlagen',
          variant: 'destructive',
        });
        setIsProcessing(false);
      } else if (setupIntent && userId && priceId) {
        // Zahlungsmethode wurde gespeichert, jetzt Subscription erstellen
        try {
          const subscriptionResponse = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              priceId,
              paymentMethodId: setupIntent.payment_method,
            }),
          });

          const subscriptionData = await subscriptionResponse.json();

          if (!subscriptionResponse.ok) {
            throw new Error(subscriptionData.error || 'Fehler beim Erstellen der Subscription');
          }

          // Erfolgreich!
          toast({
            title: 'Erfolgreich!',
            description: 'Dein Plan wurde erfolgreich aktiviert.',
          });
          
          if (onSuccess) {
            onSuccess();
          } else {
            // Standard: Weiterleitung zum Dashboard
            navigate('/dashboard/billing?success=true');
          }
        } catch (subscriptionError: any) {
          setError(subscriptionError.message || 'Fehler beim Erstellen der Subscription');
          toast({
            title: 'Fehler',
            description: subscriptionError.message || 'Fehler beim Erstellen der Subscription',
            variant: 'destructive',
          });
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
      toast({
        title: 'Fehler',
        description: err.message || 'Ein Fehler ist aufgetreten',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Zahlungsinformationen
        </CardTitle>
        <CardDescription>
          Vervollständige deine Zahlung für {planName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <PaymentElement 
              options={{
                layout: 'accordion',
              }}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                Abbrechen
              </Button>
            )}
            <Button
              type="submit"
              disabled={isProcessing || !stripe || !elements}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Jetzt abonnieren
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
