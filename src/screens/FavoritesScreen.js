import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";
import { useLanguage } from "../context/LanguageContext";
import { Storage } from "../storage/storage";
import { RIDDLES } from "../data/riddles";
import LanguageToggle from "../components/LanguageToggle";

export default function FavoritesScreen({ focusKey }) {
  const { t, lang } = useLanguage();
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    const ids = await Storage.getFavorites();
    setFavorites(ids);
  }, []);

  useEffect(() => {
    load();
  }, [load, focusKey]);

  const removeFavorite = async (id) => {
    const next = favorites.filter((x) => x !== id);
    setFavorites(next);
    await Storage.setFavorites(next);
  };

  const items = RIDDLES.filter((r) => favorites.includes(r.id));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.favorites}</Text>
        <LanguageToggle />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="star-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>{t.noFavorites}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isOpen = expandedId === item.id;
            const text = item[lang];
            const color = COLORS.difficultyColors[item.difficulty];
            return (
              <Pressable
                style={[styles.card, { borderColor: color + "44" }]}
                onPress={() => setExpandedId(isOpen ? null : item.id)}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.question}>{text.q}</Text>
                  <Pressable onPress={() => removeFavorite(item.id)} hitSlop={10}>
                    <Ionicons name="star" size={20} color={COLORS.accent} />
                  </Pressable>
                </View>
                {isOpen && <Text style={styles.answer}>{text.a}</Text>}
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgBottom },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: "800" },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyText: { color: COLORS.textMuted, textAlign: "center", marginTop: 12, fontSize: 14 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  question: { color: COLORS.textPrimary, fontSize: 15, fontWeight: "600", flex: 1, marginRight: 10 },
  answer: { color: COLORS.success, marginTop: 10, fontSize: 14, fontWeight: "600" },
});
