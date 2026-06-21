import { useMemo, useState } from "react";
import type { CardOrder } from "../types";
import { getOccasion } from "../data/occasions";
import {
  daysUntil,
  formatLongDate,
  isSameDay,
  shipDate,
  toISODate,
} from "../lib/dates";

interface Props {
  orders: CardOrder[];
  onAddDate: (date: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarView({ orders, onAddDate }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const scheduled = useMemo(
    () => orders.filter((o) => o.kind === "scheduled"),
    [orders]
  );

  // Map ISO date -> orders on that day.
  const byDate = useMemo(() => {
    const map = new Map<string, CardOrder[]>();
    for (const o of scheduled) {
      const list = map.get(o.eventDate) ?? [];
      list.push(o);
      map.set(o.eventDate, list);
    }
    return map;
  }, [scheduled]);

  const cells = useMemo(() => buildMonthGrid(cursor), [cursor]);

  const upcoming = useMemo(
    () =>
      [...scheduled]
        .filter((o) => daysUntil(o.eventDate) >= 0)
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
        .slice(0, 5),
    [scheduled]
  );

  const goMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  return (
    <div className="page calendar-page">
      <div className="page-head">
        <div>
          <h1>Your card calendar</h1>
          <p className="page-sub">
            Click any day to schedule a card. We'll mail it to you about a week
            before so you can sign it and deliver it yourself.
          </p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar">
          <div className="cal-controls">
            <button className="icon-btn" onClick={() => goMonth(-1)} aria-label="Previous month">
              ‹
            </button>
            <h2>
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </h2>
            <button className="icon-btn" onClick={() => goMonth(1)} aria-label="Next month">
              ›
            </button>
          </div>

          <div className="cal-grid cal-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="cal-weekday">
                {d}
              </div>
            ))}
          </div>

          <div className="cal-grid">
            {cells.map((cell) => {
              const iso = toISODate(cell.date);
              const dayOrders = byDate.get(iso) ?? [];
              const isToday = isSameDay(cell.date, today);
              const isPast =
                cell.date <
                new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return (
                <button
                  key={iso}
                  className={[
                    "cal-day",
                    cell.inMonth ? "" : "is-muted",
                    isToday ? "is-today" : "",
                    isPast ? "is-past" : "",
                  ].join(" ")}
                  onClick={() => !isPast && onAddDate(iso)}
                  disabled={isPast}
                  title={isPast ? "Past date" : "Schedule a card"}
                >
                  <span className="cal-daynum">{cell.date.getDate()}</span>
                  <span className="cal-dots">
                    {dayOrders.slice(0, 3).map((o) => (
                      <span key={o.id} className="cal-dot" title={getOccasion(o.occasionId).name}>
                        {getOccasion(o.occasionId).emoji}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="upcoming">
          <h2>Coming up</h2>
          {upcoming.length === 0 ? (
            <div className="empty">
              <p>No cards scheduled yet.</p>
              <p className="empty-sub">Pick a day on the calendar to add one.</p>
            </div>
          ) : (
            <ul className="upcoming-list">
              {upcoming.map((o) => {
                const occ = getOccasion(o.occasionId);
                const dleft = daysUntil(o.eventDate);
                return (
                  <li key={o.id} className="upcoming-item">
                    <span className="upcoming-emoji">{occ.emoji}</span>
                    <div className="upcoming-info">
                      <strong>
                        {occ.name} · {o.recipientName}
                      </strong>
                      <small>{formatLongDate(o.eventDate)}</small>
                      <small className="ship-note">
                        Ships by{" "}
                        {shipDate(o.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </small>
                    </div>
                    <span className={`countdown ${dleft <= 7 ? "is-soon" : ""}`}>
                      {dleft === 0 ? "Today" : `${dleft}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

interface Cell {
  date: Date;
  inMonth: boolean;
}

/** Build a 6x7 grid covering the visible month (with leading/trailing days). */
function buildMonthGrid(cursor: Date): Cell[] {
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = new Date(firstOfMonth);
  start.setDate(1 - firstOfMonth.getDay()); // back up to Sunday

  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === cursor.getMonth() });
  }
  return cells;
}
