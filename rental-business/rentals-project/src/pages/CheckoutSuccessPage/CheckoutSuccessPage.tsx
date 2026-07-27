import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import './CheckoutSuccessPage.css';

export function CheckoutSuccessPage() {
  return (
    <>
      <Header />

      <main className="checkout-success-page">
        <section className="checkout-success-card">
          <p className="checkout-success-eyebrow">Inquiry submitted</p>
          <h1>Your rental inquiry has been received.</h1>
          <p className="checkout-success-lead">
            Thanks for sending your request. We’ll review your rental items,
            event dates, delivery or pickup details, and any notes you included.
          </p>

          <div className="checkout-success-details">
            <div className="checkout-success-block">
              <h2>What happens next</h2>
              <ol className="checkout-success-steps">
                <li>We review your requested rentals, dates, and event details.</li>
                <li>We confirm availability, pricing, and delivery or pickup options.</li>
                <li>We follow up by email with the next steps to finalize your rental.</li>
              </ol>
            </div>

            <div className="checkout-success-block">
              <h2>Expected follow-up</h2>
              <p>
                You should receive a follow-up email soon with pricing,
                availability, and any details needed to move forward.
              </p>
              <p>
                If delivery is needed, your final quote will include
                mileage-based delivery details after the address is reviewed.
              </p>
            </div>
          </div>

          <p className="checkout-success-note">
            Be sure to check your email for the next update about your rental request.
          </p>

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

      <Footer />
    </>
  );
}