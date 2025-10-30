import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  showSearch?: boolean;
  showLogout?: boolean; // vajadusel
  showBack?: boolean; // vajadusel
  showSearchInput?: boolean;
  onToggleSearch?: () => void;
  keyword?: string;
  setKeyword?: (v: string) => void;
};

export default function Header({
  title,
  showSearch = true,
  showLogout = false,
  showBack = false,
  showSearchInput = false,
  onToggleSearch,
  keyword,
  setKeyword,
}: Props) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* left icon area */}
        <View style={{ width: 32, alignItems: "flex-start" }}>
          {showSearch ? (
            <TouchableOpacity onPress={onToggleSearch} hitSlop={12}>
              <Ionicons name="search" size={22} />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={{ fontSize: 20, fontWeight: "700" }}>{title}</Text>

        {/* right icon spacer or icons */}
        <View style={{ width: 32, alignItems: "flex-end" }}>
          {showLogout ? (
            <Ionicons name="log-out-outline" size={22} />
          ) : showBack ? (
            <Ionicons name="arrow-back" size={22} />
          ) : null}
        </View>
      </View>

      {showSearchInput && (
        <View style={{ marginTop: 12 }}>
          <TextInput
            placeholder="Search..."
            value={keyword}
            onChangeText={setKeyword}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 44,
            }}
          />
        </View>
      )}
    </View>
  );
}
