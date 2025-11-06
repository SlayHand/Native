import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 260; // natuke madalam kui 300, mis sul oli

type ImageCarouselProps = {
  images: string[];
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [active, setActive] = useState(0);
  const ref = useRef<FlatList<string>>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    if (idx !== active) setActive(idx);
  }

  // kui pilte pole, näita placeholderit
  if (!images || images.length === 0) {
    return (
      <View
        style={{
          width,
          height: CAROUSEL_HEIGHT,
          backgroundColor: "#F3F4F6",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Text style={{ color: "#9CA3AF" }}>No images</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width,
        height: CAROUSEL_HEIGHT,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <FlatList
        ref={ref}
        data={images}
        keyExtractor={(uri, i) => uri + String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: CAROUSEL_HEIGHT }}
            contentFit="cover"
          />
        )}
      />

      {/* pagination "ribad" nagu sinu piltidel */}
      <View
        style={{
          position: "absolute",
          bottom: 16, // veidi kõrgemal kui 10
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
              width: i === active ? 22 : 14,
              height: 4,
              borderRadius: 999,
              backgroundColor:
                i === active
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </View>
    </View>
  );
}
