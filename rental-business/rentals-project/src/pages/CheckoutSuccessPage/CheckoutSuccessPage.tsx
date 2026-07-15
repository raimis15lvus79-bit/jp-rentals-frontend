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
          <h1>Your rental request has been submitted.</h1>
          <p>
            Thanks for reaching out to JP Rentals and Events. We’ll review your request, confirm availability, and follow up by email with the next steps.
          </p>

          <div className="checkout-success-steps">
            <h2>What happens next</h2>
            <ul>
              <li>We review your requested rentals and event details.</li>
              <li>We confirm availability and delivery or pickup details.</li>
              <li>We send pricing and contract information by email.</li>
            </ul>
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