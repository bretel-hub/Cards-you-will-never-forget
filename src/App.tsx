import { useState } from "react";
import type { View } from "./types";
import { useOrders } from "./hooks/useOrders";
import { Navbar } from "./components/Navbar";
import { Landing } from "./components/Landing";
import { CalendarView } from "./components/CalendarView";
import { SubscriptionList } from "./components/SubscriptionList";
import { OrderModal } from "./components/OrderModal";

export default function App() {
  const [view, setView] = useState<View>("home");
  const store = useOrders();

  // Order modal state. `prefillDate` lets the calendar open it on a day.
  const [orderOpen, setOrderOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState<string | undefined>();

  const openOrder = (date?: string) => {
    setPrefillDate(date);
    setOrderOpen(true);
  };

  return (
    <div className="app">
      <Navbar view={view} setView={setView} onOrder={() => openOrder()} />

      <main>
        {view === "home" && (
          <Landing
            onGetStarted={() => setView("calendar")}
            onOrder={() => openOrder()}
          />
        )}

        {view === "calendar" && (
          <CalendarView
            orders={store.active}
            onAddDate={(date) => openOrder(date)}
          />
        )}

        {view === "subscriptions" && (
          <SubscriptionList store={store} onOrder={() => openOrder()} />
        )}
      </main>

      <footer className="footer">
        <p>
          Cards You Will Never Forget — sent to you, signed by you, delivered by
          you. 💌
        </p>
        <p className="footer-fine">
          $4.99 per card · optional $0.83 forever stamp · cancel anytime.
        </p>
      </footer>

      {orderOpen && (
        <OrderModal
          prefillDate={prefillDate}
          onClose={() => setOrderOpen(false)}
          onConfirm={(draft) => {
            store.addOrder(draft);
            setOrderOpen(false);
            setView(draft.kind === "scheduled" ? "calendar" : "subscriptions");
          }}
        />
      )}
    </div>
  );
}
