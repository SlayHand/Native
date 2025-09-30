import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
        Create account
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pwd}
        onChangeText={setPwd}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Pressable
        onPress={() => {
          /* TODO: register */
        }}
        style={({ pressed }) => [
          {
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: "#4F63AC",
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Sign up</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/sign-in")}
        style={{ padding: 8, alignItems: "center" }}
      >
        <Text>
          Already have an account?{" "}
          <Text style={{ color: "#4F63AC", fontWeight: "600" }}>Sign in</Text>
        </Text>
      </Pressable>
    </View>
  );
}
