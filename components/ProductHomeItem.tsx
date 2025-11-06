import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProductHomeItemProps = {
  item: {
    id: string | number;
    title: string;
    image?: string;
    price: number;
  };
  onPress?: () => void;
};

export default function ProductHomeItem({
  item,
  onPress,
}: ProductHomeItemProps) {
  const price =
    typeof item.price === "number"
      ? `${item.price.toFixed(2)} €`
      : String(item.price);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No image</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB", // sama mis Headeri ja Settingsi kastidel
  },
  image: {
    width: "100%",
    height: 150, // Figma moodi suht madal pilt kaardil
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827", // sama tumedus kui sul mujal
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F63AC", // sinu primaarne
  },
});
