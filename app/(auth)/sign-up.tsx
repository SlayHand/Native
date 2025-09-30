import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { auth } from "./styles";

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <View style={auth.screen}>
      <View style={auth.headerRow}>
        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [
            auth.headerBack,
            pressed ? auth.pressed : undefined,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Image
            source={require("@/assets/images/arrow.png")}
            style={auth.headerIcon}
          />
        </Pressable>

        <Text style={auth.headerTitle}>Sign Up</Text>
      </View>

      {/* ---- ülejäänud sisu jääb samaks ---- */}
      <Text style={auth.label}>Name</Text>
      <TextInput
        style={auth.input}
        placeholder="John Doe"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={auth.label}>E-mail</Text>
      <TextInput
        style={auth.input}
        placeholder="example@gmail.com"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={auth.label}>Password</Text>
      <View style={auth.inputWrapper}>
        <TextInput
          style={auth.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!show}
        />
        <Pressable onPress={() => setShow((v) => !v)} style={auth.eyeBtn}>
          <Image
            source={require("@/assets/images/eye.png")}
            style={auth.eyeIcon}
          />
        </Pressable>
      </View>

      <View style={auth.checkRow}>
        <Pressable onPress={() => setAgree((v) => !v)} style={auth.checkBox}>
          {agree && (
            <Image
              source={require("@/assets/images/Check.png")}
              style={auth.checkIcon}
            />
          )}
        </Pressable>
        <Text style={auth.checkText}>
          I agree with <Text style={auth.linkBold}>Terms & Privacy</Text>
        </Text>
      </View>

      <Pressable style={auth.cta}>
        <Text style={auth.ctaText}>Sign Up</Text>
      </Pressable>

      <View style={auth.dividerRow}>
        <View style={auth.dividerLine} />
        <Text style={auth.dividerText}>Or sign up with</Text>
        <View style={auth.dividerLine} />
      </View>

      <Pressable style={auth.socialBtn}>
        <Image
          source={require("@/assets/images/Vector.png")}
          style={auth.gIcon}
        />
        <Text style={auth.socialText}>Google</Text>
      </Pressable>

      <View style={auth.footer}>
        <Pressable onPress={() => router.push("/sign-in")}>
          <Text>
            Already have an account?{" "}
            <Text style={auth.footerLink}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
