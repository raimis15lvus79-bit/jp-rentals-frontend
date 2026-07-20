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
          <h1>Your rental inquiry was submitted successfully.</h1>
          <p className="checkout-success-lead">
            We’ve received your request and will review pricing, availability,
            delivery or pickup details, and any event notes you included.
          </p>

          <div className="checkout-success-details">
            <div className="checkout-success-block">
              <h2>What happens next</h2>
              <p>
                We’ll follow up by email with availability confirmation, pricing,
                and any next steps needed to finalize your rental.
              </p>
            </div>

            <div className="checkout-success-block">
              <h2>Before your event</h2>
              <p>
                If delivery is needed, your final quote will include mileage-based
                delivery details once the address is reviewed.
              </p>
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

      <Footer />
    </>
  );
}