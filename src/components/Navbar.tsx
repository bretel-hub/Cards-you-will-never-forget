import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
  onOrder: () => void;
}

const TABS: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "calendar", label: "Calendar" },
  { id: "subscriptions", label: "My Cards" },
];

export function Navbar({ view, setView, onOrder }: Props) {
  return (
    <header className="navbar">
      <button className="brand" onClick={() => setView("home")}>
        <span className="brand-mark">💌</span>
        <span className="brand-name">Cards You'll Never Forget</span>
      </button>

      <nav className="nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${view === t.id ? "is-active" : ""}`}
            onClick={() => setView(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <button className="btn btn-primary" onClick={onOrder}>
        Order a card
      </button>
    </header>
  );
}
