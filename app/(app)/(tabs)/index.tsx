// app/(tabs)/index.tsx
import CategoryBox from "@/components/CategoryBox";
import Header from "@/components/Header";
import ProductHomeItem from "@/components/ProductHomeItem";
import { categories } from "@/data/categories";
import { products as allProducts } from "@/data/products";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const gap = 12;
const columns = 2;
const itemWidth = Math.floor((width - 16 * 2 - gap) / columns);

export default function HomeScreen() {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "Popular">(
    "Popular"
  );
  const [filtered, setFiltered] = useState(allProducts);

  useEffect(() => {
    let next = allProducts;
    if (selectedCategory !== "Popular")
      next = next.filter((p) => p.category === selectedCategory);
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      next = next.filter((p) => p.title.toLowerCase().includes(kw));
    }
    setFiltered(next);
  }, [selectedCategory, keyword]);

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

      {/* kategooriad */}
      <View style={{ paddingVertical: 12, paddingLeft: 16 }}>
        <FlatList
          data={categories}
          keyExtractor={(item, idx) => String(item.id ?? item.title ?? idx)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryBox
              item={item}
              selected={selectedCategory === (item.id ?? "Popular")}
              onPress={() => setSelectedCategory(item.id ?? "Popular")}
            />
          )}
        />
      </View>

      {/* tooted */}
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
                  item={item}
                  onPress={() => {
                    /* TODO: detail nav */
                  }}
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
