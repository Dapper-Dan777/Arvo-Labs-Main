import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Animiert Zahlenwerte mit optionaler Formatierung (%, €, $, K/M-Suffix).
 */
export function useCountUp(
  end: number | string,
  options: UseCountUpOptions = {},
) {
  const {
    duration = 2000,
    startOnMount = true,
    decimals = 0,
    prefix = "",
    suffix = "",
  } = options;

  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!startOnMount) return;

    const numericEnd =
      typeof end === "string"
        ? parseFloat(end.replace(/[^0-9.-]/g, "")) || 0
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
    if (typeof end === "string") {
      if (end.includes("%")) {
        return `${num.toFixed(decimals)}%`;
      }
      if (end.includes("€")) {
        return `€${num.toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      if (end.includes("$")) {
        return `$${num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
      if (end.includes("K") && !end.includes("M")) {
        const originalValue = parseFloat(end.replace(/[^0-9.-]/g, ""));
        if (originalValue >= 1000) {
          return `${(num / 1000).toFixed(decimals)}K`;
        }
      }
      if (end.includes("M")) {
        const originalValue = parseFloat(end.replace(/[^0-9.-]/g, ""));
        if (originalValue >= 1_000_000) {
          return `${(num / 1_000_000).toFixed(decimals)}M`;
        }
      }
      if (end.includes(",")) {
        return num.toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }
    }

    return num.toLocaleString("de-DE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const displayValue = `${prefix}${formatNumber(count)}${suffix}`;

  return { count, displayValue, isAnimating };
}



