const readCssVar = (name, fallback) => {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value || value.startsWith("var(")) return fallback;
  return value;
};

/** Resolve theme tokens to concrete colors for SVG / Recharts. */
export const getChartThemeColors = () => ({
  primary: readCssVar("--nutri-primary", "#F472B6"),
  primaryLight: readCssVar("--nutri-primary-light", "#F9A8D4"),
  success: readCssVar("--nutri-success", "#059669"),
  successLight: "#86efac",
  textGray: readCssVar("--nutri-text-muted", "#64748B"),
  grid: readCssVar("--nutri-border", "#CBD5E1"),
});

export const buildWeightChartData = (historyData, currentWeight) => {
  const weight = Number(currentWeight);
  const safeWeight = Number.isFinite(weight) ? weight : 0;

  const parsedHistory = [...historyData]
    .reverse()
    .map((entry) => ({
      date: String(entry.date || "").split(" ")[0] || "-",
      weight: parseFloat(String(entry.weight).replace(/[^\d.]/g, "")),
    }))
    .filter((entry) => Number.isFinite(entry.weight));

  const todayLabel = new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  const lastPoint = parsedHistory[parsedHistory.length - 1];
  const mergedHistory =
    lastPoint?.date === todayLabel.split(" ")[0] && lastPoint?.weight === safeWeight
      ? parsedHistory
      : [...parsedHistory, { date: todayLabel, weight: safeWeight }];

  if (mergedHistory.length >= 2) {
    return { data: mergedHistory.slice(-7), isFallback: false };
  }

  const today = new Date();
  const data = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    return {
      date: day.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
      weight: index === 6 ? safeWeight : null,
    };
  });

  return { data, isFallback: true };
};
