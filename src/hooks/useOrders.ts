import { useMemo } from "react";
import type { CardOrder } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "cynf.orders.v1";

export type NewOrder = Omit<CardOrder, "id" | "status" | "createdAt">;

export function useOrders() {
  const [orders, setOrders] = useLocalStorage<CardOrder[]>(STORAGE_KEY, []);

  const addOrder = (draft: NewOrder): CardOrder => {
    const order: CardOrder = {
      ...draft,
      id: crypto.randomUUID(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
    return order;
  };

  /** Opt out / cancel a card the customer no longer wants. */
  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
    );
  };

  const reactivateOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "active" } : o))
    );
  };

  const removeOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const active = useMemo(
    () => orders.filter((o) => o.status === "active"),
    [orders]
  );

  return { orders, active, addOrder, cancelOrder, reactivateOrder, removeOrder };
}
