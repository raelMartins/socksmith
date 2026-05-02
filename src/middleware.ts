import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";
import { verifyAdminJwt } from "@/lib/admin-jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.redirect(
      new URL("/admin/login?error=config", request.url),
    );
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyAdminJwt(token);
  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
