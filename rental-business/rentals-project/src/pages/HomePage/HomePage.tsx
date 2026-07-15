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
            <p className="hero-eyebrow">JP Rentals and Events</p>
            <h1>Tables, chairs, yard games, and event rentals for Northeast Wisconsin.</h1>
            <p className="hero-text">
              Serving Kaukauna, the Fox Valley, and Green Bay with pickup or delivery quote options.
            </p>

            <div className="hero-actions">
              <Link to="/rentals" className="primary-button">
                Browse Rentals
              </Link>
              <Link to="/quote" className="secondary-button">
                Request Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Popular rentals</h2>
            <p>Start with the essentials, then add fun extras for your event.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>Tables</h3>
              <p>Reliable table rentals for food service, seating, displays, and event setup.</p>
            </article>

            <article className="feature-card">
              <h3>Chairs</h3>
              <p>Simple seating options for parties, graduations, weddings, and local gatherings.</p>
            </article>

            <article className="feature-card">
              <h3>Yard games</h3>
              <p>Add interactive fun with games and event extras for all ages.</p>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>How it works</h2>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span>1</span>
              <h3>Browse rentals</h3>
              <p>Look through tables, chairs, yard games, and event items.</p>
            </article>

            <article className="step-card">
              <span>2</span>
              <h3>Build your quote</h3>
              <p>Select what you need and choose pickup or request a delivery quote.</p>
            </article>

            <article className="step-card">
              <span>3</span>
              <h3>Submit inquiry</h3>
              <p>We review availability and send the next steps for your event.</p>
            </article>
          </div>
        </section>

        <section className="home-section cta-section">
          <h2>Need pricing for your event?</h2>
          <p>
            Send your rental request online and we’ll follow up with availability, pricing, and contract details.
          </p>
          <Link to="/quote" className="primary-button">
            Start Your Quote
          </Link>
        </section>
      </main>
    </>
  );
}