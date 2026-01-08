import { useEffect, useRef, useCallback } from "react";

interface UseLiveUpdatesOptions {
  interval?: number;
  enabled?: boolean;
  onUpdate?: () => void | Promise<void>;
}

export function useLiveUpdates({
  interval = 30000,
  enabled = true,
  onUpdate,
}: UseLiveUpdatesOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const update = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return;
    try {
      await onUpdate?.();
    } catch (error) {
      console.error("Live update error:", error);
    }
  }, [enabled, onUpdate]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled && onUpdate) {
      update();
      intervalRef.current = setInterval(update, interval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [enabled, interval, update, onUpdate]);

  const forceUpdate = useCallback(() => {
    update();
  }, [update]);

  return { forceUpdate };
}

