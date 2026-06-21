import type { CardOrder } from "../types";

export const CARD_PRICE = 4.99;
export const STAMP_PRICE = 0.82;

/** How many days before the important date a scheduled card is mailed out. */
export const SHIP_LEAD_DAYS = 7;

export interface PriceBreakdown {
  card: number;
  stamp: number;
  total: number;
}

export function priceFor(order: Pick<CardOrder, "foreverStamp">): PriceBreakdown {
  const stamp = order.foreverStamp ? STAMP_PRICE : 0;
  return {
    card: CARD_PRICE,
    stamp,
    total: round(CARD_PRICE + stamp),
  };
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
