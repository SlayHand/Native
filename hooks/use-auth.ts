import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "auth_token";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem(KEY);
        setToken(t);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function setSignedIn(newToken: string) {
    await AsyncStorage.setItem(KEY, newToken);
    setToken(newToken);
  }
  async function signOut() {
    await AsyncStorage.removeItem(KEY);
    setToken(null);
  }

  return { loading, token, signedIn: !!token, setSignedIn, signOut };
}
