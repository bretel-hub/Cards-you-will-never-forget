import { CARD_PRICE, STAMP_PRICE, formatUSD } from "../lib/pricing";

interface Props {
  onGetStarted: () => void;
  onOrder: () => void;
}

const STEPS = [
  {
    icon: "🗓️",
    title: "Add your important dates",
    body: "Birthdays, anniversaries, Mother's Day — drop them on your calendar once and we remember them forever.",
  },
  {
    icon: "📬",
    title: "We mail the card to you",
    body: "A beautiful card arrives at your door a week ahead — blank inside, ready for your words.",
  },
  {
    icon: "✍️",
    title: "Write from the heart",
    body: "Add your own handwritten message. Nothing beats real ink from a real person.",
  },
  {
    icon: "💌",
    title: "Deliver it yourself",
    body: "Hand it over or pop it in the mail. The thoughtful part stays 100% you.",
  },
];

export function Landing({ onGetStarted, onOrder }: Props) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Never miss a moment that matters</p>
          <h1>
            The card comes to <em>you</em>.
            <br />
            The message comes from your heart.
          </h1>
          <p className="lede">
            We send a beautiful card to your door before every important date,
            so you can write a personal, handwritten note and deliver it
            yourself. Just {formatUSD(CARD_PRICE)} a card. Cancel anytime.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Start your calendar
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onOrder}>
              Order a one-off card
            </button>
          </div>
          <p className="hero-fine">
            Add a {formatUSD(STAMP_PRICE)} forever stamp at checkout — optional,
            always.
          </p>
        </div>
        <div className="hero-card" aria-hidden="true">
          <div className="paper-card">
            <div className="paper-card-art">💐</div>
            <div className="paper-card-line" />
            <div className="paper-card-line short" />
            <p className="paper-card-hand">Happy Mother's Day, Mom…</p>
          </div>
        </div>
      </section>

      <section className="how">
        <h2>How it works</h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-num">Step {i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing">
        <div className="price-card">
          <h2>Simple, honest pricing</h2>
          <div className="price-tag">
            <span className="price-amount">{formatUSD(CARD_PRICE)}</span>
            <span className="price-per">per card</span>
          </div>
          <ul className="price-list">
            <li>✓ Premium card mailed to your door</li>
            <li>✓ Arrives ~1 week before the date</li>
            <li>✓ Blank inside for your handwritten note</li>
            <li>✓ Optional {formatUSD(STAMP_PRICE)} forever stamp</li>
            <li>✓ Skip, pause, or cancel anytime</li>
          </ul>
          <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
            Get started free
          </button>
        </div>
      </section>
    </div>
  );
}
