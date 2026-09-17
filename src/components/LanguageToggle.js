import React, { useEffect, useRef } from "react";
import { Pressable, Animated, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { COLORS } from "../theme/theme";

const WIDTH = 84;
const HEIGHT = 40;
const KNOB = 34;

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

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#3A2A6D", "#3A2A6D"],
  });

  return (
    <Pressable onPress={toggleLanguage} accessibilityRole="switch" accessibilityLabel="Toggle language">
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <View style={styles.labelRow} pointerEvents="none">
          <Text style={[styles.label, lang === "en" && styles.labelActive]}>EN</Text>
          <Text style={[styles.label, lang === "hi" && styles.labelActive]}>हि</Text>
        </View>
        <Animated.View style={[styles.knob, { left: knobLeft }]}>
          <Text style={styles.knobText}>{lang === "en" ? "EN" : "हि"}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
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
    fontSize: 11,
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
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  knobText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B1035",
  },
});
