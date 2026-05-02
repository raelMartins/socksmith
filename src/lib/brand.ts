/** Socksmith palette — use in `sx` / theme `colors.socksmith.*` / `brand.*` scale. */
export const BRAND = {
  red: "#E8170F",
  redLight: "#FADADD",
  cream: "#F5EFE6",
  brown: "#5C3A1E",
  pink: "#F472B6",
  pinkDark: "#EC4899",
  blue: "#1A56DB",
  teal: "#0F4C75",
  white: "#FFFFFF",
  black: "#111111",
  blush: "#F9D0D3",
} as const;

export type BrandKey = keyof typeof BRAND;
