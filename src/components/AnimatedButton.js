import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GLASS, GRADIENTS } from "../theme/theme";
import GlassSurface from "./GlassSurface";

export default function AnimatedButton({
  onPress,
  children,
  style,
  textStyle,
  disabled,
  variant = "solid", // "solid" | "outline" | "ghost"
  size = "md", // "md" | "sm"
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

  const hasRawText = React.Children.toArray(children).some(
    (child) => typeof child === "string" || typeof child === "number"
  );

  const baseStyle = size === "sm" ? styles.baseSm : styles.base;
  const textSizeStyle = size === "sm" ? styles.textSm : styles.text;

  const content = hasRawText ? (
    <Text
      style={[
        textSizeStyle,
        variant === "solid" ? styles.solidText : styles.outlineText,
        textStyle,
      ]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
    >
      {children}
    </Text>
  ) : (
    children
  );

  if (variant === "solid") {
    return (
      <Animated.View style={[styles.solidShadow, { transform: [{ scale }], opacity: disabled ? 0.5 : 1 }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={disabled}
          android_ripple={{ color: "rgba(0,0,0,0.15)", borderless: false }}
        >
          <LinearGradient
            colors={GRADIENTS.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={baseStyle}
          >
            {content}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={disabled}>
        <GlassSurface
          radius={16}
          intensity={variant === "outline" ? 45 : 40}
          fill={variant === "outline" ? "rgba(255,182,72,0.14)" : GLASS.fillStrong}
          borderColor={variant === "outline" ? COLORS.accent : GLASS.border}
        >
          <View style={baseStyle}>{content}</View>
        </GlassSurface>
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
  baseSm: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  solidShadow: {
    borderRadius: 16,
    shadowColor: "#FF8A5B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  textSm: {
    fontSize: 13,
    fontWeight: "700",
  },
  solidText: {
    color: "#1B1035",
  },
  outlineText: {
    color: COLORS.accent,
  },
});
