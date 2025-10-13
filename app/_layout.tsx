// app/_layout.tsx
import { useAuth } from "@/hooks/use-auth";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { loading, signedIn } = useAuth();

  useEffect(() => {
    if (loading) return;

    const top = segments[0]; // undefined => "/" (Splash)
    const inAuth = top === "(auth)";
    const inApp = top === "(app)";

    if (signedIn) {
      // kui sees, vii tabidesse (kui juba appis, jäta rahule)
      if (!inApp) router.replace("/(app)/(tabs)");
    } else {
      // kui pole sees, blokime app-segmendi
      if (inApp) router.replace("/");
      // "/" ja (auth) on lubatud
    }
  }, [loading, signedIn, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
