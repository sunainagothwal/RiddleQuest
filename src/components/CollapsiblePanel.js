import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

// Renders as a floating glass tooltip (positioned by the parent) rather
// than pushing the layout when it opens — so toggling the hint never
// changes the screen's total height or triggers scrolling.
export default function CollapsiblePanel({ visible, icon, label, text, tint = COLORS.accent }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  }, [visible, anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.wrapper, { opacity: anim, transform: [{ translateY }, { scale }] }]}
    >
      <GlassSurface radius={16} intensity={40} fill={tint + "26"} borderColor={tint + "66"}>
        <View style={styles.inner}>
          <Text style={[styles.label, { color: tint }]}>
            {icon} {label}
          </Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </GlassSurface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "100%",
    marginBottom: 10,
  },
  inner: {
    padding: 12,
  },
  label: {
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 3,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 19,
  },
});
