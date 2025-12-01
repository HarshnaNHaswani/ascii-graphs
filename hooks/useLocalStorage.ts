"use client";

import {
  useSyncExternalStore,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

/**
 * Custom hook for localStorage that follows React 19 best practices
 * Uses useSyncExternalStore for proper synchronization with external store
 */
function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
): [T, (value: T | ((prev: T) => T)) => void] {
  // Cache the last snapshot to ensure stable references
  const snapshotCacheRef = useRef<{
    serialized: string | null;
    value: T;
  } | null>(null);

  // Store serialize/deserialize in refs to keep getSnapshot stable
  const serializeRef = useRef(serialize);
  const deserializeRef = useRef(deserialize);

  // Update refs when functions change (useLayoutEffect to avoid render-time updates)
  useLayoutEffect(() => {
    serializeRef.current = serialize;
    deserializeRef.current = deserialize;
  }, [serialize, deserialize]);

  // Subscribe function for useSyncExternalStore
  const subscribe = useCallback(
    (callback: () => void) => {
      // Handler for storage events - only trigger for our key
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) {
          // Clear cache when external change detected
          snapshotCacheRef.current = null;
          callback();
        }
      };

      // Handler for custom events - clear cache and trigger callback
      const handleCustomEvent = () => {
        snapshotCacheRef.current = null;
        callback();
      };

      // Listen to storage events from other tabs/windows
      window.addEventListener("storage", handleStorage);
      // Also listen to custom events for same-tab updates
      window.addEventListener(`localStorage-${key}`, handleCustomEvent);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(`localStorage-${key}`, handleCustomEvent);
      };
    },
    [key]
  );

  // Get snapshot function for useSyncExternalStore
  // Must be stable and cache results to avoid infinite loops
  const getSnapshot = useCallback((): T => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      // If the serialized value hasn't changed, return cached value
      if (snapshotCacheRef.current?.serialized === item) {
        return snapshotCacheRef.current.value;
      }

      // Parse new value using ref to avoid dependency on deserialize
      let value: T;
      if (item === null) {
        value = defaultValue;
      } else {
        value = deserializeRef.current(item);
      }

      // Cache the result
      snapshotCacheRef.current = {
        serialized: item,
        value,
      };

      return value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue]);

  // Get server snapshot (for SSR)
  const getServerSnapshot = useCallback((): T => {
    return defaultValue;
  }, [defaultValue]);

  // Use useSyncExternalStore to sync with localStorage
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Setter function that updates both state and localStorage
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const currentValue = getSnapshot();
        const valueToStore =
          newValue instanceof Function ? newValue(currentValue) : newValue;

        // Serialize and update localStorage using ref
        const serialized = serializeRef.current(valueToStore);
        window.localStorage.setItem(key, serialized);

        // Update cache
        snapshotCacheRef.current = {
          serialized,
          value: valueToStore,
        };

        // Dispatch custom event to notify other hooks in the same tab
        window.dispatchEvent(new Event(`localStorage-${key}`));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, getSnapshot]
  );

  return [value, setValue];
}

/**
 * Hook for simple string values in localStorage
 */
export function useLocalStorageString(
  key: string,
  defaultValue: string
): [string, (value: string | ((prev: string) => string)) => void] {
  return useLocalStorage(
    key,
    defaultValue,
    (value) => value,
    (value) => value
  );
}

/**
 * Hook for JSON-serializable values in localStorage with optional validation
 */
export function useLocalStorageJSON<T>(
  key: string,
  defaultValue: T,
  validator?: (value: unknown) => value is T
): [T, (value: T | ((prev: T) => T)) => void] {
  const validatedDeserialize = useCallback(
    (value: string): T => {
      try {
        const parsed = JSON.parse(value);
        if (validator && !validator(parsed)) {
          return defaultValue;
        }
        return parsed as T;
      } catch {
        return defaultValue;
      }
    },
    [defaultValue, validator]
  );

  return useLocalStorage(
    key,
    defaultValue,
    JSON.stringify,
    validatedDeserialize
  );
}

export default useLocalStorage;
