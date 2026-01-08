import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp(
  end: number | string,
  options: UseCountUpOptions = {}
) {
  const {
    duration = 2000,
    startOnMount = true,
    decimals = 0,
    prefix = '',
    suffix = '',
  } = options;

  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!startOnMount) return;

    const numericEnd = typeof end === 'string' 
      ? parseFloat(end.replace(/[^0-9.-]/g, '')) || 0
      : end;

    if (numericEnd === 0) {
      setCount(0);
      return;
    }

    setIsAnimating(true);
    setCount(0);

    const startTime = Date.now();
    startTimeRef.current = startTime;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = numericEnd * easeOut;

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, startOnMount]);

  const formatNumber = (num: number): string => {
    // Preserve original format if end was a string with special formatting
    if (typeof end === 'string') {
      // Check for percentage
      if (end.includes('%')) {
        return `${num.toFixed(decimals)}%`;
      }
      // Check for currency
      if (end.includes('€')) {
        return `€${num.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
      }
      if (end.includes('$')) {
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
      }
      // Check for K suffix (e.g., "12K")
      if (end.includes('K') && !end.includes('M')) {
        const originalValue = parseFloat(end.replace(/[^0-9.-]/g, ''));
        if (originalValue >= 1000) {
          return `${(num / 1000).toFixed(decimals)}K`;
        }
      }
      // Check for M suffix
      if (end.includes('M')) {
        const originalValue = parseFloat(end.replace(/[^0-9.-]/g, ''));
        if (originalValue >= 1000000) {
          return `${(num / 1000000).toFixed(decimals)}M`;
        }
      }
      // Plain number - preserve original format (e.g., "1,234" or "1234")
      if (end.includes(',')) {
        return num.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      }
    }
    
    // For numeric end or plain numbers, format with locale
    return num.toLocaleString('de-DE', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const displayValue = `${prefix}${formatNumber(count)}${suffix}`;

  return { count, displayValue, isAnimating };
}

