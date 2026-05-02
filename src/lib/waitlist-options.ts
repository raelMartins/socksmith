import { BRAND } from "@/lib/brand";

/** “Where did you hear about us?” — stored as plain text on the signup row. */
export const HEAR_ABOUT_OPTIONS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Reddit",
  "Search / Google",
  "YouTube",
  "Podcast",
  "Newsletter",
  "Friend",
  "Retail / IRL",
  "Press / Blog",
  "X",
  "Pinterest",
  "LinkedIn",
  "Other",
] as const;

/** Sock types — filled pill multi-select. */
export const SOCK_INTEREST_OPTIONS = [
  "Classic Crew",
  "No-Show",
  "Ankle Sport",
  "Thermal Cosy",
  "Kids Range",
  "Gift Bundle",
] as const;

/** Typical size — helps first-run grading. */
export const SHOE_SIZE_OPTIONS = [
  "US Women’s 5–7",
  "US Women’s 8–10",
  "US Men’s 7–9",
  "US Men’s 10–12",
  "US Men’s 13+",
  "Mostly gifting / mixed sizes",
  "Prefer not to say",
] as const;

/** What they want from the first drop. */
export const DROP_FOCUS_OPTIONS = [
  "Everyday comfort & durability",
  "Bold color & pattern stories",
  "Natural yarns & texture",
  "Low-waste / mindful making",
  "Gift-ready packaging",
] as const;

/** Pipeline statuses (stored lowercase in DB). */
export const WAITLIST_STATUSES = ["waiting", "contacted", "converted", "closed"] as const;

export type HearAboutOption = (typeof HEAR_ABOUT_OPTIONS)[number];
export type SockInterestOption = (typeof SOCK_INTEREST_OPTIONS)[number];
export type ShoeSizeOption = (typeof SHOE_SIZE_OPTIONS)[number];
export type DropFocusOption = (typeof DROP_FOCUS_OPTIONS)[number];
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
