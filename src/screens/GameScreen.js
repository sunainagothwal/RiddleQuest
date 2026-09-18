import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { COLORS, SPACING } from "../theme/theme";
import { useLanguage } from "../context/LanguageContext";
import { useRiddleGame } from "../hooks/useRiddleGame";
import { RIDDLES } from "../data/riddles";
import { shuffle } from "../utils/shuffle";
import RiddleCard from "../components/RiddleCard";
import AnswerOptions from "../components/AnswerOptions";
import CollapsiblePanel from "../components/CollapsiblePanel";
import AnimatedButton from "../components/AnimatedButton";
import LanguageToggle from "../components/LanguageToggle";
import GlassSurface from "../components/GlassSurface";
import FeedbackOverlay from "../components/FeedbackOverlay";
import { CategoryChip, StatBadge } from "../components/SmallWidgets";

const CORRECT_SOUND = require("../../assets/sounds/correct.wav");
const WRONG_SOUND = require("../../assets/sounds/wrong.wav");

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
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [graded, setGraded] = useState(false);
  const [selected, setSelected] = useState(null);
  const toastAnim = React.useRef(new Animated.Value(0)).current;

  const correctPlayer = useAudioPlayer(CORRECT_SOUND);
  const wrongPlayer = useAudioPlayer(WRONG_SOUND);

  const options = useMemo(() => buildOptions(current, lang), [current, lang]);

  const handleDifficultyChange = (level) => {
    setActiveDifficulty(level);
    setShowHint(false);
    setGraded(false);
    setFeedback(null);
    setSelected(null);
    setOverlayVisible(false);
  };

  const handleHint = () => setShowHint((v) => !v);

  // Shows the verdict popup and leaves it up — it never dismisses itself
  // on a timer. The riddle only advances when the user taps the button
  // inside the popup (see handleContinueFeedback).
  const flashFeedback = useCallback(() => {
    toastAnim.stopAnimation();
    toastAnim.setValue(0);
    setOverlayVisible(true);
    Animated.spring(toastAnim, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 10 }).start();
  }, [toastAnim]);

  const playFeedbackSound = useCallback(
    async (wasCorrect) => {
      const player = wasCorrect ? correctPlayer : wrongPlayer;
      try {
        await player.seekTo(0);
        player.play();
      } catch (e) {
        // Sound is a nice-to-have; never let a playback hiccup break grading.
      }
    },
    [correctPlayer, wrongPlayer]
  );

  const handleGrade = (wasCorrect) => {
    if (graded) return;
    setGraded(true);
    setFeedback(wasCorrect ? "correct" : "wrong");
    recordAttempt(wasCorrect);
    flashFeedback();
    playFeedbackSound(wasCorrect);
  };

  const handleNext = () => {
    setShowHint(false);
    setGraded(false);
    setFeedback(null);
    setSelected(null);
    setOverlayVisible(false);
    nextRiddle();
  };

  // Tapping the button inside the popup: play a quick fade-out, then
  // dismiss the popup and advance to the next riddle together.
  const handleContinueFeedback = () => {
    Animated.timing(toastAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start(
      ({ finished }) => {
        if (finished) handleNext();
      }
    );
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

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.appName}>{t.appName}</Text>
        <View style={styles.headerRight}>
          <StatBadge icon="trophy" value={stats.score} color={COLORS.accent} />
          <StatBadge icon="flame" value={stats.streak} color={COLORS.success} />
          <LanguageToggle />
        </View>
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

      <View style={styles.body}>
        <View style={styles.questionArea}>
          {justReset && <Text style={styles.resetNotice}>{t.outOfIdeas}</Text>}

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
        </View>

        <View style={styles.controls}>
          <CollapsiblePanel
            visible={showHint}
            icon="💡"
            label={t.showHint}
            text={riddleText.hint}
            tint={COLORS.accent}
          />

          <GlassSurface
            radius={20}
            intensity={55}
            fill="rgba(6,3,16,0.6)"
            borderColor="rgba(255,255,255,0.14)"
          >
            <View style={styles.shelf}>
              <View style={styles.actionRow}>
                <AnimatedButton size="sm" variant="ghost" style={styles.flexBtn} onPress={handleHint}>
                  {showHint ? t.hideHint : t.showHint}
                </AnimatedButton>
                {!graded && (
                  <AnimatedButton size="sm" variant="outline" style={styles.flexBtn} onPress={handleGiveUp}>
                    {t.revealAnswer}
                  </AnimatedButton>
                )}
              </View>
            </View>
          </GlassSurface>
        </View>
      </View>

      <FeedbackOverlay
        visible={overlayVisible}
        feedback={feedback}
        label={feedback === "correct" ? `+10 · ${t.correct}` : t.tryAgain}
        buttonLabel={t.nextRiddle}
        anim={toastAnim}
        onContinue={handleContinueFeedback}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  loadingText: { color: COLORS.textSecondary, textAlign: "center", marginTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.screenH,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  appName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: "800" },
  chipRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.screenH,
    marginBottom: 8,
    gap: 6,
  },
  chipFlex: { flex: 1 },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.screenH,
    paddingTop: 10,
    paddingBottom: 10,
  },
  questionArea: { flex: 1 },
  controls: { position: "relative", marginTop: 12 },
  shelf: { padding: 14 },
  resetNotice: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 6,
  },
  actionRow: { flexDirection: "row", gap: 10 },
  flexBtn: { flex: 1 },
});
