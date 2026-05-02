import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/constants";
import { verifyAdminJwt } from "@/lib/admin-jwt";

export async function verifyAdminCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifyAdminJwt(token);
}
