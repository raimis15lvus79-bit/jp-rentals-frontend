import { Footer } from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import './HomePage.css';

export function HomePage() {
  return (
    <>
      <Header />

      <main className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">Party rentals in Northeast Wisconsin</p>

            <h1>
  Chairs, tables, games, and concessions for backyard parties,
  graduation parties, and local events.
</h1>

            <p className="hero-text">
              JP Rentals and Events serves Kaukauna, the Fox Valley, and Green Bay
              with easy online quote requests, pickup options, and delivery pricing
              based on your event location.
            </p>

            <div className="hero-actions">
              <Link to="/quote" className="primary-button">
                Request Pricing
              </Link>

              <Link to="/rentals" className="secondary-button">
                Browse Rentals
              </Link>
            </div>

            <div className="hero-trust" aria-label="Why customers choose us">
              <span>Clean and sanitized rentals</span>
              <span>Pickup and delivery options</span>
              <span>Serving Northeast Wisconsin</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Popular rentals</h2>
            <p>
              Start with chairs and tables, then add extras to complete your event setup.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card feature-card--highlight">
              <h3>Chairs</h3>
              <p>
                Clean, dependable seating for graduation parties, backyard events,
                family gatherings, and community setups.
              </p>
              <Link to="/rentals?category=chairs" className="feature-link">
                View chair rentals
              </Link>
            </article>

            <article className="feature-card feature-card--highlight">
              <h3>Tables</h3>
              <p>
                Reliable table rentals for food service, guest seating, displays,
                dessert tables, and rummage sales.
              </p>
              <Link to="/rentals?category=tables" className="feature-link">
                View table rentals
              </Link>
            </article>

            <article className="feature-card">
              <h3>Games and concessions</h3>
              <p>
                Yard games, mini golf, Nerf rentals, popcorn machines, cotton candy,
                and more to make your event stand out.
              </p>
              <Link to="/rentals" className="feature-link">
                Browse extras
              </Link>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Perfect for</h2>
            <p>Flexible rentals for simple setups, fun parties, and local events.</p>
          </div>

          <div className="feature-grid feature-grid--events">
            <article className="feature-card">
              <h3>Graduation parties</h3>
              <p>
                Tables, chairs, and extras that make backyard graduation parties easier
                to plan and set up.
              </p>
            </article>

            <article className="feature-card">
              <h3>Backyard parties and family gatherings</h3>
              <p>
                Simple rental options for seating, serving space, and fun extras for guests.
              </p>
            </article>

            <article className="feature-card">
              <h3>School and community events</h3>
              <p>
                Add games, concessions, and practical rental items for local events of all sizes.
              </p>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>How it works</h2>
            <p>A simple process for pricing, pickup, or delivery planning.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span>1</span>
              <h3>Browse rentals</h3>
              <p>Explore chairs, tables, games, concessions, and event extras.</p>
            </article>

            <article className="step-card">
              <span>2</span>
              <h3>Build your quote</h3>
              <p>
                Select what you need and choose pickup or request delivery pricing.
              </p>
            </article>

            <article className="step-card">
              <span>3</span>
              <h3>Submit your request</h3>
              <p>
                We review availability and follow up with pricing and next steps.
              </p>
            </article>
          </div>
        </section>

        <section className="home-section service-area-section">
          <div className="section-heading">
            <h2>Service area</h2>
            <p>Serving local events across Kaukauna, the Fox Valley, and Green Bay.</p>
          </div>

          <div className="service-area-card">
            <p className="service-area-text">
              We offer pickup options and delivery quotes for events throughout
              Northeast Wisconsin. Delivery pricing is based on mileage, so a physical
              address is required when requesting a delivery quote.
            </p>

            <div className="service-area-list">
              <span>Kaukauna</span>
              <span>Fox Valley</span>
              <span>Green Bay</span>
              <span>Northeast Wisconsin</span>
            </div>
          </div>
        </section>

        <section className="home-section testimonials-section">
          <div className="section-heading">
            <h2>Built for simple event rentals</h2>
            <p>Real feedback from local rental pickups and event setups.</p>
          </div>

          <div className="testimonials-grid">
            <article className="testimonial-card">
              <p className="testimonial-text">
                “Pickup was simple, the chairs were clean, and everything was ready
                on time for our graduation party.”
              </p>
              <p className="testimonial-name">Graduation party customer</p>
            </article>

            <article className="testimonial-card">
              <p className="testimonial-text">
                “The tables and chairs made planning much easier, and communication
                throughout the process was smooth.”
              </p>
              <p className="testimonial-name">Fox Valley customer</p>
            </article>

            <article className="testimonial-card">
              <p className="testimonial-text">
                “The extra games were a hit with everyone, and the rental process was
                straightforward from start to finish.”
              </p>
              <p className="testimonial-name">Northeast Wisconsin customer</p>
            </article>
          </div>
        </section>

        <section className="home-section cta-section">
          <h2>Need pricing for your event?</h2>
          <p>
            Send your rental request online and we’ll follow up with availability,
            pricing, and delivery or pickup details.
          </p>
          <Link to="/quote" className="primary-button">
            Start Your Quote
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}