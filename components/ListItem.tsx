import React from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProfileListItem({
  title,
  subtitle,
  onPress,
  style,
}: Props) {
  const content = (
    <View style={[styles.card, style]}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <Image
        source={require("@/assets/images/Nool.png")}
        style={styles.chevron}
      />
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.9 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "stretch",
  },
  card: {
    width: "100%", // parentis paneme paddingu, nii saab ~335px tunne
    minHeight: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    paddingHorizontal: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    // Figma shadow: X:0 Y:7 Blur:40 #8A959E 20%
    shadowColor: "#8A959E",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    // Figma: Nunito Sans 700 18px #4F63AC
    fontSize: 18,
    fontWeight: "700",
    color: "#4F63AC",
  },
  subtitle: {
    // Figma: Nunito Sans 400 12px #808080, line-height 15px
    marginTop: 6,
    fontSize: 12,
    lineHeight: 15,
    color: "#808080",
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});
