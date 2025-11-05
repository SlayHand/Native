import Header from "@/components/Header";
import ProductHomeItem from "@/components/ProductHomeItem";
import { useFavorites } from "@/hooks/use-favourites";
import { listAllListings, Listing } from "@/lib/api"; // ← lisa see
import { listProducts, Product } from "@/lib/shopApi";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const gap = 12;
const columns = 2;
const itemWidth = Math.floor((width - 16 * 2 - gap) / columns);

export default function FavoritesScreen() {
  const { loading: favLoading, ids } = useFavorites();
  const [loading, setLoading] = useState(true);

  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [localListings, setLocalListings] = useState<Listing[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) fakestore
        const prods = await listProducts();
        setStoreProducts(prods);

        // 2) sinu enda API
        const locals = await listAllListings();
        setLocalListings(locals);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // normaliseerime: favourites hookis on tõenäoliselt stringid
  const favIds = ids.map((x) => String(x));

  // pane mõlemad kokku ühte massiivi ühtlase kujuga objektidena
  const items = useMemo(() => {
    const storeMapped = storeProducts
      .filter((p) => favIds.includes(String(p.id)))
      .map((p) => ({
        id: String(p.id),
        title: p.title,
        price: p.price,
        image: p.image,
        source: "store" as const,
      }));

    const localMapped = localListings
      .filter((l) => favIds.includes(String(l.id)))
      .map((l) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        image: l.image,
        source: "local" as const,
      }));

    return [...storeMapped, ...localMapped];
  }, [storeProducts, localListings, favIds]);

  const isLoading = loading || favLoading;

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Favorites" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        ) : items.length === 0 ? (
          <Text
            style={{ color: "#9ca3af", textAlign: "center", marginTop: 20 }}
          >
            No favorites yet — tap ☆ on a product to add it.
          </Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: gap,
            }}
            renderItem={({ item }) => (
              <View style={{ width: itemWidth }}>
                <ProductHomeItem
                  item={{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image || "",
                  }}
                  onPress={() =>
                    router.push(
                      // kui on “store” → number-id tee
                      item.source === "store"
                        ? `/(app)/product/${item.id}`
                        : // kui on “local” → sinu enda id (string)
                          `/(app)/product/${item.id}`
                    )
                  }
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
