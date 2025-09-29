// zentrale Farbpalette + kleine Helpers
export const badgeColors = {
  positive: "#0cb13b",
  warning: "#e5b300",
  negative: "#ea3c3c",
  info: "#2396F3",
  brand: "#00B3A6"
};

export type BadgeColorKey = keyof typeof badgeColors;

export function getBadgeColor(key: BadgeColorKey) {
  return badgeColors[key] ?? badgeColors.info;
}

// default auch anbieten, falls jemand default import nutzt
export default badgeColors;
