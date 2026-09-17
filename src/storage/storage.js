import AsyncStorage from "@react-native-async-storage/async-storage";

// All app data lives only on-device. Nothing here ever touches a network.
const KEYS = {
  LANGUAGE: "@riddlequest/language",
  STATS: "@riddlequest/stats",
  FAVORITES: "@riddlequest/favorites",
  SOLVED_IDS: "@riddlequest/solvedIds",
};

export const DEFAULT_STATS = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  attemptCount: 0,
};

async function safeGet(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

async function safeSet(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Storage can fail on very low-end devices; fail silently rather than crash.
  }
}

export const Storage = {
  getLanguage: () => safeGet(KEYS.LANGUAGE, "en"),
  setLanguage: (lang) => safeSet(KEYS.LANGUAGE, lang),

  getStats: () => safeGet(KEYS.STATS, DEFAULT_STATS),
  setStats: (stats) => safeSet(KEYS.STATS, stats),

  getFavorites: () => safeGet(KEYS.FAVORITES, []),
  setFavorites: (ids) => safeSet(KEYS.FAVORITES, ids),

  getSolvedIds: () => safeGet(KEYS.SOLVED_IDS, []),
  setSolvedIds: (ids) => safeSet(KEYS.SOLVED_IDS, ids),

  resetAll: async () => {
    await AsyncStorage.multiRemove([
      KEYS.STATS,
      KEYS.FAVORITES,
      KEYS.SOLVED_IDS,
    ]);
  },
};
