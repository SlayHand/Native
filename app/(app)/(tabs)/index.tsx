import Header from "@/components/Header";
import ProductHomeItem from "@/components/ProductHomeItem";
import { listCategories, listProducts, Product } from "@/lib/shopApi";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const gap = 12;
const columns = 2;
const itemWidth = Math.floor((width - 16 * 2 - gap) / columns);

type CategoryItem = { title: string };

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([
    { title: "Popular" },
  ]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Popular");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          listProducts(),
          listCategories(),
        ]);
        setAllProducts(prods);
        setCategories([
          { title: "Popular" },
          ...cats.map((c) => ({ title: c })),
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let next = allProducts;
    if (selectedCategory !== "Popular")
      next = next.filter((p) => p.category === selectedCategory);
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      next = next.filter((p) => p.title.toLowerCase().includes(kw));
    }
    return next;
  }, [allProducts, selectedCategory, keyword]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header
        title="Home"
        showSearch
        showSearchInput={showSearchInput}
        onToggleSearch={() => setShowSearchInput((v) => !v)}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      {/* Kategooriad */}
      <View style={{ paddingVertical: 12, paddingLeft: 16 }}>
        <FlatList
          data={categories}
          keyExtractor={(item, idx) => String(item.title ?? idx)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = selectedCategory === (item.title ?? "Popular");
            return (
              <Pressable
                onPress={() => setSelectedCategory(item.title ?? "Popular")}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  marginRight: 10,
                  backgroundColor: selected ? "#4F63AC" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: selected ? "#fff" : "#111827",
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Toodete grid */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {filtered.length === 0 ? (
          <Text
            style={{ color: "#9ca3af", textAlign: "center", marginTop: 20 }}
          >
            Nothing to show — try Popular or clear search.
          </Text>
        ) : (
          <FlatList
            data={filtered}
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
