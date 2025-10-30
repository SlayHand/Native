// app/(app)/product/[id].tsx
import { useFavorites } from "@/hooks/use-favourites";
import { getProduct, Product } from "@/lib/shopApi";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProductDetail() {
  // HOOKID ALATI ÜLEMSEL TASEMEL
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const idStr = Array.isArray(id) ? id[0] : id;
  const pid = Number(idStr);

  const { isFav, toggle } = useFavorites(); // <-- enne varajasi returne
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        if (!Number.isFinite(pid)) {
          if (!cancelled) setProduct(null);
          return;
        }
        const p = await getProduct(pid);
        if (!cancelled) setProduct(p);
      } catch (e) {
        console.error(e);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pid]);

  if (!Number.isFinite(pid)) {
    return (
      <Center>
        <Text>Invalid product ID</Text>
        <BackBtn />
      </Center>
    );
  }

  if (loading) {
    return (
      <Center>
        <ActivityIndicator />
      </Center>
    );
  }

  if (!product) {
    return (
      <Center>
        <Text>Product not found</Text>
        <BackBtn />
      </Center>
    );
  }

  const fav = isFav(product.id);

  const contactSeller = () => {
    const subject = encodeURIComponent(`Inquiry about: ${product.title}`);
    const body = encodeURIComponent(
      `Hi!\n\nI'm interested in "${product.title}".`
    );
    const mailto = `mailto:seller@example.com?subject=${subject}&body=${body}`;
    Linking.openURL(mailto).catch(() => Alert.alert("Could not open mail app"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Päis / hero */}
      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={{ width: "100%", height: 300 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 220,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F3F4F6",
          }}
        >
          <Text style={{ color: "#9CA3AF" }}>No image</Text>
        </View>
      )}

      {/* Back nupp */}
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          height: 44,
          width: 44,
          borderRadius: 12,
          backgroundColor: "rgba(0,0,0,0.4)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>‹</Text>
      </Pressable>

      {/* Sisu */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            marginTop: -20,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            {product.title}
          </Text>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
              {product.price.toFixed(2)} €
            </Text>
            <Text style={{ color: "#9CA3AF" }}>
              Category: {product.category}
            </Text>
          </View>

          {!!product.description && (
            <Text style={{ color: "#6B7280", marginTop: 12, lineHeight: 20 }}>
              {product.description}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Jalus */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => toggle(product.id)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#D7DCE5",
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel={
            fav ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Text style={{ fontSize: 18 }}>{fav ? "★" : "☆"}</Text>
        </Pressable>

        <Pressable
          onPress={contactSeller}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 12,
            backgroundColor: "#4F63AC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Contact Seller
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {children}
    </View>
  );
}

function BackBtn() {
  return (
    <Pressable onPress={() => router.back()}>
      <Text style={{ color: "#4F63AC", fontWeight: "700" }}>Go back</Text>
    </Pressable>
  );
}
