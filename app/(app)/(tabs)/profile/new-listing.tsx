import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NewListingScreen() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  const canSubmit = title.trim() && price.trim();

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Settings" showBack />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Piltide picker (placeholder) */}
        <ListItem title="Add images (TBD)" />

        {/* Väljad */}
        <View style={{ marginTop: 16, gap: 12 }}>
          <Field
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Oak chair"
          />
          <Field
            label="Price (€)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="e.g. 129.99"
          />
          <Field
            label="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
            placeholder="Short description"
          />
        </View>

        <Pressable
          disabled={!canSubmit}
          onPress={() => {
            Alert.alert("Submitted", "Listing created (mock).");
            router.back();
          }}
          style={{
            marginTop: 20,
            height: 56,
            borderRadius: 12,
            backgroundColor: canSubmit ? "#4F63AC" : "#9CA3AF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Create Listing
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: any;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, color: "#6B7280" }}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#D7DCE5",
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: props.multiline ? 100 : 48,
          textAlignVertical: props.multiline ? "top" : "auto",
        }}
      />
    </View>
  );
}
