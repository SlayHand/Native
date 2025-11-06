import Header from "@/components/Header";
import ProductHomeItem from "@/components/ProductHomeItem";
import { listAllListings } from "@/lib/api";
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

type ShopItem = {
  id: string | number;
  title: string;
  image?: string;
  price: number;
  category: string;
  description?: string;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState<ShopItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // laeme fakestore + meie kuulutused ja ühendame
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // 1) fakestore
        const fr = await fetch("https://fakestoreapi.com/products");
        const fjson = await fr.json();
        const fs: ShopItem[] = (Array.isArray(fjson) ? fjson : []).map((p) => ({
          id: p.id,
          title: String(p.title),
          image: String(p.image || ""),
          price: Number(p.price || 0),
          category: String(p.category || "misc"),
          description: p.description ? String(p.description) : undefined,
        }));

        // 2) meie (avalikud) listings
        const locals = await listAllListings();
        const ls: ShopItem[] = locals.map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          price: p.price,
          category: p.category || "misc",
          description: p.description,
        }));

        const merged = [...fs, ...ls];

        if (!cancelled) setAll(merged);
      } catch (e) {
        console.log("[HOME] load error", e);
        if (!cancelled) setAll([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Kategooriad dünaamiliselt (stringid!)
  const categories = useMemo(() => {
    const uniq = new Set<string>();
    uniq.add("All");
    for (const p of all) uniq.add(p.category || "misc");
    return Array.from(uniq);
  }, [all]);

  // Filter + search
  const filtered = useMemo(() => {
    let next = all;
    if (selectedCategory !== "All") {
      next = next.filter((p) => p.category === selectedCategory);
    }
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      next = next.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          (p.description || "").toLowerCase().includes(kw)
      );
    }
    return next;
  }, [all, selectedCategory, keyword]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <Header
        title="Find all you need"
        showSearch
        searchOnLeft
        showSearchInput={showSearchInput}
        onToggleSearch={() => setShowSearchInput((v) => !v)}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      {/* kategooriate riba */}
      <View style={{ paddingTop: 12 }}>
        <Text
          style={{
            marginLeft: 16,
            marginBottom: 8,
            fontSize: 16,
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Categories
        </Text>
        <FlatList
          data={categories}
          keyExtractor={(c) => c}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => (
            <CategoryPill
              label={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
        />
      </View>

      {/* tooted */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {filtered.length === 0 ? (
          <View
            style={{
              marginTop: 40,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#6B7280" }}>
              Nothing to show — try “All” or clear search.
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={{
                marginBottom: 12,
                fontSize: 16,
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Featured
            </Text>
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
                    onPress={() => {
                      router.push(`/product/${item.id}`);
                    }}
                  />
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </View>
  );
}

function CategoryPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? "#4F63AC" : "#E5E7EB",
        backgroundColor: selected ? "#4F63AC" : "#fff",
        shadowColor: selected ? "#4F63AC" : undefined,
        shadowOpacity: selected ? 0.12 : 0,
      }}
    >
      <Text
        style={{
          color: selected ? "#fff" : "#111827",
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
