import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/theme";

export function StatPill({ label, value, color = COLORS.accent }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 10 }).start();
  }, [value]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <View style={styles.pill}>
      <Animated.Text style={[styles.pillValue, { color, transform: [{ scale }] }]}>
        {value}
      </Animated.Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

export function CategoryChip({ label, active, color, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      style={style}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.chip,
          {
            transform: [{ scale }],
            backgroundColor: active ? color : "rgba(255,255,255,0.05)",
            borderColor: active ? color : COLORS.cardBorder,
          },
        ]}
      >
        <Text style={[styles.chipText, { color: active ? "#160B33" : COLORS.textSecondary }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  pillValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  pillLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
  },
  chipText: {
    fontWeight: "700",
    fontSize: 13,
  },
});
