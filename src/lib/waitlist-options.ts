import { BRAND } from "@/lib/brand";

/** Single-select; stored as `hear_about_us` (exact string match). */
export const HEAR_ABOUT_OPTIONS = [
  "Instagram",
  "TikTok",
  "Friend or word of mouth",
  "Google search",
  "Podcast or newsletter",
  "Retail or pop-up",
  "Other",
] as const;

/** Single-select; stored as `shoe_size` (rough range). */
export const SHOE_SIZE_OPTIONS = [
  "US 4–6",
  "US 6.5–8",
  "US 8.5–10",
  "US 10.5–12",
  "US 12+",
] as const;

/** Single-select; stored as `drop_focus`. */
export const DROP_FOCUS_OPTIONS = [
  "Standout patterns & color",
  "Quiet, everyday staples",
  "Gift-ready packaging",
  "Sustainable materials story",
  "Limited-run exclusivity",
] as const;

export type HearAboutOption = (typeof HEAR_ABOUT_OPTIONS)[number];
export type ShoeSizeOption = (typeof SHOE_SIZE_OPTIONS)[number];
export type DropFocusOption = (typeof DROP_FOCUS_OPTIONS)[number];

/** Sock style interests — multi-select pills on the waitlist form. */
export const SOCK_INTEREST_OPTIONS = [
  "Corporate",
  "Plain",
  "Sports",
  "Ankle-Length",
  "Regular-Length",
  "Casual",
] as const;

/** Favourite colour swatches — multi-select on the waitlist form. */
export const FAVOURITE_COLOUR_OPTIONS = [
  { label: "Black", hex: "#111111" },
  { label: "White", hex: "#FFFFFF" },
  { label: "Milk white", hex: "#F3EEE6" },
  { label: "Cream", hex: "#F5E6C8" },
  { label: "Gray", hex: "#9CA3AF" },
  { label: "Red", hex: "#E8170F" },
  { label: "Wine", hex: "#7F1D1D" },
  { label: "Pink", hex: "#F472B6" },
  { label: "Neon", hex: "#A3E635" },
  { label: "Orange", hex: "#F97316" },
  { label: "Yellow", hex: "#FACC15" },
  { label: "Khaki", hex: "#C4B28A" },
  { label: "Green", hex: "#22C55E" },
  { label: "Blue", hex: "#3B82F6" },
  { label: "Navy blue", hex: "#1E3A8A" },
  { label: "Purple", hex: "#8B5CF6" },
] as const;

/** Box quantity options for the waitlist dropdown. */
export const BOX_QUANTITY_OPTIONS = [
  "1 box (3 pairs)",
  "2 boxes (6 pairs)",
  "3 boxes (9 pairs)",
  "4 boxes (12 pairs)",
] as const;

/** Pipeline statuses (stored lowercase in DB). */
export const WAITLIST_STATUSES = ["waiting", "contacted", "converted", "closed"] as const;

export type SockInterestOption = (typeof SOCK_INTEREST_OPTIONS)[number];
export type FavouriteColourOption =
  (typeof FAVOURITE_COLOUR_OPTIONS)[number]["label"];
export type BoxQuantityOption = (typeof BOX_QUANTITY_OPTIONS)[number];
export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

const COLOUR_HEX_BY_LABEL: Record<string, string> = Object.fromEntries(
  FAVOURITE_COLOUR_OPTIONS.map((c) => [c.label, c.hex]),
);

/** Resolve swatch hex for a favourite-colour label. */
export function colourHex(label: string): string {
  return COLOUR_HEX_BY_LABEL[label] ?? "#9CA3AF";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Black or white text for contrast on a solid swatch background. */
export function contrastingTextOn(hex: string): "#111111" | "#FFFFFF" {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#111111";
  // Relative luminance (sRGB)
  const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return lum > 0.62 ? "#111111" : "#FFFFFF";
}

/** Soft tint of a swatch for selected pill backgrounds. */
export function colourTint(hex: string, alpha = 0.18): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(156, 163, 175, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

const STATUS_LABEL: Record<WaitlistStatus, string> = {
  waiting: "Waiting",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export function formatWaitlistStatus(status: string): string {
  const s = status.toLowerCase() as WaitlistStatus;
  return STATUS_LABEL[s] ?? status;
}

export const STATUS_STYLE: Record<
  WaitlistStatus,
  { bg: string; color: string; dot: string }
> = {
  waiting: { bg: "#FEF3C7", color: "#92400E", dot: BRAND.red },
  contacted: { bg: "#DBEAFE", color: "#1E3A8A", dot: BRAND.blue },
  converted: { bg: "#CCFBF1", color: "#134E4A", dot: BRAND.teal },
  closed: { bg: "#F3F4F6", color: "#374151", dot: BRAND.brown },
};
