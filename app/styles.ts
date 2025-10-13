// app/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: { width: "100%", height: 200, marginBottom: 16 },
  heading: { fontSize: 40, fontWeight: "bold", textAlign: "center" },
  headingAccent: {
    color: "#FCA340",
    textDecorationLine: "underline",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  actions: { width: "100%", alignSelf: "stretch", marginTop: 24, gap: 12 },

  ctaPrimary: {
    backgroundColor: "#4F63AC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  ctaPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  ctaSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  ctaSecondaryText: {
    color: "#4F63AC",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  pressed: { opacity: 0.8 },
});
