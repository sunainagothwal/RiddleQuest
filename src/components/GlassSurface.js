import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { GLASS } from "../theme/theme";

// A frosted-glass panel: real blur of whatever sits behind it (the aurora
// backdrop), a translucent tint, a hairline border, and a thin light strip
// along the top edge to sell the "glass catching light" look.
export default function GlassSurface({
  children,
  style,
  radius = 24,
  radiusTop,
  radiusBottom,
  intensity = GLASS.intensity,
  tint = GLASS.tint,
  fill = GLASS.fill,
  borderColor = GLASS.border,
  noBorder = false,
  grow = false,
  ...rest
}) {
  const topRadius = radiusTop ?? radius;
  const bottomRadius = radiusBottom ?? radius;
  const cornerStyle = {
    borderTopLeftRadius: topRadius,
    borderTopRightRadius: topRadius,
    borderBottomLeftRadius: bottomRadius,
    borderBottomRightRadius: bottomRadius,
  };
  const growStyle = grow ? styles.grow : null;

  return (
    <View style={[cornerStyle, styles.shadow, growStyle, style]} {...rest}>
      <BlurView
        intensity={intensity}
        tint={tint}
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
        style={[
          styles.blur,
          cornerStyle,
          growStyle,
          {
            backgroundColor: fill,
            borderColor: noBorder ? "transparent" : borderColor,
          },
        ]}
      >
        <View pointerEvents="none" style={[styles.sheen, { borderTopLeftRadius: topRadius, borderTopRightRadius: topRadius }]} />
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  shadow: {
    shadowColor: GLASS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  blur: {
    overflow: "hidden",
    borderWidth: 1,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
});
