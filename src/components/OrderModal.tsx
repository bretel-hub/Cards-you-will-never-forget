import { useEffect, useMemo, useState } from "react";
import { OCCASIONS, getOccasion } from "../data/occasions";
import { STAMP_PRICE, formatUSD, priceFor } from "../lib/pricing";
import {
  formatLongDate,
  nextOccurrenceOfFixed,
  shipDate,
  toISODate,
} from "../lib/dates";
import type { CardOrder } from "../types";
import type { NewOrder } from "../hooks/useOrders";

interface Props {
  prefillDate?: string;
  onClose: () => void;
  onConfirm: (draft: NewOrder) => void;
}

export function OrderModal({ prefillDate, onClose, onConfirm }: Props) {
  const [occasionId, setOccasionId] = useState<string>("birthday");
  const [recipientName, setRecipientName] = useState("");
  const [eventDate, setEventDate] = useState(prefillDate ?? "");
  const [note, setNote] = useState("");
  const [foreverStamp, setForeverStamp] = useState(false);
  const [repeatAnnually, setRepeatAnnually] = useState(false);
  const [kind, setKind] = useState<CardOrder["kind"]>("scheduled");

  // When an occasion with a fixed holiday date is picked, suggest its date.
  useEffect(() => {
    const occ = getOccasion(occasionId);
    if (occ.fixedDate && !prefillDate) {
      setEventDate(nextOccurrenceOfFixed(occ.fixedDate));
    }
  }, [occasionId, prefillDate]);

  const price = useMemo(() => priceFor({ foreverStamp }), [foreverStamp]);

  const minDate = toISODate(new Date());
  const dateValid = kind === "adhoc" || Boolean(eventDate);
  const canSubmit = Boolean(recipientName.trim()) && dateValid;

  const submit = () => {
    if (!canSubmit) return;
    onConfirm({
      occasionId,
      recipientName: recipientName.trim(),
      eventDate: kind === "adhoc" ? minDate : eventDate,
      note: note.trim() || undefined,
      foreverStamp,
      repeatAnnually: kind === "scheduled" && repeatAnnually,
      kind,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Order a card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>Order a card</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="modal-body">
          <fieldset className="seg">
            <legend>When do you need it?</legend>
            <div className="seg-row">
              <button
                type="button"
                className={`seg-btn ${kind === "scheduled" ? "is-on" : ""}`}
                onClick={() => setKind("scheduled")}
              >
                📅 Schedule for a date
                <small>We mail it ~1 week ahead</small>
              </button>
              <button
                type="button"
                className={`seg-btn ${kind === "adhoc" ? "is-on" : ""}`}
                onClick={() => setKind("adhoc")}
              >
                ⚡ Order now (one-off)
                <small>Ships right away</small>
              </button>
            </div>
          </fieldset>

          <label className="field">
            <span>Occasion</span>
            <div className="occasion-grid">
              {OCCASIONS.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  className={`occasion ${occasionId === o.id ? "is-on" : ""}`}
                  onClick={() => setOccasionId(o.id)}
                >
                  <span className="occasion-emoji">{o.emoji}</span>
                  <span className="occasion-name">{o.name}</span>
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span>Who is it for?</span>
            <input
              type="text"
              placeholder="e.g. Mom, Sarah, Grandpa Joe"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </label>

          {kind === "scheduled" && (
            <label className="field">
              <span>Important date</span>
              <input
                type="date"
                min={minDate}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              {eventDate && (
                <small className="hint">
                  We'll mail your card by{" "}
                  <strong>
                    {shipDate(eventDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </strong>{" "}
                  so it arrives before {formatLongDate(eventDate)}.
                </small>
              )}
            </label>
          )}

          <label className="field">
            <span>Reminder note (optional)</span>
            <input
              type="text"
              placeholder="e.g. mention the trip to Italy"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {kind === "scheduled" && (
            <label className="check">
              <input
                type="checkbox"
                checked={repeatAnnually}
                onChange={(e) => setRepeatAnnually(e.target.checked)}
              />
              <span>
                Repeat every year
                <small>Great for birthdays &amp; anniversaries.</small>
              </span>
            </label>
          )}

          <label className="check">
            <input
              type="checkbox"
              checked={foreverStamp}
              onChange={(e) => setForeverStamp(e.target.checked)}
            />
            <span>
              Add a forever stamp (+{formatUSD(STAMP_PRICE)})
              <small>So it's ready to drop straight in the mail.</small>
            </span>
          </label>
        </div>

        <footer className="modal-foot">
          <div className="summary">
            <div className="summary-row">
              <span>Card</span>
              <span>{formatUSD(price.card)}</span>
            </div>
            {foreverStamp && (
              <div className="summary-row">
                <span>Forever stamp</span>
                <span>{formatUSD(price.stamp)}</span>
              </div>
            )}
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatUSD(price.total)}</span>
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            disabled={!canSubmit}
            onClick={submit}
          >
            {kind === "scheduled"
              ? `Schedule card · ${formatUSD(price.total)}`
              : `Place order · ${formatUSD(price.total)}`}
          </button>
          {!canSubmit && (
            <p className="foot-hint">
              {recipientName.trim()
                ? "Pick the important date to continue."
                : "Tell us who the card is for to continue."}
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
