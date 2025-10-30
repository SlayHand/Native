import { useCart } from "@/hooks/use-cart";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function CheckoutScreen() {
  const { items, totalPrice, clear } = useCart();
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");

  const canPay = items.length > 0 && !!name.trim() && !!addr.trim();

  function onPay() {
    if (!canPay) return;
    // mock
    Alert.alert("Success", "Order placed!");
    clear();
    router.replace("/(app)/(tabs)");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Checkout
      </Text>

      <Text style={{ color: "#6b7280" }}>Total: {totalPrice.toFixed(2)} €</Text>

      <Text style={{ marginTop: 16, fontWeight: "600" }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="John Doe"
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 48,
          marginTop: 6,
        }}
      />

      <Text style={{ marginTop: 12, fontWeight: "600" }}>Address</Text>
      <TextInput
        value={addr}
        onChangeText={setAddr}
        placeholder="123 Test Street"
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 48,
          marginTop: 6,
        }}
      />

      <Pressable
        disabled={!canPay}
        onPress={onPay}
        style={{
          marginTop: 20,
          height: 56,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: canPay ? "#4F63AC" : "#9CA3AF",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Pay now</Text>
      </Pressable>
    </View>
  );
}
