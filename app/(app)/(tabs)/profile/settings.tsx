// app/(tabs)/profile/settings.tsx
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { useAuth } from "@/hooks/use-auth";
import { me } from "@/lib/api";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type Me = { id: string; name: string; email: string };

export default function SettingsScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [user, setUser] = useState<Me | null>(null);

  // lae kasutaja
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!token) {
          setUser(null);
          return;
        }
        setLoadingProfile(true);
        const data = await me(token);
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) {
          setUser(null);
          Alert.alert("Error", "Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Header title="Settings" showBack />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
      >
        {/* Personal Information header + pencil */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#6B7280", fontSize: 13 }}>
            Personal Information
          </Text>

          {!loadingProfile ? (
            <Pressable
              onPress={() => router.push("/(app)/(tabs)/profile/edit")}
              hitSlop={8}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("@/assets/images/pencil.png")}
                style={{ width: 18, height: 18 }}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Name box */}
        {loadingProfile ? (
          <ActivityIndicator />
        ) : (
          <>
            <InfoBox label="Name" value={user?.name || "—"} />
            <InfoBox label="Email" value={user?.email || "—"} />
          </>
        )}

        {/* Help Center */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 8 }}>
            Help Center
          </Text>

          <View style={{ gap: 12 }}>
            <ListItem
              title="FAQ"
              onPress={() => Alert.alert("FAQ", "Coming soon")}
            />
            <ListItem
              title="Contact Us"
              onPress={() => Alert.alert("Contact Us", "Coming soon")}
            />
            <ListItem
              title="Privacy & Terms"
              onPress={() => Alert.alert("Privacy & Terms", "Coming soon")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Figma-stiilis väike kaart: label hall, value sinine, pole noolt.
 */
function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#4F63AC" }}>
        {value}
      </Text>
    </View>
  );
}
