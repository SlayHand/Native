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

  label: { fontSize: 14, color: "#4F63AC", marginBottom: 6 },
  inputWrapper: { position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#D7DCE5",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    height: 60,
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
  checkText: { color: "#4F63AC" },
  linkBold: { color: "#4F63AC", fontWeight: "700" },

  cta: {
    backgroundColor: "#4F63AC",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: {
    color: "#4F63AC",
    fontWeight: "600",
    fontSize: 14,
  },

  socialBtn: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 142,
    height: 60,
    gap: 8,
    alignSelf: "center",
  },
  gIcon: { width: 18, height: 18 },
  socialText: { color: "#fff", fontWeight: "600" },

  footer: { alignItems: "center", marginTop: 8 },
  footerText: { color: "#4F63AC" },
  footerLink: { color: "#4F63AC", fontWeight: "600" },

  pressed: { opacity: 0.8 },
});
