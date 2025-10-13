import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean; // password väli?
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
}: Props) {
  const [visible, setVisible] = useState(false);
  const isPassword = secure;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.fieldRow, !!error && styles.fieldRowError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={isPassword && !visible}
        />

        {isPassword && (
          <Pressable
            hitSlop={8}
            onPress={() => setVisible((v) => !v)}
            style={styles.eyeBtn}
          >
            <Image
              // Kui aliasiga import ei tööta, vaheta ESM importideks või kasuta relatiivteed
              source={
                visible
                  ? require("@/assets/images/eye_closed.png")
                  : require("@/assets/images/eye.png")
              }
              style={styles.eyeIcon}
            />
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
