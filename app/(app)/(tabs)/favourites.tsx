// app/(tabs)/favourites.tsx
import Header from "@/components/Header";
import ProductHomeItem from "@/components/ProductHomeItem";
import { useFavorites } from "@/hooks/use-favourites";
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
  const [all, setAll] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const prods = await listProducts();
        setAll(prods);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(
    () => all.filter((p) => ids.includes(p.id)),
    [all, ids]
  );
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
            keyExtractor={(item) => String(item.id)}
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
                    image: item.image,
                  }}
                  onPress={() => router.push(`/(app)/product/${item.id}`)}
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
