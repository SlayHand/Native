import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (t: string) => void;
  placeholder?: string;
};

export default function EditableBox({
  label,
  value,
  editable = false,
  onChangeText,
  placeholder,
}: Props) {
  const displayValue = value?.trim() ? value : "—";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 6,
      }}
    >
      <Text style={{ fontSize: 12, color: "#6B7280" }}>{label}</Text>

      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? label}
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
          }}
        />
      ) : (
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          {displayValue}
        </Text>
      )}
    </View>
  );
}
