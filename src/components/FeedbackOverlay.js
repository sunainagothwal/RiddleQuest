import React from "react";
import { Animated, Modal, Platform, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";
import GlassSurface from "./GlassSurface";
import AnimatedButton from "./AnimatedButton";

// A big, unmissable center-screen popup for the correct/wrong verdict.
// Rendered inside a transparent RN `Modal` rather than as an absolutely
// positioned sibling: a Modal opens its own native overlay window above
// literally everything else on both platforms, so it can't lose a
// stacking fight with elevated glass panels the way a plain View can.
//
// Since the modal blocks the screen behind it (including the game's own
// "Next Riddle" button), it carries its own continue button and never
// auto-dismisses on a timer — the riddle only advances when the user
// taps it.
export default function FeedbackOverlay({ visible, feedback, label, buttonLabel, anim, onContinue }) {
  const isCorrect = feedback === "correct";
  const color = isCorrect ? COLORS.success : COLORS.error;

  const scale = anim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.6, 1.08, 1],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onContinue}
    >
      <View style={styles.overlay}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: anim }]}>
          <BlurView
            intensity={70}
            tint="dark"
            experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
          <GlassSurface radius={28} intensity={60} fill={color + "26"} borderColor={color}>
            <View style={styles.card}>
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={56}
                color={color}
              />
              <Text style={[styles.text, { color }]}>{label}</Text>
              <AnimatedButton style={styles.continueBtn} onPress={onContinue}>
                {buttonLabel} →
              </AnimatedButton>
            </View>
          </GlassSurface>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 10,
    minWidth: 240,
  },
  text: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  continueBtn: {
    marginTop: 10,
    alignSelf: "stretch",
  },
});
