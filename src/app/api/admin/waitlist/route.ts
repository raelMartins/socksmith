import { NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-session";
import { getSupabaseServiceRole } from "@/lib/supabase/admin";
import { WAITLIST_TABLE } from "@/lib/constants";

const CSV_HEADERS = [
  "id",
  "email",
  "full_name",
  "phone",
  "instagram_handle",
  "hear_about_us",
  "sock_interests",
  "note",
  "status",
  "created_at",
] as const;

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const ok = await verifyAdminCookie();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let supabase;
  try {
    supabase = getSupabaseServiceRole();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase is not configured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from(WAITLIST_TABLE)
    .select(
      "id,email,full_name,phone,instagram_handle,hear_about_us,sock_interests,note,status,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const lines = [
      CSV_HEADERS.join(","),
      ...(data ?? []).map((row) => {
        const r = row as Record<string, unknown>;
        return CSV_HEADERS.map((h) => {
          let v = r[h];
          if (h === "sock_interests" && Array.isArray(v)) {
            v = (v as string[]).join("; ");
          }
          return escapeCsvCell(String(v ?? ""));
        }).join(",");
      }),
    ];
    const csv = `\uFEFF${lines.join("\n")}`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="socksmith-waitlist.csv"',
      },
    });
  }

  return NextResponse.json({ rows: data ?? [] });
}
