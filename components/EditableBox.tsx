import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (t: string) => void;
};

export default function EditableBox({
  label,
  value,
  editable,
  onChangeText,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
        {label}
      </Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={{ fontSize: 16 }}
          placeholder={label}
        />
      ) : (
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{value}</Text>
      )}
    </View>
  );
}
