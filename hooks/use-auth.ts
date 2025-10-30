import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

export const AUTH_STORAGE_KEY = "auth_token";

type TokenListener = (token: string | null) => void;
const subscribers = new Set<TokenListener>();
function subscribe(listener: TokenListener) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}
function notifyAll(token: string | null) {
  for (const fn of subscribers) fn(token);
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        const t = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (mountedRef.current) setToken(t);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    const unsub = subscribe((t) => {
      if (mountedRef.current) setToken(t);
    });

    return () => {
      mountedRef.current = false;
      unsub();
    };
  }, []);

  const refresh = useCallback(async () => {
    const t = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (mountedRef.current) setToken(t);
    notifyAll(t);
    return t;
  }, []);

  const setSignedIn = useCallback(async (newToken: string) => {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, newToken);
    if (mountedRef.current) setToken(newToken);
    notifyAll(newToken);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    if (mountedRef.current) setToken(null);
    notifyAll(null);
  }, []);

  const getAuthHeader = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  return {
    loading,
    token,
    signedIn: !!token,
    setSignedIn,
    signOut,
    refresh,
    getAuthHeader,
  };
}
