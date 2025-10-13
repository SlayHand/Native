import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 14, // vahe järgmise komponendini
  },
  label: {
    fontSize: 14,
    color: "#4F63AC", // sama toon, mis sul authis labelitel
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8D9BB5", // grey prototüübist
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldRowError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    padding: 0, // väldi topelt paddingut (fieldRow annab padja)
    height: 36, // visuaalne kõrgus; koos fieldRow paddinguga kokku ~60
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
  },
  eyeIcon: { width: 20, height: 20, tintColor: "#8D9BB5" },
  error: { color: "#EF4444", fontSize: 12, marginTop: 6 },
});
