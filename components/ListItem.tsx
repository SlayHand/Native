import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ListItem({ title, subtitle, onPress, style }: Props) {
  const content = (
    <View
      style={[
        {
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        },
        style,
      ]}
    >
      <Text style={{ fontWeight: "700" }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: "#6B7280", marginTop: 4 }}>{subtitle}</Text>
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      android_ripple={{ color: "#E5E7EB" }}
    >
      {content}
    </Pressable>
  );
}
