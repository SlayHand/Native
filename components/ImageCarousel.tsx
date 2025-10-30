import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ImageCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const ref = useRef<FlatList<string>>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    if (idx !== active) setActive(idx);
  }

  return (
    <View>
      <FlatList
        ref={ref}
        data={images}
        keyExtractor={(uri, i) => uri + String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: 300 }}
            contentFit="cover"
          />
        )}
      />
      {/* Pagination dots */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {images.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: i === active ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </View>
    </View>
  );
}
