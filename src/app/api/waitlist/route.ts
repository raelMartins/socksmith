import { NextResponse } from "next/server";
import { validateWaitlistPayload } from "@/lib/waitlist-validation";
import {
  appendWaitlistEntry,
  readWaitlist,
  waitlistToCsv,
} from "@/lib/waitlist-store";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.WAITLIST_SECRET;
  if (!secret) return false;

  const headerSecret =
    request.headers.get("x-waitlist-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return Boolean(headerSecret && headerSecret === secret);
}

/** Public waitlist signup. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateWaitlistPayload(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: 400 },
    );
  }

  try {
    const entry = await appendWaitlistEntry(result.data);
    return NextResponse.json(
      { ok: true, id: entry.id, createdAt: entry.createdAt },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save waitlist entry:", error);
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * Protected export.
 * Header: `x-waitlist-secret: <WAITLIST_SECRET>` (or `Authorization: Bearer …`)
 * Query: `?format=csv` for CSV download; otherwise JSON array.
 */
export async function GET(request: Request) {
  if (!process.env.WAITLIST_SECRET) {
    return NextResponse.json(
      { error: "WAITLIST_SECRET is not configured on the server." },
      { status: 500 },
    );
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const entries = await readWaitlist();
    const newestFirst = [...entries].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );

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

    return NextResponse.json(newestFirst);
  } catch (error) {
    console.error("Failed to read waitlist:", error);
    return NextResponse.json(
      { error: "Could not read waitlist data." },
      { status: 500 },
    );
  }
}
