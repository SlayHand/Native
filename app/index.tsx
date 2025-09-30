import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/Splash.png")}
        contentFit="contain"
        style={styles.image}
      />

      <Text style={styles.heading}>You'll Find</Text>
      <Text style={styles.headingAccent}>All you need</Text>
      <Text style={styles.heading}>Here!</Text>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sign-up")}
          style={({ pressed }) => [
            styles.ctaPrimary,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.ctaPrimaryText}>Sign Up</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sign-in")}
          style={({ pressed }) => [
            styles.ctaSecondary,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.ctaSecondaryText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
