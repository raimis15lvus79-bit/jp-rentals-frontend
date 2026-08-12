import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { useQuote } from '../../context/QuoteContext';
import './CheckoutSuccessPage.css';

export function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { items, rentalDates, fulfillmentType, deliveryAddress } = useQuote();
  const [hasValidQuote, setHasValidQuote] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/rentals', { replace: true });
      return;
    }
    setHasValidQuote(true);
  }, [items, navigate]);

  if (!hasValidQuote) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="checkout-success-page">
        <section className="checkout-success-card">
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="checkout-success-announcement"
          >
            <p className="checkout-success-eyebrow">Inquiry submitted</p>
            <h1>Your rental inquiry has been received.</h1>
          </div>

          <p className="checkout-success-lead">
            Thanks for sending your request. We'll review your rental items,
            event dates, delivery or pickup details, and any notes you included.
          </p>

          {items.length > 0 && (
            <div className="checkout-success-summary">
              <h2>Quote summary</h2>
              <dl className="checkout-success-details">
                <div className="checkout-success-block">
                  <dt>Rental items</dt>
                  <dd>
                    {items.length} item{items.length === 1 ? '' : 's'} ·{' '}
                    {items.reduce((total, item) => total + item.quantity, 0)} total piece
                    {items.reduce((total, item) => total + item.quantity, 0) === 1 ? '' : 's'}
                  </dd>
                </div>

                <div className="checkout-success-block">
                  <dt>Rental dates</dt>
                  <dd>
                    {rentalDates.start || 'Not selected'} to{' '}
                    {rentalDates.end || 'Not selected'}
                  </dd>
                </div>

                <div className="checkout-success-block">
                  <dt>Fulfillment</dt>
                  <dd>{fulfillmentType === 'delivery' ? 'Delivery quote' : 'Pickup'}</dd>
                </div>

                {fulfillmentType === 'delivery' && deliveryAddress && (
                  <div className="checkout-success-block">
                    <dt>Delivery address</dt>
                    <dd>{deliveryAddress}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

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