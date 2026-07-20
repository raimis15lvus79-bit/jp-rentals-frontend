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
            <p className="hero-eyebrow">JP Rentals and Events</p>
            <h1>Chairs, Tables, Games, Concessions, and Party Rentals for Northeast Wisconsin.</h1>
            <p className="hero-text">
              Serving Kaukauna, the Fox Valley, and Green Bay with simple rental inquiries,
              pickup options, and delivery quotes based on your event location.
            </p>

            <div className="hero-actions">
              <Link to="/quote" className="primary-button">
                Request Pricing
              </Link>
              <Link to="/rentals" className="secondary-button">
                Browse Rentals
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <h2>Popular rentals</h2>
            <p>Start with chairs and tables, then add extras to complete your event setup.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card feature-card--highlight">
              <h3>Chairs</h3>
              <p>Clean, dependable seating for weddings, grad parties, backyard events, and community gatherings.</p>
            </article>

            <article className="feature-card feature-card--highlight">
              <h3>Tables</h3>
              <p>Reliable table rentals for food service, guest seating, displays, dessert tables, and rummage sales.</p>
            </article>

            <article className="feature-card">
              <h3>Games and extras</h3>
              <p>Yard games, mini golf, Nerf rentals, popcorn machines, and more to make your event stand out.</p>
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
              <p>Tables, chairs, and extras to make backyard celebrations easier to set up.</p>
            </article>

            <article className="feature-card">
              <h3>Weddings and showers</h3>
              <p>Simple event rentals for seating, serving space, and guest gathering areas.</p>
            </article>

            <article className="feature-card">
              <h3>Backyard parties and community events</h3>
              <p>Add games, concessions, and practical event rentals for all ages.</p>
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
              <p>Look through chairs, tables, games, concessions, and event extras.</p>
            </article>

            <article className="step-card">
              <span>2</span>
              <h3>Build your quote</h3>
              <p>Select what you need and choose pickup or request a delivery quote.</p>
            </article>

            <article className="step-card">
              <span>3</span>
              <h3>Submit your request</h3>
              <p>We review availability and follow up with pricing and next steps.</p>
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
      We offer pickup options and delivery quotes for events throughout Northeast Wisconsin.
      Delivery pricing is based on mileage, so a physical address is required when requesting
      a delivery quote.
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
    <p>Kind words from local events and rental setups.</p>
  </div>

  <div className="testimonials-grid">
    <article className="testimonial-card">
      <p className="testimonial-text">
        “Everything was clean, easy, and ready for pickup. The setup worked perfectly for our party.”
      </p>
      <p className="testimonial-name">Local event customer</p>
    </article>

    <article className="testimonial-card">
      <p className="testimonial-text">
        “The tables and chairs made our event planning much easier. Great communication and smooth process.”
      </p>
      <p className="testimonial-name">Fox Valley customer</p>
    </article>

    <article className="testimonial-card">
      <p className="testimonial-text">
        “The rental options were simple to choose from, and the extra games were a big hit with everyone.”
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