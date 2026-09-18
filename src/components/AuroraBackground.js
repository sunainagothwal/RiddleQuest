import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { AURORA, AURORA_SCRIM_HEIGHT_PCT } from "../theme/theme";

function Orb({ color, left, top, size, duration, delay, driftX, driftY }) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift, duration, delay]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateX }, { translateY }],
      }}
    />
  );
}

// A moody nebula backdrop: a diagonal color wash plus a few translucent
// circles that a full-screen BlurView (right above them, below the app UI)
// turns into soft, Gaussian-blurred glows — the same real-blur technique
// used by the glass panels. A dark scrim at the bottom keeps the button
// controls and tab bar readable regardless of where the glows land.
export default function AuroraBackground({ children }) {
  const { width, height } = useWindowDimensions();
  const span = Math.max(width, height);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: AURORA.base, overflow: "hidden" }]}>
      <LinearGradient
        colors={AURORA.wash}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill}>
        {AURORA.orbs.map((orb, i) => (
          <Orb
            key={i}
            color={orb.color}
            left={width * orb.leftPct}
            top={height * orb.topPct}
            size={span * orb.sizePct}
            duration={8000 + i * 1500}
            delay={i * 280}
            driftX={orb.driftX}
            driftY={orb.driftY}
          />
        ))}
      </View>

      <BlurView
        intensity={70}
        tint="default"
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={["transparent", "rgba(6,3,16,0.7)"]}
        style={[styles.scrim, { height: height * AURORA_SCRIM_HEIGHT_PCT }]}
        pointerEvents="none"
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
