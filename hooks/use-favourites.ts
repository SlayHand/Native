// hooks/use-favorites.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "fav_ids";

export function useFavorites() {
  const mounted = useRef(true);
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const parsed = raw ? (JSON.parse(raw) as number[]) : [];
        if (mounted.current) setIds(parsed);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, []);

  const persist = useCallback(async (next: number[]) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    if (mounted.current) setIds(next);
  }, []);

  const isFav = useCallback((id: number) => ids.includes(id), [ids]);

  const add = useCallback(
    async (id: number) => {
      if (ids.includes(id)) return;
      await persist([...ids, id]);
    },
    [ids, persist]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!ids.includes(id)) return;
      await persist(ids.filter((x) => x !== id));
    },
    [ids, persist]
  );

  const toggle = useCallback(
    async (id: number) => {
      if (ids.includes(id)) await remove(id);
      else await add(id);
    },
    [ids, add, remove]
  );

  return { loading, ids, isFav, add, remove, toggle };
}
