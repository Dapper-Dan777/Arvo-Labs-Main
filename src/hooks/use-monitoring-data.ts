import { useState, useEffect } from 'react';

export interface OnboardingLog {
  timestamp: string;
  user_id: string;
  email: string;
  plan: string;
  status: 'success' | 'error' | 'partial';
  hubspot_contact_id?: string;
  stripe_subscription_id?: string;
  error_step?: string;
  error_message?: string;
}

export function useMonitoringData() {
  const [data, setData] = useState<OnboardingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // API-Call zu Backend, das die Zapier Table abfragt
        const response = await fetch('/api/automations/monitoring-logs');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
          
          // Warnung in Console, wenn Mock-Daten verwendet werden
          if (result.isMockData) {
            console.warn(
              '⚠️ Monitoring: Verwende Mock-Daten. ' +
              'Setze ZAPIER_TABLE_API_KEY und ZAPIER_TABLE_ID in Environment Variables für echte Daten.'
            );
          }
        } else {
          throw new Error(result.error || 'Ungültige Antwort vom Server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
        console.error('Error fetching monitoring data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    
    // Auto-Refresh alle 30 Sekunden
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error };
}

