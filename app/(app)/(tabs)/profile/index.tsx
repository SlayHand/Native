import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { useAuth } from "@/hooks/use-auth";
import { listAllListings, me } from "@/lib/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

// väike helper tekstiks
function makeListingSubtitle(n: number | null) {
  if (n === null) return "Loading…";
  if (n === 0) return "You currently have 0 listings";
  if (n === 1) return "Already have 1 listing";
  return `Already have ${n} listings`;
}

export default function ProfileScreen() {
  const { token, signOut } = useAuth();

  const [loadingUser, setLoadingUser] = useState(true);
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@mail.com");

  // see hoiab sinu kuulutuste arvu
  const [listingCount, setListingCount] = useState<number | null>(null);

  // üks effekt, mis laeb KÕIK, kui token olemas
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        setLoadingUser(false);
        setListingCount(0);
        return;
      }

      try {
        setLoadingUser(true);

        // 1) kasutaja
        const u = await me(token);
        if (cancelled) return;

        setName(u.name ?? "User");
        setEmail(u.email ?? "user@mail.com");

        // 2) kõik kuulutused
        const all = await listAllListings();
        if (cancelled) return;

        // vaata, mis field sul tegelikult on – panin kaks varianti
        const mine = all.filter(
          (item: any) => item.userId === u.id || item.ownerId === u.id
        );

        setListingCount(mine.length);
      } catch {
        if (!cancelled) {
          setListingCount(0);
        }
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

  const listingText = makeListingSubtitle(listingCount);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <Header
        title="Profile"
        rightIcon={
          <Image
            source={require("@/assets/images/logout.png")}
            style={{ width: 16, height: 16 }}
            resizeMode="contain"
          />
        }
        onRightPress={onLogout}
      />

      <View style={{ padding: 16, flex: 1 }}>
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
            subtitle={listingText}
            onPress={() => router.push("/(app)/(tabs)/profile/listings")}
          />
          <ListItem
            title="Settings"
            subtitle="Account, FAQ, Contact"
            onPress={() => router.push("/(app)/(tabs)/profile/settings")}
          />
        </View>

        {/* Alumine CTA */}
        <View style={{ marginTop: "auto", paddingTop: 16 }}>
          <Pressable
            onPress={() => router.push("/(app)/(tabs)/profile/new-listing")}
            style={{
              width: 303,
              height: 60,
              borderRadius: 8,
              backgroundColor: "#4F63AC",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: 0.3,
              }}
            >
              Add a new listing
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
