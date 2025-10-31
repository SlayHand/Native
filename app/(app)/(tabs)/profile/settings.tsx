// app/(tabs)/profile/settings.tsx
import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { changePassword, me, updateMe } from "@/lib/api";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Me = { id: string; name: string; email: string };

export default function SettingsScreen() {
  const { token, setSignedIn } = useAuth();

  // ---- Profile state ----
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [user, setUser] = useState<Me | null>(null);

  // Editable state
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ---- Password modal state ----
  const [pwdModal, setPwdModal] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  // Derived: kas midagi on muudetud
  const dirty = useMemo(() => {
    if (!user) return false;
    return (
      name.trim() !== (user.name ?? "") || email.trim() !== (user.email ?? "")
    );
  }, [name, email, user]);

  // ---- Load profile ----
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
        if (cancelled) return;
        setUser(data);
        setName(data.name ?? "");
        setEmail(data.email ?? "");
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

  // ---- Handlers ----
  async function onSaveProfile() {
    try {
      if (!token) throw new Error("Not signed in");
      if (!name.trim() || !email.trim()) {
        Alert.alert("Please fill name and email");
        return;
      }
      const res = await updateMe(token, {
        name: name.trim(),
        email: email.trim(),
      });
      // kui backend tagastab uue tokeni (email muutus)
      if (res.token) await setSignedIn(res.token);

      setUser(res.user);
      setEditMode(false);
      Alert.alert("Saved", "Your profile was updated");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message ?? "Try again");
    }
  }

  function onCancelEdit() {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setEditMode(false);
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
      await changePassword(token, { oldPassword: oldPwd, newPassword: newPwd });
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

  // ---- Small helpers ----
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Settings" showBack />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {/* Personal Information (Figma stiilis, pliiats paremal) */}
        <Section
          title="Personal Information"
          action={
            !loadingProfile ? (
              editMode ? (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={onCancelEdit}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#D7DCE5",
                      backgroundColor: "#fff",
                    })}
                  >
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={onSaveProfile}
                    disabled={!dirty}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : dirty ? 1 : 0.5,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: "#4F63AC",
                    })}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Save
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setEditMode(true)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Edit personal information"
                >
                  <Image
                    source={require("@/assets/images/pencil.png")}
                    style={{ width: 18, height: 18 }}
                  />
                </Pressable>
              )
            ) : null
          }
        >
          {/* Name row */}
          <Row
            left={
              loadingProfile ? (
                <ActivityIndicator />
              ) : editMode ? (
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      minWidth: 200,
                    }}
                  />
                </View>
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
          {/* Email row */}
          <Row
            left={
              loadingProfile ? (
                <ActivityIndicator />
              ) : editMode ? (
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      minWidth: 200,
                    }}
                  />
                </View>
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

        {/* Help Center (Figma) + Change password */}
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
          <Row
            left={<Text style={{ fontSize: 16 }}>Change password</Text>}
            right={<Text style={{ color: "#9CA3AF" }}>›</Text>}
            onPress={() => setPwdModal(true)}
          />
        </Section>
      </ScrollView>

      {/* Password modal */}
      <Modal visible={pwdModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 480,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              Change password
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              Current password
            </Text>
            <TextInput
              value={oldPwd}
              onChangeText={setOldPwd}
              secureTextEntry
              placeholder="••••••••"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
              }}
            />

            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              New password
            </Text>
            <TextInput
              value={newPwd}
              onChangeText={setNewPwd}
              secureTextEntry
              placeholder="••••••••"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                onPress={() => {
                  if (!savingPwd) {
                    setPwdModal(false);
                    setOldPwd("");
                    setNewPwd("");
                  }
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#D7DCE5",
                  backgroundColor: "#fff",
                })}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={savingPwd}
                onPress={onChangePassword}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  backgroundColor: "#4F63AC",
                })}
              >
                {savingPwd ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Change
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
