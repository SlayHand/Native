// app/(auth)/styles.ts
import { StyleSheet } from "react-native";

export const auth = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 16, backgroundColor: "#fff" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  headerBack: {
    height: 48,
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#4F63AC",
    backgroundColor: "transparent",
  },
  headerIcon: { width: 18, height: 18, tintColor: "#4F63AC" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#4F63AC" },

  label: { fontSize: 14, color: "#5B6B83", marginBottom: 6 },
  inputWrapper: { position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#D7DCE5",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 6,
    borderRadius: 8,
  },
  eyeIcon: { width: 20, height: 20 },

  checkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D7DCE5",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: { width: 14, height: 14 },
  checkText: { color: "#5B6B83" },
  linkBold: { color: "#4F63AC", fontWeight: "700" },

  cta: {
    backgroundColor: "#4F63AC",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { color: "#5B6B83" },

  socialBtn: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  gIcon: { width: 18, height: 18 },
  socialText: { color: "#fff", fontWeight: "600" },

  footer: { alignItems: "center", marginTop: 8 },
  footerLink: { color: "#4F63AC", fontWeight: "600" },

  pressed: { opacity: 0.8 },
});
