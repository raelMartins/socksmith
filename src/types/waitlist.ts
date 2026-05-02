import type { WaitlistStatus } from "@/lib/waitlist-options";

export type WaitlistRow = {
  id: string;
  email: string;
  full_name: string;
  instagram_handle: string | null;
  phone: string | null;
  note: string | null;
  shoe_size: string | null;
  drop_focus: string | null;
  hear_about_us: string | null;
  sock_interests: string[] | null;
  status: WaitlistStatus | string;
  created_at: string;
};
