// app/(auth)/sign-up.tsx
import EyeOpen from "@/assets/images/eye.png";
import EyeClosed from "@/assets/images/eye_closed.png";
import { registerUser } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { auth } from "./styles";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() && email.trim() && pwd && agree && !loading;

  async function onSubmit() {
    if (!agree)
      return Alert.alert("Please accept Terms & Privacy to continue.");
    try {
      setLoading(true);
      const { token } = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password: pwd,
      });
      await AsyncStorage.setItem("auth_token", token);
      // kui sul on hiljem /(app)/home, võid siin kasutada router.replace("/(app)/home")
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Registration failed", e?.message ?? "Try again");
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
          <Image
            source={require("@/assets/images/arrow.png")}
            style={auth.headerIcon}
          />
        </Pressable>
        <Text style={auth.headerTitle}>Sign Up</Text>
      </View>

      {/* Name */}
      <Text style={auth.label}>Name</Text>
      <TextInput
        style={auth.input}
        placeholder="John Doe"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
      />

      {/* Email */}
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

      {/* Terms */}
      <View style={auth.checkRow}>
        <Pressable onPress={() => setAgree((v) => !v)} style={auth.checkBox}>
          {agree && (
            <Image
              source={require("@/assets/images/Check.png")}
              style={auth.checkIcon}
            />
          )}
        </Pressable>
        <Text style={auth.checkText}>
          I agree with <Text style={auth.linkBold}>Terms & Privacy</Text>
        </Text>
      </View>

      {/* Submit */}
      <Pressable
        style={[auth.cta, !canSubmit ? { opacity: 0.6 } : undefined]}
        disabled={!canSubmit}
        onPress={onSubmit}
      >
        <Text style={auth.ctaText}>{loading ? "Please wait…" : "Sign Up"}</Text>
      </Pressable>

      {/* Divider */}
      <View style={auth.dividerRow}>
        <View style={auth.dividerLine} />
        <Text style={auth.dividerText}>Or sign up with</Text>
        <View style={auth.dividerLine} />
      </View>

      {/* Google */}
      <Pressable
        style={auth.socialBtn}
        onPress={() => {
          /* TODO: Google sign-up */
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
        <Pressable onPress={() => router.push("/sign-in")}>
          <Text style={auth.footerText}>
            Already have an account?{" "}
            <Text style={auth.footerLink}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
