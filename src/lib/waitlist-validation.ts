import {
  BOX_QUANTITY_OPTIONS,
  FAVOURITE_COLOUR_OPTIONS,
  SOCK_INTEREST_OPTIONS,
  type BoxQuantityOption,
  type FavouriteColourOption,
  type SockInterestOption,
} from "@/lib/waitlist-options";

export type WaitlistSubmitPayload = {
  fullName: string;
  email: string;
  styles: SockInterestOption[];
  colours: FavouriteColourOption[];
  boxQuantity: BoxQuantityOption;
  notes: string;
};

export type WaitlistValidationResult =
  | { ok: true; data: WaitlistSubmitPayload }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const STYLE_SET = new Set<string>(SOCK_INTEREST_OPTIONS);
const COLOUR_SET = new Set<string>(
  FAVOURITE_COLOUR_OPTIONS.map((c) => c.label),
);
const QUANTITY_SET = new Set<string>(BOX_QUANTITY_OPTIONS);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateWaitlistPayload(
  body: unknown,
): WaitlistValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body." };
  }

  const raw = body as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};

  const fullName = typeof raw.fullName === "string" ? raw.fullName.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const notes = typeof raw.notes === "string" ? raw.notes.trim() : "";
  const styles = isStringArray(raw.styles) ? raw.styles : null;
  const colours = isStringArray(raw.colours) ? raw.colours : null;
  const boxQuantity =
    typeof raw.boxQuantity === "string" ? raw.boxQuantity.trim() : "";

  if (fullName.length < 2) {
    fieldErrors.fullName = "Please tell us your name";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email";
  }
  if (!styles || styles.length === 0) {
    fieldErrors.styles = "Pick at least one style";
  } else if (styles.some((s) => !STYLE_SET.has(s))) {
    fieldErrors.styles = "One or more styles are invalid";
  }
  if (!colours || colours.length === 0) {
    fieldErrors.colours = "Pick at least one colour";
  } else if (colours.some((c) => !COLOUR_SET.has(c))) {
    fieldErrors.colours = "One or more colours are invalid";
  }
  if (!boxQuantity || !QUANTITY_SET.has(boxQuantity)) {
    fieldErrors.boxQuantity = "Choose a box quantity";
  }
  if (notes.length > 2000) {
    fieldErrors.notes = "Notes must be under 2000 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      email: email.toLowerCase(),
      styles: styles as SockInterestOption[],
      colours: colours as FavouriteColourOption[],
      boxQuantity: boxQuantity as BoxQuantityOption,
      notes,
    },
  };
}
