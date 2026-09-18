import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLASS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

const LETTERS = ["A", "B", "C", "D"];

export default function AnswerOptions({ options, correctAnswer, selected, graded, onSelect }) {
  return (
    <View style={styles.wrap}>
      {options.map((option, index) => {
        const isCorrect = option === correctAnswer;
        const isSelected = option === selected;

        let fill = GLASS.fill;
        let borderColor = GLASS.borderSoft;
        let badgeBg = "rgba(255,255,255,0.1)";
        let textColor = COLORS.textPrimary;
        let opacity = 1;

        if (graded) {
          if (isCorrect) {
            fill = COLORS.successSoft;
            borderColor = COLORS.success;
            badgeBg = COLORS.success;
            textColor = COLORS.success;
          } else if (isSelected) {
            fill = COLORS.errorSoft;
            borderColor = COLORS.error;
            badgeBg = COLORS.error;
            textColor = COLORS.error;
          } else {
            opacity = 0.45;
          }
        }

        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            disabled={graded}
            style={({ pressed }) => [{ opacity }, pressed && !graded && styles.pressed]}
          >
            <GlassSurface radius={16} intensity={34} fill={fill} borderColor={borderColor} style={styles.surface}>
              <View style={styles.option}>
                <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.badgeText, graded && (isCorrect || isSelected) && { color: "#160B33" }]}>
                    {LETTERS[index]}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: textColor }]} numberOfLines={2}>{option}</Text>
                {graded && isCorrect && (
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                )}
                {graded && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={18} color={COLORS.error} />
                )}
              </View>
            </GlassSurface>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14, gap: 10 },
  surface: {},
  pressed: { transform: [{ scale: 0.99 }] },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
});
