// app/(app)/product/[id].tsx
import { useFavorites } from "@/hooks/use-favourites";
import { getListing } from "@/lib/api"; // sinu API
import { getProduct as getStoreProduct } from "@/lib/shopApi"; // fakestore
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

type StoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type LocalListing = {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const idStr = Array.isArray(id) ? id[0] : id || "";

  const { isFav, toggle } = useFavorites();

  const [loading, setLoading] = useState(true);
  const [storeProduct, setStoreProduct] = useState<StoreProduct | null>(null);
  const [localProduct, setLocalProduct] = useState<LocalListing | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const maybeNumber = Number(idStr);

        // 1) kui on number -> proovi fakestore’ist
        if (Number.isFinite(maybeNumber)) {
          const p = await getStoreProduct(maybeNumber);
          if (!cancelled) {
            setStoreProduct(p);
            setLocalProduct(null);
          }
          return;
        }

        // 2) muidu proovi sinu enda API-st
        const lp = await getListing(idStr);
        if (!cancelled) {
          setLocalProduct(lp);
          setStoreProduct(null);
        }
      } catch (e) {
        if (!cancelled) {
          setStoreProduct(null);
          setLocalProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [idStr]);

  if (loading) {
    return (
      <Center>
        <ActivityIndicator />
      </Center>
    );
  }

  // kui kumbagi ei leitud
  if (!storeProduct && !localProduct) {
    return (
      <Center>
        <Text>Invalid product ID</Text>
        <BackBtn />
      </Center>
    );
  }

  // normalizeerime, et UI oleks sama
  const isLocal = !!localProduct;
  const p = isLocal ? localProduct! : storeProduct!;
  const fav = isFav(p.id as any); // sinu fav hook on tõenäoliselt numberitega ok, aga string töötab ka

  const price =
    typeof p.price === "number" ? p.price.toFixed(2) : String(p.price);

  function contactSeller() {
    const subject = encodeURIComponent(`Inquiry about: ${p.title}`);
    const body = encodeURIComponent(`Hi!\n\nI'm interested in "${p.title}".`);
    const mailto = `mailto:seller@example.com?subject=${subject}&body=${body}`;
    Linking.openURL(mailto).catch(() => Alert.alert("Could not open mail app"));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* pilt */}
      {p.image ? (
        <Image
          source={{ uri: p.image }}
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

      {/* Back */}
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

      {/* sisu */}
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
          <Text style={{ fontSize: 22, fontWeight: "700" }}>{p.title}</Text>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>{price} €</Text>
            <Text style={{ color: "#9CA3AF" }}>Category: {p.category}</Text>
          </View>

          {!!(p as any).description && (
            <Text style={{ color: "#6B7280", marginTop: 12, lineHeight: 20 }}>
              {(p as any).description}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* jalus */}
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
          onPress={() => toggle(p.id as any)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#D7DCE5",
            alignItems: "center",
            justifyContent: "center",
          }}
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
