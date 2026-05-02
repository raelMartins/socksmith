import { BRAND } from "@/lib/brand";

/** “Where did you hear about us?” — outline pill selection (single). */
export const HEAR_ABOUT_OPTIONS = [
  "Instagram Ad",
  "Facebook Ad",
  "TikTok Ad",
  "Story Ad",
  "Referral",
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

/** Pipeline statuses (stored lowercase in DB). */
export const WAITLIST_STATUSES = ["waiting", "contacted", "converted", "closed"] as const;

export type HearAboutOption = (typeof HEAR_ABOUT_OPTIONS)[number];
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
