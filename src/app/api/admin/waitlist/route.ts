import { NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-session";
import { readWaitlist, waitlistToCsv } from "@/lib/waitlist-store";
import type { WaitlistRow } from "@/types/waitlist";

export const runtime = "nodejs";

function toAdminRow(
  entry: Awaited<ReturnType<typeof readWaitlist>>[number],
): WaitlistRow {
  return {
    id: entry.id,
    email: entry.email,
    full_name: entry.fullName,
    phone: null,
    instagram_handle: null,
    hear_about_us: null,
    shoe_size: null,
    drop_focus: null,
    note: entry.notes || null,
    sock_interests: entry.styles,
    favourite_colours: entry.colours,
    box_quantity: entry.boxQuantity,
    status: entry.status,
    created_at: entry.createdAt,
  };
}

export async function GET(request: Request) {
  const ok = await verifyAdminCookie();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const entries = await readWaitlist();
    const newestFirst = [...entries].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    const rows = newestFirst.map(toAdminRow);

    const url = new URL(request.url);
    if (url.searchParams.get("format") === "csv") {
      const csv = waitlistToCsv(newestFirst);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="socksmith-waitlist.csv"',
        },
      });
    }

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("Admin waitlist read failed:", error);
    return NextResponse.json(
      { error: "Could not read waitlist data." },
      { status: 500 },
    );
  }
}
