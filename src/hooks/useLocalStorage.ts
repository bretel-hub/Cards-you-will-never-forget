import { useCallback, useEffect, useState } from "react";

/** Persist a piece of state to localStorage, surviving page reloads. */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => (value instanceof Function ? value(prev) : value));
    },
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      /* storage may be unavailable (private mode, quota) — ignore */
    }
  }, [key, stored]);

  return [stored, setValue];
}
