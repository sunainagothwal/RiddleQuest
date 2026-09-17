import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";

export default function RiddleCard({
  question,
  difficultyLabel,
  difficultyColor,
  isFavorite,
  onToggleFavorite,
  cardKey,
  feedback, // null | "correct" | "wrong"
}) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entrance.stopAnimation();
    entrance.setValue(0);
    Animated.spring(entrance, {
      toValue: 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 9,
    }).start();
  }, [cardKey]);

  useEffect(() => {
    if (feedback === "wrong") {
      shake.stopAnimation();
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    } else if (feedback === "correct") {
      glow.stopAnimation();
      glow.setValue(0);
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 180, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start();
    }
  }, [feedback]);

  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const opacity = entrance;
  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });
  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.cardBorder, COLORS.success],
  });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    >
      <Animated.View style={[styles.card, { borderColor }]}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: difficultyColor + "22", borderColor: difficultyColor }]}>
            <Text style={[styles.badgeText, { color: difficultyColor }]}>{difficultyLabel}</Text>
          </View>
          <Pressable onPress={onToggleFavorite} hitSlop={10}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? COLORS.accent : COLORS.textMuted}
            />
          </Pressable>
        </View>
        <Text style={styles.question}>{question}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  question: {
    fontSize: 21,
    lineHeight: 30,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});
