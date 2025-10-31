import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  async function onLogout() {
    await signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Profile" rightText="Log out" onRightPress={onLogout} />

      <View style={{ padding: 16 }}>
        {/* Kasutaja */}
        <Text style={{ fontSize: 22, fontWeight: "700" }}>User</Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>user@mail.com</Text>

        {/* Kaardid */}
        <View style={{ marginTop: 16, gap: 12 }}>
          <ListItem
            title="My Listings"
            onPress={() => router.push("/(app)/(tabs)/profile/new-listing")}
          />
          <ListItem
            title="Settings"
            onPress={() => router.push("/(app)/(tabs)/profile/settings")}
          />
        </View>
      </View>

      {/* Alumine CTA (soovi korral) */}
      <View style={{ marginTop: "auto", padding: 16 }}>
        <Pressable
          onPress={() => router.push("/(app)/(tabs)/profile/new-listing")}
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: "#4F63AC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            New Listing
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
