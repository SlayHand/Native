import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Splash ---
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingAccent: {
    color: "#FCA340",
    textDecorationLine: "underline",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  actions: {
    width: "100%",
    alignSelf: "stretch", // oluline, et webis täislaius tekiks
    marginTop: 24,
    gap: 12, // kui 'gap' ei tööta, pane teisele nupule marginTop:12
  },

  // --- CTA nupud ---
  ctaPrimary: {
    backgroundColor: "#4F63AC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
    borderWidth: 1,
    borderColor: "#4F63AC",
  },
  ctaSecondaryText: {
    color: "#4F63AC",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  pressed: { opacity: 0.8 },
});
