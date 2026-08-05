import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { WaitlistStatus } from "@/lib/waitlist-options";

export type WaitlistEntry = {
  id: string;
  fullName: string;
  email: string;
  styles: string[];
  colours: string[];
  boxQuantity: string;
  notes: string;
  status: WaitlistStatus;
  createdAt: string;
};

const WAITLIST_PATH = path.join(process.cwd(), "waitlist.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(WAITLIST_PATH);
  } catch {
    await fs.writeFile(WAITLIST_PATH, "[]\n", "utf8");
  }
}

export async function readWaitlist(): Promise<WaitlistEntry[]> {
  await ensureFile();
  const raw = await fs.readFile(WAITLIST_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as WaitlistEntry[];
  } catch {
    return [];
  }
}

export async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.writeFile(
    WAITLIST_PATH,
    `${JSON.stringify(entries, null, 2)}\n`,
    "utf8",
  );
}

export async function appendWaitlistEntry(
  input: Omit<WaitlistEntry, "id" | "createdAt" | "status">,
): Promise<WaitlistEntry> {
  const entries = await readWaitlist();
  const entry: WaitlistEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "waiting",
    ...input,
  };
  entries.push(entry);
  await writeWaitlist(entries);
  return entry;
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistStatus,
): Promise<WaitlistEntry | null> {
  const entries = await readWaitlist();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const updated: WaitlistEntry = { ...entries[index], status };
  entries[index] = updated;
  await writeWaitlist(entries);
  return updated;
}

export function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export const WAITLIST_CSV_HEADERS = [
  "id",
  "fullName",
  "email",
  "styles",
  "colours",
  "boxQuantity",
  "notes",
  "status",
  "createdAt",
] as const;

export function waitlistToCsv(entries: WaitlistEntry[]): string {
  const lines = [
    WAITLIST_CSV_HEADERS.join(","),
    ...entries.map((row) =>
      WAITLIST_CSV_HEADERS.map((header) => {
        const value = row[header];
        if (Array.isArray(value)) {
          return escapeCsvCell(value.join("; "));
        }
        return escapeCsvCell(String(value ?? ""));
      }).join(","),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}
