export const FONT = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

export const C = {
  bg: "#0A0E1A",
  surface: "#111827",
  card: "#161D2E",
  border: "#1E2A40",
  borderLight: "#243044",
  accent: "#3B82F6",
  accentGlow: "#60A5FA",
  teal: "#14B8A6",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#10B981",
  purple: "#8B5CF6",
  text: "#F1F5F9",
  textMuted: "#64748B",
  textSub: "#94A3B8",
};

export const STATUS_CONFIG = {
  lost: { color: C.red, bg: "#1A0A0A", label: "Lost", icon: "🔴" },
  found: { color: C.green, bg: "#0A1A10", label: "Found", icon: "🟢" },
  claimed: { color: C.amber, bg: "#1A140A", label: "Claimed", icon: "🟡" },
};
