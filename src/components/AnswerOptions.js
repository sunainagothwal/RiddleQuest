import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";

const LETTERS = ["A", "B", "C", "D"];

export default function AnswerOptions({ options, correctAnswer, selected, graded, onSelect }) {
  return (
    <View style={styles.wrap}>
      {options.map((option, index) => {
        const isCorrect = option === correctAnswer;
        const isSelected = option === selected;

        let cardStyle = styles.optionDefault;
        let badgeStyle = styles.badgeDefault;
        let textColor = COLORS.textPrimary;

        if (graded) {
          if (isCorrect) {
            cardStyle = styles.optionCorrect;
            badgeStyle = styles.badgeCorrect;
            textColor = COLORS.success;
          } else if (isSelected) {
            cardStyle = styles.optionWrong;
            badgeStyle = styles.badgeWrong;
            textColor = COLORS.error;
          } else {
            cardStyle = styles.optionMuted;
            textColor = COLORS.textMuted;
          }
        }

        return (
          <Pressable
            key={option}
            style={({ pressed }) => [
              styles.option,
              cardStyle,
              pressed && !graded && styles.optionPressed,
            ]}
            onPress={() => onSelect(option)}
            disabled={graded}
          >
            <View style={[styles.badge, badgeStyle]}>
              <Text style={[styles.badgeText, graded && (isCorrect || isSelected) && { color: "#160B33" }]}>
                {LETTERS[index]}
              </Text>
            </View>
            <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
            {graded && isCorrect && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            )}
            {graded && isSelected && !isCorrect && (
              <Ionicons name="close-circle" size={20} color={COLORS.error} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionDefault: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
  },
  optionPressed: {
    borderColor: COLORS.accent,
  },
  optionCorrect: {
    backgroundColor: COLORS.successSoft,
    borderColor: COLORS.success,
  },
  optionWrong: {
    backgroundColor: COLORS.errorSoft,
    borderColor: COLORS.error,
  },
  optionMuted: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
    opacity: 0.5,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeDefault: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  badgeCorrect: {
    backgroundColor: COLORS.success,
  },
  badgeWrong: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
});
