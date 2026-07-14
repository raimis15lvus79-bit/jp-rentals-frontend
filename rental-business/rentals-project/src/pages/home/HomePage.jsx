import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import './HomePage.css';

const rentals = [
  {
    title: 'White resin folding chairs',
    description: 'Clean, stackable seating for weddings, family gatherings, church events, and backyard parties.',
    image: 'images/white-resin-chairs.jpg',
    alt: 'White resin folding chairs set up for an event',
    icon: '??',
  },
  {
    title: '6-foot folding tables',
    description: 'Perfect for buffet setups, craft tables, kids activities, and extra serving space.',
    image: 'images/6ft-folding-table.jpg',
    alt: '6-foot folding table for events',
    icon: '??',
  },
  {
    title: '6-foot rummage sale tables',
    description: 'A simple, sturdy option for garage sales, flea markets, and community fundraisers.',
    image: 'images/rummage-sale-table.jpg',
    alt: '6-foot rummage sale table',
    icon: '???',
  },
];

const extras = [
  {
    title: 'Nerf war rentals',
    description: 'Bring the action with a ready-to-play setup for birthdays, youth groups, and family fun.',
    image: 'images/nerf-war.jpg',
    alt: 'Nerf war rental setup',
    icon: '??',
  },
  {
    title: '9-hole mini golf',
    description: 'A playful rental that turns any yard into a little tournament course.',
    image: 'images/mini-golf.jpg',
    alt: '9-hole mini golf rental course',
    icon: '?',
  },
  {
    title: 'Yard games',
    description: 'Giant Jenga, giant Connect 4, and shape toss games keep guests entertained all day.',
    image: 'images/yard-games.jpg',
    alt: 'Yard games rental set',
    icon: '??',
  },
  {
    title: 'Popcorn & cotton candy',
    description: '4 oz and 6 oz kettle popcorn machines plus a cotton candy machine for a sweet, festive touch.',
    image: 'images/popcorn-cotton-candy.jpg',
    alt: 'Popcorn and cotton candy rental machines',
    icon: '??',
  },
];
const events = [
  'Weddings',
  'Graduation parties',
  'Rummage sales',
  'Birthdays',
  'School or church events',
];

const steps = [
  {
    title: 'Choose your rentals',
    copy: 'Pick the chairs, tables, games, or machines that fit your event.',
  },
  {
    title: 'Check availability',
    copy: 'Share your date and I\u2019ll confirm what\u2019s open for your day.',
  },
  {
    title: 'Get a quote',
    copy: 'I\u2019ll help you shape a simple package that matches your guest count and budget.',
  },
  {
    title: 'Book your date',
    copy: 'Once you\u2019re ready, we\u2019ll lock in the date and get everything set up.',
  },
];

const initialFormData = {
  name: '',
  event: '',
  date: '',
  details: ''
};

export function HomePage({ cart }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    document.title = 'JP Rentals and Events | Kaukauna, WI';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Unable to send request');
      }

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      setSubmitError('Something went wrong. Please try again or contact me directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header cart={cart} /><div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">JP Rentals and Events</p>
            <h1>Party rentals that make your event feel easy, fun, and memorable.</h1>
            <p className="hero-copy">
              From backyard celebrations to rummage sales and neighborhood fun days, I offer dependable rentals with a warm, local touch.
            </p>

            <div className="hero-actions">
              <a href="#booking" className="primary-btn">Book your rental</a>
              <a href="#services" className="secondary-btn">See what\u2019s available</a>
            </div>

            <ul className="hero-list">
              <li>Fast local service for Kaukauna and nearby areas</li>
              <li>Great for birthdays, fundraisers, church events, and family gatherings</li>
              <li>Flexible setups for indoor or outdoor fun</li>
            </ul>
          </div>

          <div className="hero-card">
            <p className="eyebrow">Popular rentals</p>
            <ul>
              <li>White resin folding chairs</li>
              <li>6-foot folding tables</li>
              <li>Nerf war rentals</li>
              <li>Mini golf and yard games</li>
              <li>Popcorn and cotton candy machines</li>
            </ul>
          </div>
        </section>

        <section className="info-strip" aria-label="business highlights">
          <div>Serving Kaukauna, WI</div>
          <div>Friendly, local booking</div>
          <div>Perfect for parties and community events</div>
        </section>

        <section id="services" className="services-section">
          <div className="section-heading">
            <p className="eyebrow">Rentals overview</p>
            <h2>Flexible rentals for casual gatherings, fundraisers, and backyard fun.</h2>
          </div>

          <div className="services-grid">
            {rentals.map((item) => (
              <article key={item.title} className="service-card">
                <div className="service-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="services-grid secondary-grid">
            {extras.map((item) => (
              <article key={item.title} className="service-card">
                <div className="service-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section><section className="highlight-section">
          <div className="section-heading">
            <p className="eyebrow">Popular events</p>
            <h2>Great for weddings, birthdays, rummage sales, and school celebrations.</h2>
          </div>
          <div className="event-list">
            {events.map((event) => (
              <div key={event} className="event-pill">{event}</div>
            ))}
          </div>
        </section>

        <section className="highlight-section">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Booking is simple and personal.</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step.title} className="step-card">
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="highlight-section">
          <div className="section-heading">
            <p className="eyebrow">Service area</p>
            <h2>I serve Kaukauna and nearby communities with easy, local delivery.</h2>
          </div>
          <div className="service-area-card">
            <p>
              Whether you\u2019re planning a backyard party, church fundraiser, or school event, I\u2019m happy to help you build a package that fits your budget and guest count.
            </p>
            <ul>
              <li>Flexible pickup and delivery options</li>
              <li>Helpful setup suggestions for larger gatherings</li>
              <li>Friendly communication from first question to final booking</li>
            </ul>
          </div>
        </section>

        <section id="booking" className="booking-section">
          <div className="booking-card">
            <p className="eyebrow">Ready to reserve?</p>
Let’s make your event happen.
            <p>
              Send me your date, event type, and the rentals you want, and I\u2019ll help you put together a simple package.
            </p>
            <div className="contact-links">
              <a href="tel:+16085677536">608-567-7536</a>
              <a href="mailto:jacobpaske08@hotmail.com">jacobpaske08@hotmail.com</a>
            </div>
          </div>

          <div className="quote-card">
            <p className="eyebrow">Request a quote</p>
            <h3>Share a few details and I\u2019ll get back to you soon.</h3>
            <form className="quote-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" placeholder="Jordan" value={formData.name} onChange={handleChange} />

              <label htmlFor="event">Event type</label>
              <input id="event" name="event" type="text" placeholder="Birthday party" value={formData.event} onChange={handleChange} />

              <label htmlFor="date">Event date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />

              <label htmlFor="details">What do you need?</label>
              <textarea id="details" name="details" rows="4" placeholder="Chairs, tables, mini golf, and popcorn machine for 40 guests." value={formData.details} onChange={handleChange} />

              {submitError && <p className="error-message">{submitError}</p>}
              {submitted && <p className="success-message">Thanks for your request! I'll get back to you soon.</p>}
              {!submitted && (
                <>
                  <button type="submit" className="primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send request'}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </div>
    </>
  );
}