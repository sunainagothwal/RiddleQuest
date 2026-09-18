export const COLORS = {
  bgTop: "#2A1858",
  bgBottom: "#150A2E",
  card: "#241246",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#FFB648",
  accentSoft: "rgba(255,182,72,0.15)",
  success: "#4ADE80",
  successSoft: "rgba(74,222,128,0.15)",
  error: "#FB7185",
  errorSoft: "rgba(251,113,133,0.15)",
  textPrimary: "#F8F5FF",
  textSecondary: "#B9AEDA",
  textMuted: "#7C71A0",
  white: "#FFFFFF",
  difficultyColors: {
    easy: "#4ADE80",
    medium: "#FBBF24",
    hard: "#F87171",
  },
};

// Backdrop the frosted glass sits on top of, kept deliberately calm and
// dark: a mostly-flat near-black wash with only a faint whisper of the
// violet-to-amber mood, rather than bright glows. Foreground elements
// (buttons, icons, text) need reliable contrast wherever they land on
// screen, not just in spots we've individually patched — so the backdrop
// itself stays quiet and consistent everywhere instead of being locally
// bright in some places and dark in others.
export const AURORA = {
  base: "#09051A",
  wash: ["#160E32", "#0F0924", "#09051A"],
  orbs: [
    { color: "rgba(90, 60, 160, 0.28)", leftPct: -0.3, topPct: -0.2, sizePct: 1.15, driftX: 20, driftY: 14 },
    { color: "rgba(120, 70, 150, 0.2)", leftPct: 0.4, topPct: 0.05, sizePct: 0.85, driftX: -16, driftY: 18 },
    { color: "rgba(150, 80, 120, 0.14)", leftPct: 0.15, topPct: 0.32, sizePct: 0.9, driftX: 14, driftY: -12 },
    { color: "rgba(200, 130, 70, 0.1)", leftPct: 0.68, topPct: 0.5, sizePct: 0.8, driftX: -16, driftY: -14 },
  ],
};

// Fraction of screen height, from the bottom, that fades toward a plain
// dark scrim so buttons and the tab bar always sit on a controlled,
// readable base no matter where the nebula glows land.
export const AURORA_SCRIM_HEIGHT_PCT = 0.4;

// Shared glassmorphism tokens: translucent fills, hairline borders that
// catch a highlight on top, and a soft ambient shadow to lift cards off
// the aurora backdrop.
export const GLASS = {
  tint: "dark",
  intensity: 42,
  fill: "rgba(255,255,255,0.08)",
  fillStrong: "rgba(255,255,255,0.14)",
  border: "rgba(255,255,255,0.22)",
  borderSoft: "rgba(255,255,255,0.12)",
  highlight: "rgba(255,255,255,0.35)",
  shadow: "#0A0420",
};

export const GRADIENTS = {
  accent: ["#FFD27A", "#FF8A5B"],
  success: ["#7CF5B0", "#3AC97D"],
  error: ["#FF9A9E", "#F4436C"],
  header: ["rgba(124,58,237,0.35)", "rgba(255,111,165,0.12)"],
};

export const FONT = {
  hi: undefined, // system font renders Devanagari fine on Android by default
};

// One horizontal side-margin used by every screen, so content lines up
// consistently instead of each screen inventing its own number.
export const SPACING = {
  screenH: 18,
};
