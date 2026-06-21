import type { Occasion } from "../types";

/**
 * The most popular card-sending occasions. Holidays with a fixed calendar
 * date include `fixedDate` so we can pre-fill the date picker.
 */
export const OCCASIONS: Occasion[] = [
  { id: "birthday", name: "Birthday", emoji: "🎂" },
  { id: "anniversary", name: "Anniversary", emoji: "💍" },
  { id: "mothers-day", name: "Mother's Day", emoji: "💐", fixedDate: "05-11" },
  { id: "fathers-day", name: "Father's Day", emoji: "👔", fixedDate: "06-15" },
  { id: "valentines-day", name: "Valentine's Day", emoji: "❤️", fixedDate: "02-14" },
  { id: "christmas", name: "Christmas", emoji: "🎄", fixedDate: "12-25" },
  { id: "thank-you", name: "Thank You", emoji: "🙏" },
  { id: "get-well", name: "Get Well Soon", emoji: "🌷" },
  { id: "wedding", name: "Wedding", emoji: "💒" },
  { id: "graduation", name: "Graduation", emoji: "🎓" },
  { id: "new-baby", name: "New Baby", emoji: "👶" },
  { id: "sympathy", name: "Sympathy", emoji: "🕊️" },
  { id: "congratulations", name: "Congratulations", emoji: "🎉" },
  { id: "easter", name: "Easter", emoji: "🐰", fixedDate: "04-05" },
  { id: "thanksgiving", name: "Thanksgiving", emoji: "🦃", fixedDate: "11-26" },
  { id: "just-because", name: "Just Because", emoji: "💌" },
];

export const OCCASIONS_BY_ID: Record<string, Occasion> = Object.fromEntries(
  OCCASIONS.map((o) => [o.id, o])
);

export function getOccasion(id: string): Occasion {
  return (
    OCCASIONS_BY_ID[id] ?? { id, name: "Card", emoji: "💌" }
  );
}
