export const PRIORITIES = ["high", "medium", "low"];

export const PRIORITY_COLORS = {
  high: { bg: "rgba(239,68,68,0.15)", text: "#f87171", border: "#ef4444" },
  medium: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "#f59e0b" },
  low: { bg: "rgba(16,185,129,0.15)", text: "#34d399", border: "#10b981" },
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const POMODORO_PRESETS = [
  { label: "Classic", work: 25, short: 5, long: 15 },
  { label: "Long Focus", work: 50, short: 10, long: 20 },
  { label: "Short Burst", work: 15, short: 3, long: 10 },
];