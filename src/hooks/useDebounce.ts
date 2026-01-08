import { useState, useEffect } from 'react';

/**
 * Custom Hook für Debouncing von Werten
 * @param value - Der zu debouncende Wert
 * @param delay - Verzögerung in Millisekunden (Standard: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
