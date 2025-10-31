// components/Header.tsx
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  title: string;

  // Back-nupp
  showBack?: boolean;
  onBack?: () => void;

  // Otsing (Home ekraanil)
  showSearch?: boolean;
  showSearchInput?: boolean;
  onToggleSearch?: () => void;
  keyword?: string;
  setKeyword?: (v: string) => void;

  // Parem nupp (nt "Log out")
  rightText?: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
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
  onLogout,
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
      {/* Ülemine rida: Back + Title + Right */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Vasak: back + title */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {showBack ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              accessibilityRole="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#D7DCE5",
              }}
            >
              <Text style={{ fontSize: 18 }}>‹</Text>
            </Pressable>
          ) : null}

          <Text style={{ fontSize: 22, fontWeight: "700" }}>{title}</Text>
        </View>

        {/* Parem: kas otsingu-ikoon või custom right-nupp */}
        {rightText || rightIcon ? (
          <Pressable
            onPress={onRightPress}
            accessibilityRole="button"
            style={{
              paddingHorizontal: 12,
              height: 40,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#D7DCE5",
            }}
          >
            {rightIcon ? (
              rightIcon
            ) : (
              <Text style={{ fontWeight: "700" }}>{rightText}</Text>
            )}
          </Pressable>
        ) : showSearch ? (
          <Pressable
            onPress={onToggleSearch}
            accessibilityRole="button"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#D7DCE5",
            }}
          >
            <Text style={{ fontSize: 16 }}>🔍</Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Otsinguväli */}
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
