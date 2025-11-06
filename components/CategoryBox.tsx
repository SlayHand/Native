import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CategoryBoxProps = {
  item: {
    id?: string | number;
    title: string;
    image?: string;
  };
  selected?: boolean;
  onPress?: () => void;
};

export default function CategoryBox({
  item,
  selected = false,
  onPress,
}: CategoryBoxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: selected ? "#4F63AC" : "#E5E7EB",
          backgroundColor: selected ? "#4F63AC" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item?.image ? (
          <Image
            source={{ uri: item.image }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
            }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: selected ? "rgba(255,255,255,0.25)" : "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#9CA3AF", fontSize: 10 }}>No img</Text>
          </View>
        )}
      </View>
      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          textAlign: "center",
          color: selected ? "#111827" : "#111827",
          fontWeight: selected ? "600" : "400",
        }}
        numberOfLines={1}
      >
        {item?.title}
      </Text>
    </TouchableOpacity>
  );
}
