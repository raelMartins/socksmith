import { NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-session";
import { updateWaitlistStatus } from "@/lib/waitlist-store";
import { WAITLIST_STATUSES, type WaitlistStatus } from "@/lib/waitlist-options";

export const runtime = "nodejs";

function isWaitlistStatus(v: unknown): v is WaitlistStatus {
  return (
    typeof v === "string" &&
    (WAITLIST_STATUSES as readonly string[]).includes(v)
  );
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const ok = await verifyAdminCookie();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("status" in body)) {
    return NextResponse.json(
      { error: "Body must include status." },
      { status: 400 },
    );
  }

  const status = (body as { status: unknown }).status;
  if (!isWaitlistStatus(status)) {
    return NextResponse.json(
      {
        error: `Invalid status. Allowed: ${WAITLIST_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    const row = await updateWaitlistStatus(id, status);
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      row: { id: row.id, status: row.status },
    });
  } catch (error) {
    console.error("Admin waitlist status update failed:", error);
    return NextResponse.json(
      { error: "Could not update status." },
      { status: 500 },
    );
  }
}
