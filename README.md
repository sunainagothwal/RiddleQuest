# Riddle Quest 🧩

A fully offline, animated riddle game for Android, built with React Native + Expo.
No backend, no network calls, no account — everything runs and saves on the device.

## Why local data instead of an API

The brief asked for a free API with 1,000+ riddles if one exists. It doesn't, in a form
that fits this app:
- **API Ninjas' Riddles API** is the only notable free riddle API, and its free tier
  caps out at **100 riddles total** (10,000+ requires a paid plan) and has no Hindi content.
- No free, reliable API offers 1,000+ riddles in **both English and Hindi** with matching
  question/answer pairs.
- The app also needs to work **completely offline**, which rules out depending on any
  live API anyway.

So the app ships with a hand-curated local dataset (`src/data/riddles.js`) — 100 riddles,
each written in parallel English and Hindi, spanning six categories (General, Logic, Math,
Funny, Kids, Hard) and three difficulty levels. The array is easy to extend — just append
more objects in the same `{ en: {...}, hi: {...} }` shape.

## Features

- **100% offline** — all riddles are bundled in the app; `AsyncStorage` stores your score,
  streak, favorites, and language choice locally on the device. Nothing is ever sent anywhere.
- **English ⇄ Hindi toggle** — a single animated switch flips every question, hint, answer,
  and UI label instantly (see `src/context/LanguageContext.js` and `src/data/strings.js`).
- **Animations throughout** — spring-based card entrances, a shake on "not quite," a glow
  pulse on "correct," an animated toggle knob, bouncy tab icons, and animated stat counters
  (all built with React Native's core `Animated` API — no extra native animation libraries
  to link).
- **Category filters** (General / Logic / Math / Funny / Kids / Hard), a shuffled queue that
  never repeats until the whole set has been seen, then reshuffles.
- **Self-graded scoring** — riddles are graded by the player tapping "Correct" / "Not quite"
  after revealing the answer, which is far more reliable than trying to string-match answers
  to wordplay-based riddles (e.g. puns). Score, streak, best streak, and accuracy are tracked.
- **Favorites** — star any riddle to save it locally and review it later in the Favorites tab.
- **Reset progress** — a confirm-guarded button in Stats wipes local score/streak/favorites
  data if you want to start fresh.

## Project structure

```
RiddleQuest/
├── App.js                        # Root component + custom animated tab bar
├── app.json                      # Expo app config (Android package name, etc.)
├── babel.config.js
├── package.json
└── src/
    ├── data/
    │   ├── riddles.js            # The 100 bilingual riddles (local "database")
    │   └── strings.js            # All UI copy in English + Hindi
    ├── context/
    │   └── LanguageContext.js    # Language state, persisted via AsyncStorage
    ├── storage/
    │   └── storage.js            # Thin AsyncStorage wrapper (stats/favorites/language)
    ├── hooks/
    │   └── useRiddleGame.js      # Shuffling, scoring, favorites logic
    ├── components/               # Reusable animated UI pieces
    │   ├── AnimatedButton.js
    │   ├── LanguageToggle.js
    │   ├── RiddleCard.js
    │   ├── CollapsiblePanel.js
    │   └── SmallWidgets.js       # StatPill, CategoryChip
    ├── screens/
    │   ├── GameScreen.js         # Main play screen
    │   ├── FavoritesScreen.js
    │   └── StatsScreen.js
    └── theme/
        └── theme.js              # Colors used across the app
```

## Running it on Android

You'll need [Node.js](https://nodejs.org) installed. Then, from this folder:

```bash
npm install
npx expo start
```

This prints a QR code. Options to see it on Android:

1. **Quickest — Expo Go app**: install "Expo Go" from the Play Store on your phone,
   then scan the QR code from the terminal. The app loads over your local Wi-Fi
   (only for loading the JS bundle during development — once running, riddle data
   and gameplay work with your phone's Wi-Fi off too, since it's all local).
2. **Android emulator**: with Android Studio's emulator running, press `a` in the
   `expo start` terminal.
3. **Build a real installable APK** (no Expo Go needed):
   ```bash
   npm install -g eas-cli
   eas build -p android --profile preview
   ```
   This uses Expo's free build service and gives you a downloadable `.apk`/`.aab`
   you can install directly on any Android phone.

## Adding more riddles

Open `src/data/riddles.js` and add entries like:

```js
{ id: 101, category: "general", difficulty: "easy",
  en: { q: "Your English question", a: "Your English answer", hint: "Your English hint" },
  hi: { q: "आपका हिंदी सवाल",       a: "आपका हिंदी जवाब",       hint: "आपका हिंदी संकेत" } },
```

`category` must be one of: `general`, `logic`, `math`, `funny`, `kids`, `hard`.
