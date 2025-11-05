import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { deleteListing, Listing, myListings } from "@/lib/api";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

export default function MyListingsScreen() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Listing[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    // kui tokenit pole, ära jää igavesti "loading" peale
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await myListings(token);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function doDelete(id: string) {
    if (!token) return;
    try {
      setDeletingId(id);
      await deleteListing(token, id);
      // eemalda kohe listist
      setItems((prev) => prev.filter((it) => it.id !== id));
      // ja soovi korral sünkroniseeri
      load();
    } catch (e: any) {
      Alert.alert("Delete failed", e?.message ?? "Try again");
    } finally {
      setDeletingId(null);
    }
  }

  async function onDelete(id: string) {
    if (!token) return;

    // web: tee kohe
    if (Platform.OS === "web") {
      return doDelete(id);
    }

    // native: küsi kinnitust
    Alert.alert("Delete listing", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          doDelete(id);
        },
      },
    ]);
  }

  // ⬇️ PÄRIS RENDER PEAB OLEMA SIIN, mitte funktsiooni sees
  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="My Listings" showBack />

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#6B7280" }}>No listings yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 64, height: 64, borderRadius: 12 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    backgroundColor: "#E5E7EB",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#94A3B8", fontSize: 12 }}>
                    No image
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700" }}>{item.title}</Text>
                <Text style={{ marginTop: 4 }}>{item.price.toFixed(2)} €</Text>
                {!!item.category && (
                  <Text style={{ color: "#94A3B8", marginTop: 2 }}>
                    {item.category}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => onDelete(item.id)}
                disabled={deletingId === item.id}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {deletingId === item.id ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={{ fontSize: 18 }}>🗑</Text>
                )}
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}
