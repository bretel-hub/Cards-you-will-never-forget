import { SHIP_LEAD_DAYS } from "./pricing";

/** Format an ISO yyyy-mm-dd as a local date without timezone surprises. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** The date we mail the card to the customer (lead days before the event). */
export function shipDate(eventISO: string): Date {
  const d = parseISODate(eventISO);
  d.setDate(d.getDate() - SHIP_LEAD_DAYS);
  return d;
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseISODate(iso);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Build the suggested event date for an occasion with a fixed MM-DD. Returns
 * this year's date if it's still upcoming, otherwise next year's.
 */
export function nextOccurrenceOfFixed(fixedDate: string): string {
  const [mm, dd] = fixedDate.split("-").map(Number);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let candidate = new Date(now.getFullYear(), mm - 1, dd);
  if (candidate.getTime() < now.getTime()) {
    candidate = new Date(now.getFullYear() + 1, mm - 1, dd);
  }
  return toISODate(candidate);
}
