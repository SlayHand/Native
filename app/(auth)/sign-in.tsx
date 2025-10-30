// app/(auth)/sign-in.tsx
import ArrowPng from "@/assets/images/arrow.png";
import EyeOpen from "@/assets/images/eye.png";
import EyeClosed from "@/assets/images/eye_closed.png";
import { useAuth } from "@/hooks/use-auth";
import { loginUser } from "@/lib/api";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { auth } from "./styles";

export default function SignIn() {
  const { setSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = Boolean(email.trim() && pwd && !loading);

  async function onSubmit() {
    try {
      if (!canSubmit) return;
      setLoading(true);

      const { token } = await loginUser({ email: email.trim(), password: pwd });
      await setSignedIn(token);
      router.replace("/(app)/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={auth.screen}>
      <View style={auth.headerRow}>
        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [
            auth.headerBack,
            pressed ? auth.pressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Image source={ArrowPng} style={auth.headerIcon} />
        </Pressable>
        <Text style={auth.headerTitle}>Sign In</Text>
      </View>

      <Text style={auth.label}>E-mail</Text>
      <TextInput
        style={auth.input}
        placeholder="example@gmail.com"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
      />

      <Text style={auth.label}>Password</Text>
      <View style={auth.inputWrapper}>
        <TextInput
          style={auth.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          value={pwd}
          onChangeText={setPwd}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit) onSubmit();
          }}
        />
        <Pressable
          onPress={() => setShow((v) => !v)}
          hitSlop={8}
          style={auth.eyeBtn}
        >
          <Image source={show ? EyeClosed : EyeOpen} style={auth.eyeIcon} />
        </Pressable>
      </View>

      <Pressable
        style={[auth.cta, !canSubmit ? { opacity: 0.6 } : undefined]}
        disabled={!canSubmit}
        onPress={onSubmit}
      >
        <Text style={auth.ctaText}>{loading ? "Please wait…" : "Sign In"}</Text>
      </Pressable>

      <View style={auth.footer}>
        <Pressable onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={auth.footerText}>
            Don’t have an account? <Text style={auth.footerLink}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
