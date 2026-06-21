# 💌 Cards You Will Never Forget

A card subscription & delivery service with a twist: **the card is mailed to
you, not the recipient.** That way you can add a personal, handwritten message
and deliver it yourself — the thoughtful part stays 100% you.

## The idea

- **Add your important dates** (birthdays, anniversaries, Mother's Day…) to a
  calendar once.
- We **mail the card to your door ~1 week ahead** of each date.
- You **write a heartfelt note** and **deliver it yourself**.
- **$4.99 per card.** Optional **$0.83 forever stamp** at checkout.
- **Opt out / cancel any card anytime.**

## Features

- 🗓️ **Calendar view** — see upcoming dates at a glance and click any day to
  schedule a card.
- 📋 **My Cards (list view)** — manage every scheduled subscription and one-off
  order; filter by scheduled / one-off / cancelled; opt out or reactivate.
- ⚡ **Ad-hoc orders** — order a card right now without scheduling.
- 🎉 **Popular occasions** — Birthday, Anniversary, Mother's/Father's Day,
  Valentine's, Christmas, Thank You, Wedding, Graduation, New Baby, and more.
- 🔁 **Repeat annually** for recurring dates.
- 💌 **Forever stamp opt-in** with a live price breakdown.

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- No backend required — orders persist to the browser's `localStorage`, so the
  app runs and demos immediately. (Swapping in a real API + Stripe checkout is
  the natural next step.)

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/        UI: Navbar, Landing, CalendarView, SubscriptionList, OrderModal
  data/occasions.ts  The most popular card occasions
  hooks/             useLocalStorage, useOrders (the order store)
  lib/               pricing (constants + math) and date helpers
  types.ts           Domain model (Occasion, CardOrder)
```

## Roadmap ideas

- Real accounts + a backend API
- Stripe payments and recurring billing
- Email/SMS reminders before each ship date
- Card design/template gallery per occasion
- Address book for recipients
