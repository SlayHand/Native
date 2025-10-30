import { useCart } from "@/hooks/use-cart";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function CartScreen() {
  const { items, setQty, remove, totalPrice, clear, loading } = useCart();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading cart…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Cart
      </Text>

      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Text style={{ color: "#6b7280" }}>Your cart is empty.</Text>
          <Pressable
            onPress={() => router.replace("/(app)/(tabs)")}
            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <Text style={{ color: "#4F63AC", fontWeight: "700" }}>
              Go shopping
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => String(it.id)}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                {!!item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 64, height: 64, borderRadius: 8 }}
                    contentFit="cover"
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700" }}>{item.title}</Text>
                  <Text style={{ marginTop: 4 }}>
                    {(item.price * item.qty).toFixed(2)} €
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 8,
                    }}
                  >
                    <Pressable
                      onPress={() => setQty(item.id, Math.max(1, item.qty - 1))}
                      style={{
                        borderWidth: 1,
                        borderColor: "#D7DCE5",
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text>−</Text>
                    </Pressable>
                    <Text>{item.qty}</Text>
                    <Pressable
                      onPress={() => setQty(item.id, item.qty + 1)}
                      style={{
                        borderWidth: 1,
                        borderColor: "#D7DCE5",
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text>+</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => remove(item.id)}
                      style={{ marginLeft: "auto" }}
                    >
                      <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#E5E7EB",
              paddingTop: 12,
              marginTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "600" }}>Total</Text>
              <Text style={{ fontWeight: "700" }}>
                {totalPrice.toFixed(2)} €
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={clear}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#111827" }}>
                  Clear
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(app)/checkout")}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: "#4F63AC",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#fff" }}>
                  Checkout
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
