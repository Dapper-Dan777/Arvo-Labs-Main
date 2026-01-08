import { useState, useCallback } from "react";

export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const currentState = history[index];

  const setState = useCallback((newState: T) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      return history[index - 1];
    }
    return null;
  }, [history, index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return history[index + 1];
    }
    return null;
  }, [history, index]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

