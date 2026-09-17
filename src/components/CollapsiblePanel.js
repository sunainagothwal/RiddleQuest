import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/theme";

export default function CollapsiblePanel({ visible, icon, label, text, tint = COLORS.accent }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [visible, measuredHeight]);

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, measuredHeight + 24],
  });

  return (
    <Animated.View style={[styles.wrapper, { height, opacity: anim }]}>
      <View
        style={[styles.inner, { borderColor: tint + "55", backgroundColor: tint + "14" }]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && Math.abs(h - measuredHeight) > 1) setMeasuredHeight(h);
        }}
      >
        <Text style={[styles.label, { color: tint }]}>
          {icon} {label}
        </Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    marginTop: 12,
  },
  inner: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  label: {
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 21,
  },
});
