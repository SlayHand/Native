import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CategoryBox({ item, selected, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 16,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? "#111" : "#ddd",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={{ uri: item?.image }}
          style={{ width: 56, height: 56, borderRadius: 12 }}
        />
      </View>
      <Text style={{ marginTop: 6, fontSize: 12, textAlign: "center" }}>
        {item?.title}
      </Text>
    </TouchableOpacity>
  );
}
