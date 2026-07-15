import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import './CheckoutSuccessPage.css';

export function CheckoutSuccessPage() {
  return (
    <>
      <Header />

      <main className="checkout-success-page">
        <section className="checkout-success-card">
          <p className="checkout-success-eyebrow">Inquiry received</p>
          <h1>Thanks — your rental inquiry has been submitted.</h1>
          <p className="checkout-success-intro">
            We’ll review your requested rentals, check availability, and follow up
            by email with pricing and next steps.
          </p>

          <div className="checkout-success-details">
            <div className="checkout-success-detail">
              <span className="checkout-success-label">What happens next</span>
              <p>We review your rental items, dates, and event details.</p>
            </div>

            <div className="checkout-success-detail">
              <span className="checkout-success-label">Pickup or delivery</span>
              <p>We confirm pickup plans or delivery details based on your request.</p>
            </div>

            <div className="checkout-success-detail">
              <span className="checkout-success-label">Pricing follow-up</span>
              <p>You’ll receive pricing and any next-step details by email.</p>
            </div>
          </div>

          <div className="checkout-success-actions">
            <Link to="/rentals" className="primary-button">
              Browse More Rentals
            </Link>

            <Link to="/" className="secondary-button">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}