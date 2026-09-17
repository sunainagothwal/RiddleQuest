import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/theme";

export default function AnimatedButton({
  onPress,
  children,
  style,
  textStyle,
  disabled,
  variant = "solid", // "solid" | "outline" | "ghost"
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  };

  const variantStyle =
    variant === "outline"
      ? styles.outline
      : variant === "ghost"
      ? styles.ghost
      : styles.solid;

  const variantTextStyle =
    variant === "outline" || variant === "ghost" ? styles.outlineText : styles.solidText;

  const hasRawText = React.Children.toArray(children).some(
    (child) => typeof child === "string" || typeof child === "number"
  );

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={[styles.base, variantStyle, style]}
        android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: false }}
      >
        {hasRawText ? (
          <Text style={[styles.text, variantTextStyle, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  solid: {
    backgroundColor: COLORS.accent,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  solidText: {
    color: "#1B1035",
  },
  outlineText: {
    color: COLORS.accent,
  },
});
