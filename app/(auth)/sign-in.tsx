// app/(auth)/sign-in.tsx
import ArrowPng from "@/assets/images/arrow.png";
import EyeOpen from "@/assets/images/eye.png";
import EyeClosed from "@/assets/images/eye_closed.png";
import { loginUser } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { auth } from "./styles";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = !!email.trim() && !!pwd && !loading;

  async function onSubmit() {
    try {
      setLoading(true);
      const { token } = await loginUser({
        email: email.trim(),
        password: pwd,
      });

      await AsyncStorage.setItem("auth_token", token);

      // ⬇️ mine kohe Tabs vaatesse (mitte "/" ehk Splash)
      router.replace("/(app)/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={auth.screen}>
      {/* Custom header */}
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

      {/* E-mail */}
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

      {/* Password */}
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
          accessibilityRole="button"
          accessibilityLabel={show ? "Hide password" : "Show password"}
        >
          <Image source={show ? EyeClosed : EyeOpen} style={auth.eyeIcon} />
        </Pressable>
      </View>

      {/* CTA */}
      <Pressable
        style={[auth.cta, !canSubmit ? { opacity: 0.6 } : undefined]}
        disabled={!canSubmit}
        onPress={onSubmit}
      >
        <Text style={auth.ctaText}>{loading ? "Please wait…" : "Sign In"}</Text>
      </Pressable>

      {/* Divider */}
      <View style={auth.dividerRow}>
        <View style={auth.dividerLine} />
        <Text style={auth.dividerText}>Or sign in with</Text>
        <View style={auth.dividerLine} />
      </View>

      {/* Google */}
      <Pressable
        style={auth.socialBtn}
        onPress={() => {
          /* TODO: Google sign-in */
        }}
      >
        <Image
          source={require("@/assets/images/Vector.png")}
          style={auth.gIcon}
        />
        <Text style={auth.socialText}>Google</Text>
      </Pressable>

      {/* Footer */}
      <View style={auth.footer}>
        <Pressable onPress={() => router.push("/sign-up")}>
          <Text style={auth.footerText}>
            Don’t have an account? <Text style={auth.footerLink}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
