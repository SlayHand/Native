import Header from "@/components/Header";
import { useFavorites } from "@/hooks/use-favourites";
import { listAllListings, Listing } from "@/lib/api";
import { listProducts, Product } from "@/lib/shopApi";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const { loading: favLoading, ids, toggle } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [localListings, setLocalListings] = useState<Listing[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const prods = await listProducts();
        setStoreProducts(prods);

        const locals = await listAllListings();
        setLocalListings(locals);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // hooki favourites võivad olla numbrid JA stringid
  // seega teeme võrdlemiseks eraldi stringi-versiooni
  const favIdsAsString = ids.map((x) => String(x));

  const items = useMemo(() => {
    const fromStore = storeProducts
      .filter((p) => favIdsAsString.includes(String(p.id)))
      .map((p) => ({
        id: String(p.id), // ekraanil näitamiseks / key jaoks
        rawId: p.id, // ← seda anname toggle'ile (number!)
        title: p.title,
        price: p.price,
        image: p.image,
        source: "store" as const,
      }));

    const fromLocal = localListings
      .filter((l) => favIdsAsString.includes(String(l.id)))
      .map((l) => ({
        id: l.id,
        rawId: l.id, // ← sinu enda kuulutused ongi string, see sobib otse
        title: l.title,
        price: l.price,
        image: l.image,
        source: "local" as const,
      }));

    return [...fromStore, ...fromLocal];
  }, [storeProducts, localListings, favIdsAsString]);

  const isLoading = loading || favLoading;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <Header title="Favorites" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        ) : items.length === 0 ? (
          <View
            style={{
              marginTop: 24,
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              No favorites yet — tap ☆ on a product to add it.
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
            renderItem={({ item, index }) => (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    gap: 12,
                  }}
                >
                  {/* vasak + keskosa: avab toote */}
                  <Pressable
                    onPress={() => router.push(`/(app)/product/${item.id}`)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          backgroundColor: "#E5E7EB",
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          backgroundColor: "#E5E7EB",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "#94A3B8", fontSize: 10 }}>
                          No image
                        </Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          marginTop: 4,
                          color: "#4F63AC",
                          fontWeight: "700",
                        }}
                      >
                        {item.source === "local"
                          ? `${item.price.toFixed(2)} €`
                          : `${item.price} €`}
                      </Text>
                    </View>
                  </Pressable>

                  {/* X – annab toggle'ile PÄRIS id */}
                  <Pressable
                    onPress={() => toggle(item.rawId as any)}
                    hitSlop={8}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#EEF2FF",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#4F63AC" }}>×</Text>
                  </Pressable>
                </View>

                {index < items.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />
                ) : null}
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
