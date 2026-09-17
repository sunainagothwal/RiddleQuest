import { useCallback, useEffect, useRef, useState } from "react";
import { RIDDLES } from "../data/riddles";
import { Storage, DEFAULT_STATS } from "../storage/storage";
import { shuffle } from "../utils/shuffle";

export function useRiddleGame(activeDifficulty) {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [favorites, setFavorites] = useState([]);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const difficultyRef = useRef(activeDifficulty);

  useEffect(() => {
    (async () => {
      const [savedStats, savedFavorites] = await Promise.all([
        Storage.getStats(),
        Storage.getFavorites(),
      ]);
      setStats(savedStats);
      setFavorites(savedFavorites);
      setLoaded(true);
    })();
  }, []);

  const buildQueue = useCallback((difficulty) => {
    const pool =
      difficulty === "all" ? RIDDLES : RIDDLES.filter((r) => r.difficulty === difficulty);
    return shuffle(pool);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    difficultyRef.current = activeDifficulty;
    const q = buildQueue(activeDifficulty);
    setQueue(q.slice(1));
    setCurrent(q[0] || null);
    setJustReset(false);
  }, [activeDifficulty, loaded]);

  const nextRiddle = useCallback(() => {
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        const fresh = buildQueue(difficultyRef.current);
        setJustReset(true);
        setCurrent(fresh[0] || null);
        return fresh.slice(1);
      }
      setJustReset(false);
      setCurrent(prevQueue[0]);
      return prevQueue.slice(1);
    });
  }, [buildQueue]);

  const recordAttempt = useCallback((wasCorrect) => {
    setStats((prev) => {
      const nextStreak = wasCorrect ? prev.streak + 1 : 0;
      const next = {
        score: prev.score + (wasCorrect ? 10 : 0),
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        correctCount: prev.correctCount + (wasCorrect ? 1 : 0),
        attemptCount: prev.attemptCount + 1,
      };
      Storage.setStats(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      Storage.setFavorites(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(async () => {
    await Storage.resetAll();
    setStats(DEFAULT_STATS);
    setFavorites([]);
  }, []);

  return {
    loaded,
    stats,
    favorites,
    current,
    nextRiddle,
    recordAttempt,
    toggleFavorite,
    resetProgress,
    justReset,
  };
}
