import type { WaitlistStatus } from "@/lib/waitlist-options";

/** Shape returned by `/api/admin/waitlist` for the dashboard. */
export type WaitlistRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  instagram_handle: string | null;
  hear_about_us: string | null;
  shoe_size: string | null;
  drop_focus: string | null;
  note: string | null;
  sock_interests: string[] | null;
  favourite_colours?: string[] | null;
  box_quantity?: string | null;
  status: WaitlistStatus | string;
  created_at: string;
};
