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
  waiting: { bg: "yellow.100", color: "yellow.900", dot: "#D97706" },
  contacted: { bg: "blue.100", color: "blue.900", dot: "#2563EB" },
  converted: { bg: "green.100", color: "green.900", dot: "#16A34A" },
  closed: { bg: "gray.200", color: "gray.800", dot: "#64748B" },
};
