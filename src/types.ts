export interface Occasion {
  id: string;
  name: string;
  emoji: string;
  /** Used to suggest a default month/day for recurring holidays (MM-DD). */
  fixedDate?: string;
}

/**
 * A card the customer has set up. Scheduled cards are tied to an upcoming
 * important date; ad-hoc cards are ordered for immediate fulfilment.
 */
export interface CardOrder {
  id: string;
  occasionId: string;
  /** Who the card is for (e.g. "Mom", "Sarah"). */
  recipientName: string;
  /** The important date the card is meant for (ISO yyyy-mm-dd). */
  eventDate: string;
  /** Optional note shown to the customer to jog their memory. */
  note?: string;
  /** Add a $0.83 forever stamp to this order. */
  foreverStamp: boolean;
  /** Repeat this card every year (e.g. birthdays, anniversaries). */
  repeatAnnually: boolean;
  /** "scheduled" cards mail ahead of eventDate; "adhoc" ship right away. */
  kind: "scheduled" | "adhoc";
  status: "active" | "cancelled";
  createdAt: string;
}

export type View = "home" | "calendar" | "subscriptions";
