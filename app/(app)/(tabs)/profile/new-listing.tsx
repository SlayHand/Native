import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { createListing } from "@/lib/api";
import { listCategories } from "@/lib/shopApi"; // GET https://fakestoreapi.com/products/categories
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NewListingScreen() {
  const { token } = useAuth();

  // form
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  // categories
  const [loadingCats, setLoadingCats] = useState(true);
  const [cats, setCats] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // submit state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingCats(true);
        const c = await listCategories(); // -> string[]
        if (!cancelled) setCats(c);
      } catch {
        if (!cancelled) setCats([]);
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    if (!res.canceled && res.assets?.length) {
      const asset = res.assets[0];
      // kui on base64, teeme data-uri
      if (asset.base64) {
        setImageUri(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        // fallback, kui mingil põhjusel base64 ei tulnud
        setImageUri(asset.uri);
      }
    }
  }

  async function onSubmit() {
    try {
      if (!token) throw new Error("Not signed in");
      if (!title.trim() || !category.trim() || !price.trim()) {
        Alert.alert("Fill required fields (title, category, price)");
        return;
      }
      const numPrice = Number(price);
      if (!Number.isFinite(numPrice) || numPrice < 0) {
        Alert.alert("Price must be a positive number");
        return;
      }

      setSubmitting(true);
      await createListing(token, {
        title: title.trim(),
        price: numPrice,
        category: category.trim(),
        description: description.trim(),
        image: imageUri ?? "",
      });

      Alert.alert("Success", "Listing created");
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImageUri(undefined);
    } catch (e: any) {
      Alert.alert("Create failed", e?.message ?? "Try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <Header title="Create a new listing" showBack />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Photos */}
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Upload photos</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Add tile */}
          <Pressable
            onPress={pickImage}
            style={{
              width: 96,
              height: 96,
              borderWidth: 1,
              borderColor: "#CBD5E1",
              borderStyle: "dashed",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 28, color: "#6B7280" }}>＋</Text>
          </Pressable>

          {/* Preview (single, Figma näitel) */}
          {imageUri ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: 96, height: 96, borderRadius: 12 }}
                contentFit="cover"
              />
              <Pressable
                onPress={() => setImageUri(undefined)}
                hitSlop={8}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#EEF2FF",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                }}
              >
                <Text style={{ color: "#4F63AC", fontWeight: "700" }}>×</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <View style={{ height: 16 }} />
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Title</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#CBD5E1",
          }}
        >
          <TextInput
            placeholder="Listing Title"
            value={title}
            onChangeText={setTitle}
            style={{ padding: 14, fontSize: 16 }}
          />
        </View>

        {/* Category (picker) */}
        <View style={{ height: 16 }} />
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Category</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#CBD5E1",
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: category ? "#111827" : "#9CA3AF" }}>
            {category || "Select the category"}
          </Text>
          <Text style={{ color: "#9CA3AF" }}>▾</Text>
        </Pressable>

        {/* Price */}
        <View style={{ height: 16 }} />
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Price</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#CBD5E1",
          }}
        >
          <TextInput
            placeholder="Enter price in USD"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
            style={{ padding: 14, fontSize: 16 }}
          />
        </View>

        {/* Description */}
        <View style={{ height: 16 }} />
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>Description</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#CBD5E1",
          }}
        >
          <TextInput
            placeholder="Tell us more..."
            value={description}
            onChangeText={setDescription}
            style={{ padding: 14, fontSize: 16, minHeight: 120 }}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <View style={{ height: 24 }} />
        <Pressable
          disabled={
            submitting ||
            !title.trim() ||
            !category ||
            !price.trim() ||
            !Number.isFinite(Number(price))
          }
          onPress={onSubmit}
          style={{
            opacity:
              submitting ||
              !title.trim() ||
              !category ||
              !price.trim() ||
              !Number.isFinite(Number(price))
                ? 0.6
                : 1,
            backgroundColor: "#4F63AC",
            height: 56,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>Submit</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* Category picker modal */}
      <Modal visible={pickerOpen} transparent animationType="fade">
        <Pressable
          onPress={() => setPickerOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: 24,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 12,
              maxHeight: "60%",
            }}
          >
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>
                Select category
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />
            {loadingCats ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator />
              </View>
            ) : cats.length === 0 ? (
              <View style={{ padding: 16 }}>
                <Text style={{ color: "#6B7280" }}>No categories</Text>
              </View>
            ) : (
              cats.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setCategory(c);
                    setPickerOpen(false);
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{c}</Text>
                  {category === c ? <Text>✓</Text> : null}
                </Pressable>
              ))
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
