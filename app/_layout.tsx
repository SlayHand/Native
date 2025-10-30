// app/_layout.tsx
import { useAuth } from "@/hooks/use-auth";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { loading, signedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Route group "(auth)" ei ilmu URL-i, seega loeme mõlemat:
    const top = segments[0]; // võib olla "(auth)" native's
    const inAuthByGroup = top === "(auth)";
    const inAuthByPath = pathname === "/sign-in" || pathname === "/sign-up";
    const inAuth = inAuthByGroup || inAuthByPath;

    const atRoot = pathname === "/" || pathname === "";

    if (signedIn) {
      // kui sees ja oled Splashis või authis -> Tabs
      if (inAuth || atRoot) router.replace("/(app)/(tabs)");
    } else {
      // kui väljas – lubame "/" ja auth-lehed; muu tagasi Splashile
      if (!inAuth && !atRoot) router.replace("/");
    }
  }, [loading, signedIn, pathname, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
