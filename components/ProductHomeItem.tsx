import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProductHomeItem({ item, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 16 }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 160 }}
        />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>{item.title}</Text>
          <Text style={{ marginTop: 4, color: "#666" }}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
