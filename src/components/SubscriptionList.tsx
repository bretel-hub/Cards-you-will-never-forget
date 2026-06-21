import { useMemo, useState } from "react";
import type { CardOrder } from "../types";
import { getOccasion } from "../data/occasions";
import { daysUntil, formatLongDate, shipDate } from "../lib/dates";
import { formatUSD, priceFor } from "../lib/pricing";

interface Store {
  orders: CardOrder[];
  cancelOrder: (id: string) => void;
  reactivateOrder: (id: string) => void;
  removeOrder: (id: string) => void;
}

interface Props {
  store: Store;
  onOrder: () => void;
}

type Filter = "all" | "scheduled" | "adhoc" | "cancelled";

export function SubscriptionList({ store, onOrder }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const list = [...store.orders].sort((a, b) =>
      a.eventDate.localeCompare(b.eventDate)
    );
    switch (filter) {
      case "scheduled":
        return list.filter((o) => o.status === "active" && o.kind === "scheduled");
      case "adhoc":
        return list.filter((o) => o.status === "active" && o.kind === "adhoc");
      case "cancelled":
        return list.filter((o) => o.status === "cancelled");
      default:
        return list.filter((o) => o.status === "active");
    }
  }, [store.orders, filter]);

  const activeCount = store.orders.filter((o) => o.status === "active").length;
  const monthlyEstimate = store.orders
    .filter((o) => o.status === "active")
    .reduce((sum, o) => sum + priceFor(o).total, 0);

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "Active" },
    { id: "scheduled", label: "Scheduled" },
    { id: "adhoc", label: "One-off" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>My cards</h1>
          <p className="page-sub">
            {activeCount} active {activeCount === 1 ? "card" : "cards"} ·{" "}
            {formatUSD(monthlyEstimate)} estimated in your queue. Opt out of any
            card anytime.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOrder}>
          + Add a card
        </button>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? "is-on" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty card">
          <p>Nothing here yet.</p>
          <p className="empty-sub">
            Schedule a card for an upcoming date or order a one-off.
          </p>
          <button className="btn btn-primary" onClick={onOrder}>
            Order a card
          </button>
        </div>
      ) : (
        <ul className="sub-list">
          {filtered.map((o) => {
            const occ = getOccasion(o.occasionId);
            const cancelled = o.status === "cancelled";
            const dleft = daysUntil(o.eventDate);
            return (
              <li key={o.id} className={`sub-card ${cancelled ? "is-cancelled" : ""}`}>
                <div className="sub-emoji">{occ.emoji}</div>
                <div className="sub-main">
                  <div className="sub-title">
                    <strong>{occ.name}</strong>
                    <span className="sub-for">for {o.recipientName}</span>
                    {o.repeatAnnually && <span className="tag">Annual</span>}
                    {o.kind === "adhoc" && <span className="tag tag-alt">One-off</span>}
                    {o.foreverStamp && <span className="tag tag-stamp">+ stamp</span>}
                  </div>
                  <div className="sub-meta">
                    {o.kind === "scheduled" ? (
                      <>
                        <span>{formatLongDate(o.eventDate)}</span>
                        <span className="dot-sep">·</span>
                        <span>
                          ships by{" "}
                          {shipDate(o.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </>
                    ) : (
                      <span>Ordered — ships right away</span>
                    )}
                  </div>
                  {o.note && <p className="sub-note">“{o.note}”</p>}
                </div>

                <div className="sub-side">
                  <div className="sub-price">{formatUSD(priceFor(o).total)}</div>
                  {!cancelled && o.kind === "scheduled" && dleft >= 0 && (
                    <span className={`countdown ${dleft <= 7 ? "is-soon" : ""}`}>
                      {dleft === 0 ? "Today" : `in ${dleft}d`}
                    </span>
                  )}
                  {cancelled ? (
                    <div className="sub-actions">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => store.reactivateOrder(o.id)}
                      >
                        Reactivate
                      </button>
                      <button
                        className="btn btn-sm btn-danger-ghost"
                        onClick={() => store.removeOrder(o.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => store.cancelOrder(o.id)}
                    >
                      Opt out
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
