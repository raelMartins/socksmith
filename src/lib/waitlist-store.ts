import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
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
const REDIS_KEY = "socksmith:waitlist";

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redisClient = new Redis({ url, token });
  } else {
    redisClient = null;
  }
  return redisClient;
}

function assertStorageAvailable(): void {
  if (getRedis()) return;
  if (process.env.VERCEL) {
    throw new Error(
      "Waitlist storage requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in production.",
    );
  }
}

function parseEntries(raw: unknown): WaitlistEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw as WaitlistEntry[];
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(WAITLIST_PATH);
  } catch {
    await fs.writeFile(WAITLIST_PATH, "[]\n", "utf8");
  }
}

export async function readWaitlist(): Promise<WaitlistEntry[]> {
  const redis = getRedis();
  if (redis) {
    const items = await redis.lrange<string>(REDIS_KEY, 0, -1);
    return items
      .map((item) => {
        try {
          return typeof item === "string" ? (JSON.parse(item) as WaitlistEntry) : (item as WaitlistEntry);
        } catch {
          return null;
        }
      })
      .filter((entry): entry is WaitlistEntry => entry !== null);
  }

  assertStorageAvailable();
  await ensureFile();
  const raw = await fs.readFile(WAITLIST_PATH, "utf8");
  try {
    return parseEntries(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

export async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(REDIS_KEY);
    if (entries.length > 0) {
      await redis.rpush(
        REDIS_KEY,
        ...entries.map((entry) => JSON.stringify(entry)),
      );
    }
    return;
  }

  assertStorageAvailable();
  await fs.writeFile(
    WAITLIST_PATH,
    `${JSON.stringify(entries, null, 2)}\n`,
    "utf8",
  );
}

export async function appendWaitlistEntry(
  input: Omit<WaitlistEntry, "id" | "createdAt" | "status">,
): Promise<WaitlistEntry> {
  const entry: WaitlistEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "waiting",
    ...input,
  };

  const redis = getRedis();
  if (redis) {
    await redis.rpush(REDIS_KEY, JSON.stringify(entry));
    return entry;
  }

  assertStorageAvailable();
  const entries = await readWaitlist();
  entries.push(entry);
  await writeWaitlist(entries);
  return entry;
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistStatus,
): Promise<WaitlistEntry | null> {
  const redis = getRedis();
  if (redis) {
    const items = await redis.lrange<string>(REDIS_KEY, 0, -1);
    const index = items.findIndex((item) => {
      try {
        const parsed =
          typeof item === "string"
            ? (JSON.parse(item) as WaitlistEntry)
            : (item as WaitlistEntry);
        return parsed.id === id;
      } catch {
        return false;
      }
    });
    if (index === -1) return null;

    const current =
      typeof items[index] === "string"
        ? (JSON.parse(items[index] as string) as WaitlistEntry)
        : (items[index] as WaitlistEntry);
    const updated: WaitlistEntry = { ...current, status };
    await redis.lset(REDIS_KEY, index, JSON.stringify(updated));
    return updated;
  }

  assertStorageAvailable();
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
