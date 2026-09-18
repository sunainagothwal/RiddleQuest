import React, { useEffect, useRef } from "react";
import { Pressable, Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../context/LanguageContext";
import { COLORS, GLASS, GRADIENTS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

const WIDTH = 68;
const HEIGHT = 32;
const KNOB = 26;

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  const anim = useRef(new Animated.Value(lang === "hi" ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: lang === "hi" ? 1 : 0,
      useNativeDriver: false,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [lang]);

  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, WIDTH - KNOB - 3],
  });

  return (
    <Pressable onPress={toggleLanguage} accessibilityRole="switch" accessibilityLabel="Toggle language">
      <GlassSurface radius={HEIGHT / 2} intensity={30} fill={GLASS.fill} borderColor={GLASS.borderSoft}>
        <View style={styles.track}>
          <View style={styles.labelRow} pointerEvents="none">
            <Text style={[styles.label, lang === "en" && styles.labelActive]}>EN</Text>
            <Text style={[styles.label, lang === "hi" && styles.labelActive]}>हि</Text>
          </View>
          <Animated.View style={[styles.knob, { left: knobLeft }]}>
            <LinearGradient colors={GRADIENTS.accent} style={styles.knobGradient}>
              <Text style={styles.knobText}>{lang === "en" ? "EN" : "हि"}</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    justifyContent: "center",
    padding: 3,
  },
  labelRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  labelActive: {
    color: "transparent",
  },
  knob: {
    position: "absolute",
    top: 3,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    overflow: "hidden",
    shadowColor: "#FF8A5B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  knobGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  knobText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1B1035",
  },
});
