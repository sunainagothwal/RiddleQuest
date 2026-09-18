import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLASS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

// Full-size stat card — used on the Stats screen, which has room to spare.
export function StatPill({ label, value, color = COLORS.accent }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 10 }).start();
  }, [value]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <GlassSurface radius={18} intensity={36} style={styles.pillWrap}>
      <View style={styles.pill}>
        <Animated.Text style={[styles.pillValue, { color, transform: [{ scale }] }]}>
          {value}
        </Animated.Text>
        <Text style={styles.pillLabel}>{label}</Text>
      </View>
    </GlassSurface>
  );
}

// Compact icon+value badge — used on the Play screen where vertical space
// is tight and a full stat card would push the game below the fold.
export function StatBadge({ icon, value, color = COLORS.accent }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
  }, [value]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <GlassSurface radius={999} intensity={30}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={13} color={color} />
        <Animated.Text style={[styles.badgeText, { color, transform: [{ scale }] }]}>{value}</Animated.Text>
      </View>
    </GlassSurface>
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
      <Animated.View style={{ transform: [{ scale }] }}>
        {active ? (
          <View style={[styles.chip, styles.chipActive, { backgroundColor: color, borderColor: color }]}>
            <Text style={[styles.chipText, { color: "#160B33" }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        ) : (
          <GlassSurface radius={999} intensity={30} fill={GLASS.fill} borderColor={GLASS.borderSoft}>
            <View style={styles.chip}>
              <Text style={[styles.chipText, { color: COLORS.textSecondary }]} numberOfLines={1}>
                {label}
              </Text>
            </View>
          </GlassSurface>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pillWrap: { flex: 1 },
  pill: {
    paddingVertical: 16,
    alignItems: "center",
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
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: "center",
  },
  chipActive: {
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontWeight: "700",
    fontSize: 12,
  },
});
