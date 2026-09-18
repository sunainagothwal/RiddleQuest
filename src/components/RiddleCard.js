import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLASS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

// This card grows to fill whatever vertical space is left above the
// answer options (see GameScreen's questionArea), with the question text
// centered inside it — so there is no leftover "dead" gap on screen, just
// a bigger, more prominent riddle panel. The badge/star row stays pinned
// to the top of that same space.
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
    outputRange: [GLASS.border, COLORS.success],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    >
      <GlassSurface radius={24} intensity={46} noBorder grow>
        <Animated.View style={[styles.card, { borderColor }]}>
          <View style={styles.questionWrap}>
            <Text style={styles.question} numberOfLines={4}>{question}</Text>
          </View>

          <View style={styles.topRow} pointerEvents="box-none">
            <View style={[styles.badge, { backgroundColor: difficultyColor + "33", borderColor: difficultyColor }]}>
              <Text style={[styles.badgeText, { color: difficultyColor }]}>{difficultyLabel}</Text>
            </View>
            <Pressable onPress={onToggleFavorite} hitSlop={10} style={styles.favBtn}>
              <Ionicons
                name={isFavorite ? "star" : "star-outline"}
                size={18}
                color={isFavorite ? COLORS.accent : COLORS.textPrimary}
              />
            </Pressable>
          </View>
        </Animated.View>
      </GlassSurface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 22,
    borderWidth: 1.5,
    borderRadius: 24,
  },
  // Absolutely positioned so it floats over the card instead of taking up
  // flow space — otherwise the question text below only centers in the
  // leftover space under this row, not the full card, which reads as
  // asymmetric (more gap above the text than below it).
  topRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionWrap: {
    flex: 1,
    justifyContent: "center",
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
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(4,2,12,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  question: {
    fontSize: 21,
    lineHeight: 29,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});
