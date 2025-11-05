// app/(tabs)/profile/settings.tsx
import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { changePassword, me } from "@/lib/api";
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

  // password modal
  const [pwdModal, setPwdModal] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  // load profile
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
        if (!cancelled) {
          setUser(data);
        }
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

  function Section({
    title,
    action,
    children,
  }: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
  }) {
    return (
      <View style={{ marginTop: 16 }}>
        <View
          style={{
            paddingHorizontal: 4,
            paddingBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#6B7280" }}>{title}</Text>
          {action}
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  function Row({
    left,
    right,
    onPress,
  }: {
    left: React.ReactNode;
    right?: React.ReactNode;
    onPress?: () => void;
  }) {
    const content = (
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexShrink: 1 }}>{left}</View>
        {right}
      </View>
    );
    return onPress ? (
      <Pressable onPress={onPress} style={{ backgroundColor: "#fff" }}>
        {content}
      </Pressable>
    ) : (
      <View style={{ backgroundColor: "#fff" }}>{content}</View>
    );
  }

  function Divider() {
    return <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />;
  }

  async function onChangePassword() {
    try {
      if (!token) throw new Error("Not signed in");
      if (!oldPwd || !newPwd) {
        Alert.alert("Both password fields are required");
        return;
      }
      if (oldPwd === newPwd) {
        Alert.alert("New password must be different");
        return;
      }
      setSavingPwd(true);
      await changePassword(token, {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });
      setOldPwd("");
      setNewPwd("");
      setPwdModal(false);
      Alert.alert("Success", "Password changed");
    } catch (e: any) {
      Alert.alert("Change password failed", e?.message ?? "Try again");
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Settings" showBack />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {/* Personal information (read-only) */}
        <Section
          title="Personal Information"
          action={
            !loadingProfile ? (
              <Pressable
                onPress={() => router.push("/(app)/(tabs)/profile/edit")}
                hitSlop={8}
              >
                <Image
                  source={require("@/assets/images/pencil.png")}
                  style={{ width: 18, height: 18 }}
                />
              </Pressable>
            ) : null
          }
        >
          <Row
            left={
              loadingProfile ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>Name</Text>
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {user?.name ?? "—"}
                  </Text>
                </View>
              )
            }
          />
          <Divider />
          <Row
            left={
              loadingProfile ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>Email</Text>
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {user?.email ?? "—"}
                  </Text>
                </View>
              )
            }
          />
        </Section>

        {/* Help Center + Change password */}
        <Section title="Help Center">
          <Row
            left={<Text style={{ fontSize: 16 }}>FAQ</Text>}
            right={<Text style={{ color: "#9CA3AF" }}>›</Text>}
            onPress={() => Alert.alert("FAQ", "Coming soon")}
          />
          <Divider />
          <Row
            left={<Text style={{ fontSize: 16 }}>Contact Us</Text>}
            right={<Text style={{ color: "#9CA3AF" }}>›</Text>}
            onPress={() => Alert.alert("Contact Us", "Coming soon")}
          />
          <Divider />
          <Row
            left={<Text style={{ fontSize: 16 }}>Privacy & Terms</Text>}
            right={<Text style={{ color: "#9CA3AF" }}>›</Text>}
            onPress={() => Alert.alert("Privacy & Terms", "Coming soon")}
          />
          <Divider />
        </Section>
      </ScrollView>
    </View>
  );
}
