import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LanguageProvider, useLanguage } from "./src/context/LanguageContext";
import { COLORS } from "./src/theme/theme";
import GameScreen from "./src/screens/GameScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import StatsScreen from "./src/screens/StatsScreen";

const TABS = [
  { key: "play", icon: "help-buoy-outline", activeIcon: "help-buoy" },
  { key: "favorites", icon: "star-outline", activeIcon: "star" },
  { key: "stats", icon: "stats-chart-outline", activeIcon: "stats-chart" },
];

function TabBar({ active, onChange }) {
  const { t } = useLanguage();
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return <TabButton key={tab.key} tab={tab} isActive={isActive} label={t[tab.key]} onPress={() => onChange(tab.key)} />;
      })}
    </View>
  );
}

function TabButton({ tab, isActive, label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable style={styles.tabButton} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={24}
          color={isActive ? COLORS.accent : COLORS.textMuted}
        />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: isActive ? COLORS.accent : COLORS.textMuted }]}>
        {label}
      </Text>
      {isActive && <View style={styles.activeDot} />}
    </Pressable>
  );
}

function RootNavigator() {
  const [active, setActive] = useState("play");
  const [focusKey, setFocusKey] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const handleChange = (key) => {
    if (key === active) return;
    Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setActive(key);
      setFocusKey((k) => k + 1);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={styles.flex}>
      <Animated.View style={[styles.flex, { opacity: fade }]}>
        {active === "play" && <GameScreen />}
        {active === "favorites" && <FavoritesScreen focusKey={focusKey} />}
        {active === "stats" && <StatsScreen focusKey={focusKey} />}
      </Animated.View>
      <TabBar active={active} onChange={handleChange} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <View style={styles.flex}>
          <StatusBar style="light" />
          <RootNavigator />
        </View>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bgBottom },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 10,
    paddingBottom: 18,
  },
  tabButton: { flex: 1, alignItems: "center" },
  tabLabel: { fontSize: 11, marginTop: 3, fontWeight: "700" },
  activeDot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
});
