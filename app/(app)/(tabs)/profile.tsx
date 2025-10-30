import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Profile() {
  const { signOut } = useAuth();

  async function onLogout() {
    await signOut();
    router.replace("/sign-in");
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Profile</Text>
      <Pressable
        onPress={onLogout}
        style={{
          backgroundColor: "#ef4444",
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Log out</Text>
      </Pressable>
    </View>
  );
}
