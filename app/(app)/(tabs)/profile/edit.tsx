import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { changePassword, me, updateMe } from "@/lib/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { token, setSignedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // lae profiil
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!token) return;
        setLoading(true);
        const u = await me(token);
        if (!cancelled) {
          setName(u.name ?? "");
          setEmail(u.email ?? "");
        }
      } catch (e: any) {
        if (!cancelled)
          Alert.alert("Error", e?.message ?? "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSaveProfile() {
    if (!token) return;
    if (!name.trim() || !email.trim()) {
      Alert.alert("Please fill name and email");
      return;
    }
    try {
      setSaving(true);
      const res = await updateMe(token, {
        name: name.trim(),
        email: email.trim(),
      });
      if (res.token) {
        // email muutus -> backend andis uue JWT
        await setSignedIn(res.token);
      }
      Alert.alert("Saved", "Profile updated");
      router.back();
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Please try again");
    } finally {
      setSaving(false);
    }
  }

  async function onChangePassword() {
    if (!token) return;
    if (!currentPwd || !newPwd || newPwd !== confirmPwd) {
      Alert.alert("Check fields", "Passwords don't match or missing fields.");
      return;
    }
    try {
      setSaving(true);
      await changePassword(token, {
        oldPassword: currentPwd, // backend ootab oldPassword
        newPassword: newPwd,
      });
      Alert.alert("Saved", "Password changed");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e: any) {
      Alert.alert("Failed", e?.message ?? "Please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <Header title="Edit Profile" showBack />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Name */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text style={{ color: "#6B7280", marginBottom: 6 }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={!loading && !saving}
            placeholder="Your name"
            style={{ paddingVertical: 10, fontSize: 16 }}
          />
        </View>

        {/* Email */}
        <View style={{ height: 12 }} />
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text style={{ color: "#6B7280", marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            editable={!loading && !saving}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            style={{ paddingVertical: 10, fontSize: 16 }}
          />
        </View>

        {/* Save profile */}
        <View style={{ height: 16 }} />
        <Pressable
          disabled={saving || loading || !name.trim() || !email.trim()}
          onPress={onSaveProfile}
          style={{
            opacity: saving || loading ? 0.6 : 1,
            backgroundColor: "#4F63AC",
            height: 56,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {saving ? "Saving…" : "Save"}
          </Text>
        </Pressable>

        {/* Change password */}
        <View style={{ height: 32 }} />
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>
          Change Password
        </Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <TextInput
            value={currentPwd}
            onChangeText={setCurrentPwd}
            placeholder="Current password"
            secureTextEntry
            style={{ paddingVertical: 10, fontSize: 16 }}
          />
          <View style={{ height: 8 }} />
          <TextInput
            value={newPwd}
            onChangeText={setNewPwd}
            placeholder="New password"
            secureTextEntry
            style={{ paddingVertical: 10, fontSize: 16 }}
          />
          <View style={{ height: 8 }} />
          <TextInput
            value={confirmPwd}
            onChangeText={setConfirmPwd}
            placeholder="Confirm new password"
            secureTextEntry
            style={{ paddingVertical: 10, fontSize: 16 }}
          />
        </View>

        <View style={{ height: 16 }} />
        <Pressable
          disabled={saving || loading}
          onPress={onChangePassword}
          style={{
            opacity: saving || loading ? 0.6 : 1,
            backgroundColor: "#111827",
            height: 56,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {saving ? "Saving…" : "Change password"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
