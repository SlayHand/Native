// components/Header.tsx
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;

  showSearch?: boolean;
  showSearchInput?: boolean;
  onToggleSearch?: () => void;
  keyword?: string;
  setKeyword?: (v: string) => void;

  rightText?: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;

  // ← uus
  searchOnLeft?: boolean;
};

export default function Header({
  title,
  showBack,
  onBack,
  showSearch,
  showSearchInput,
  onToggleSearch,
  keyword,
  setKeyword,
  rightText,
  rightIcon,
  onRightPress,
  searchOnLeft = false,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* LEFT SLOT */}
        {searchOnLeft && showSearch ? (
          <Pressable
            onPress={onToggleSearch}
            hitSlop={10}
            style={{
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/luup.png")}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
          </Pressable>
        ) : showBack ? (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            hitSlop={10}
            style={{
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/Nool.png")}
              style={{ width: 16, height: 16, transform: [{ scaleX: -1 }] }}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <View style={{ width: 32, height: 32 }} />
        )}

        {/* TITLE */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {title}
          </Text>
        </View>

        {/* RIGHT SLOT */}
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={10}
            style={{
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {rightIcon}
          </Pressable>
        ) : rightText ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={10}
            style={{
              minWidth: 32,
              minHeight: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: "#4F63AC" }}>
              {rightText}
            </Text>
          </Pressable>
        ) : (
          // kui otsing on vasakul, siis paremale ei panda midagi
          <View style={{ width: 32, height: 32 }} />
        )}
      </View>

      {/* SEARCH FIELD */}
      {showSearch && showSearchInput ? (
        <View style={{ marginTop: 12 }}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Search…"
            placeholderTextColor="#9CA3AF"
            style={{
              height: 44,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#D7DCE5",
              paddingHorizontal: 12,
              backgroundColor: "#fff",
            }}
            returnKeyType="search"
          />
        </View>
      ) : null}
    </View>
  );
}
