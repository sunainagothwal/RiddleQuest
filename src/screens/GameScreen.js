import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../theme/theme";
import { useLanguage } from "../context/LanguageContext";
import { useRiddleGame } from "../hooks/useRiddleGame";
import { RIDDLES } from "../data/riddles";
import { shuffle } from "../utils/shuffle";
import RiddleCard from "../components/RiddleCard";
import AnswerOptions from "../components/AnswerOptions";
import CollapsiblePanel from "../components/CollapsiblePanel";
import AnimatedButton from "../components/AnimatedButton";
import LanguageToggle from "../components/LanguageToggle";
import { CategoryChip, StatPill } from "../components/SmallWidgets";

const DIFFICULTIES = ["easy", "medium", "hard"];
const OPTION_COUNT = 4;

function buildOptions(current, lang) {
  if (!current) return [];
  const correct = current[lang].a;
  const pool = RIDDLES.filter((r) => r.id !== current.id)
    .map((r) => r[lang].a)
    .filter((a, index, arr) => a !== correct && arr.indexOf(a) === index);
  const distractors = shuffle(pool).slice(0, OPTION_COUNT - 1);
  return shuffle([correct, ...distractors]);
}

export default function GameScreen() {
  const { t, lang } = useLanguage();
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const {
    loaded,
    stats,
    favorites,
    current,
    nextRiddle,
    recordAttempt,
    toggleFavorite,
    justReset,
  } = useRiddleGame(activeDifficulty);

  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [graded, setGraded] = useState(false);
  const [selected, setSelected] = useState(null);
  const toastAnim = React.useRef(new Animated.Value(0)).current;

  const options = useMemo(() => buildOptions(current, lang), [current, lang]);

  const handleDifficultyChange = (level) => {
    setActiveDifficulty(level);
    setShowHint(false);
    setGraded(false);
    setFeedback(null);
    setSelected(null);
  };

  const handleHint = () => setShowHint((v) => !v);

  const flashToast = useCallback(() => {
    toastAnim.stopAnimation();
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [toastAnim]);

  const handleGrade = (wasCorrect) => {
    if (graded) return;
    setGraded(true);
    setFeedback(wasCorrect ? "correct" : "wrong");
    recordAttempt(wasCorrect);
    flashToast();
  };

  const handleNext = () => {
    setShowHint(false);
    setGraded(false);
    setFeedback(null);
    setSelected(null);
    nextRiddle();
  };

  const handleSelectOption = (option) => {
    if (graded) return;
    setSelected(option);
    handleGrade(option === current[lang].a);
  };

  const handleGiveUp = () => {
    if (graded) return;
    setSelected(null);
    handleGrade(false);
  };

  if (!loaded || !current) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>...</Text>
      </SafeAreaView>
    );
  }

  const riddleText = current[lang];
  const difficultyColor = COLORS.difficultyColors[current.difficulty] || COLORS.accent;
  const isFav = favorites.includes(current.id);

  const toastTranslate = toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>
        <LanguageToggle />
      </View>

      <View style={styles.statsRow}>
        <StatPill label={t.score} value={stats.score} color={COLORS.accent} />
        <View style={{ width: 10 }} />
        <StatPill label={t.streak} value={stats.streak} color={COLORS.success} />
      </View>

      <View style={styles.chipRow}>
        <CategoryChip
          label={t.all}
          active={activeDifficulty === "all"}
          color={COLORS.accent}
          onPress={() => handleDifficultyChange("all")}
          style={styles.chipFlex}
        />
        {DIFFICULTIES.map((level) => (
          <CategoryChip
            key={level}
            label={t[level]}
            active={activeDifficulty === level}
            color={COLORS.difficultyColors[level]}
            onPress={() => handleDifficultyChange(level)}
            style={styles.chipFlex}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {justReset && (
          <Text style={styles.resetNotice}>{t.outOfIdeas}</Text>
        )}

        <RiddleCard
          cardKey={current.id}
          question={riddleText.q}
          difficultyLabel={t[current.difficulty]}
          difficultyColor={difficultyColor}
          isFavorite={isFav}
          onToggleFavorite={() => toggleFavorite(current.id)}
          feedback={feedback}
        />

        <AnswerOptions
          options={options}
          correctAnswer={riddleText.a}
          selected={selected}
          graded={graded}
          onSelect={handleSelectOption}
        />

        <CollapsiblePanel
          visible={showHint}
          icon="💡"
          label={t.showHint}
          text={riddleText.hint}
          tint={COLORS.accent}
        />

        <View style={[styles.actionRow, { marginTop: 12 }]}>
          <AnimatedButton variant="ghost" style={styles.flexBtn} onPress={handleHint}>
            {showHint ? t.hideHint : t.showHint}
          </AnimatedButton>
          {!graded && (
            <>
              <View style={{ width: 10 }} />
              <AnimatedButton variant="outline" style={styles.flexBtn} onPress={handleGiveUp}>
                {t.revealAnswer}
              </AnimatedButton>
            </>
          )}
        </View>

        <AnimatedButton style={styles.nextBtn} onPress={handleNext}>
          {t.nextRiddle} →
        </AnimatedButton>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [{ translateY: toastTranslate }],
            backgroundColor: feedback === "correct" ? COLORS.success : COLORS.error,
          },
        ]}
      >
        <Text style={styles.toastText}>
          {feedback === "correct" ? `+10 · ${t.correct}` : t.tryAgain}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgBottom },
  loadingText: { color: COLORS.textSecondary, textAlign: "center", marginTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appName: { color: COLORS.textPrimary, fontSize: 24, fontWeight: "800" },
  tagline: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2, maxWidth: 220 },
  statsRow: { flexDirection: "row", paddingHorizontal: 20, marginTop: 8, marginBottom: 12 },
  chipRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  chipFlex: { flex: 1 },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  resetNotice: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  actionRow: { flexDirection: "row", marginTop: 16 },
  flexBtn: { flex: 1 },
  nextBtn: { marginTop: 20 },
  toast: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: { color: "#160B33", fontWeight: "800" },
});
