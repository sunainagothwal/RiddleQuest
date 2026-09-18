import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../theme/theme";
import { useLanguage } from "../context/LanguageContext";
import { Storage, DEFAULT_STATS } from "../storage/storage";
import { StatPill } from "../components/SmallWidgets";
import AnimatedButton from "../components/AnimatedButton";
import LanguageToggle from "../components/LanguageToggle";
import GlassSurface from "../components/GlassSurface";
import { RIDDLES } from "../data/riddles";

export default function StatsScreen({ focusKey }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState(DEFAULT_STATS);

  const load = useCallback(async () => {
    const s = await Storage.getStats();
    setStats(s);
  }, []);

  useEffect(() => {
    load();
  }, [load, focusKey]);

  const accuracy =
    stats.attemptCount === 0 ? 0 : Math.round((stats.correctCount / stats.attemptCount) * 100);

  const handleReset = () => {
    Alert.alert(t.resetProgress, t.resetConfirm, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.reset,
        style: "destructive",
        onPress: async () => {
          await Storage.resetAll();
          load();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.stats}</Text>
        <LanguageToggle />
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <StatPill label={t.score} value={stats.score} color={COLORS.accent} />
          <StatPill label={t.bestStreak} value={stats.bestStreak} color={COLORS.success} />
        </View>
        <View style={styles.row}>
          <StatPill label={t.solved} value={stats.correctCount} color={COLORS.difficultyColors.medium} />
          <StatPill label={t.accuracy} value={`${accuracy}%`} color={COLORS.difficultyColors.easy} />
        </View>
      </View>

      <GlassSurface radius={16} intensity={32}>
        <View style={styles.infoCard}>
          <Ionicons name="library-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {RIDDLES.length} {t.totalRiddles}
          </Text>
        </View>
      </GlassSurface>

      <View style={{ flex: 1 }} />

      <AnimatedButton variant="outline" style={styles.resetBtn} onPress={handleReset}>
        {t.resetProgress}
      </AnimatedButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent", paddingHorizontal: SPACING.screenH },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 20,
  },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: "800" },
  grid: { marginBottom: 20, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoText: { color: COLORS.textSecondary, marginLeft: 10, fontSize: 14 },
  resetBtn: { marginBottom: 20 },
});
