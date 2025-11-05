import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { useAuth } from "@/hooks/use-auth";
import { me } from "@/lib/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function ProfileScreen() {
  const { token, signOut } = useAuth();
  const [loadingUser, setLoadingUser] = useState(true);
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@mail.com");

  // tõmba päris kasutaja
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setLoadingUser(false);
        return;
      }
      try {
        setLoadingUser(true);
        const u = await me(token);
        if (!cancelled) {
          setName(u.name ?? "User");
          setEmail(u.email ?? "user@mail.com");
        }
      } catch {
        // jätame fallbacki
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onLogout() {
    await signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Profile" rightText="Log out" onRightPress={onLogout} />

      <View style={{ padding: 16 }}>
        {/* Kasutaja */}
        {loadingUser ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text style={{ fontSize: 22, fontWeight: "700" }}>{name}</Text>
            <Text style={{ color: "#6B7280", marginTop: 4 }}>{email}</Text>
          </>
        )}

        {/* Kaardid */}
        <View style={{ marginTop: 16, gap: 12 }}>
          <ListItem
            title="My Listings"
            onPress={() => router.push("/(app)/(tabs)/profile/listings")}
          />
          <ListItem
            title="Settings"
            onPress={() => router.push("/(app)/(tabs)/profile/settings")}
          />
        </View>
      </View>

      {/* Alumine CTA */}
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
