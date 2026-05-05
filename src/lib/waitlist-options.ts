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

/** Sock interests — multi-select on waitlist; stored as text[] on the row. */
export const SOCK_INTEREST_OPTIONS = [
  "Corporate",
  "Kid range",
  "Sports",
  "Gift bundle",
  "Ankle sport",
  "No-show",
] as const;

/** Pipeline statuses (stored lowercase in DB). */
export const WAITLIST_STATUSES = ["waiting", "contacted", "converted", "closed"] as const;

export type SockInterestOption = (typeof SOCK_INTEREST_OPTIONS)[number];
export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

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
