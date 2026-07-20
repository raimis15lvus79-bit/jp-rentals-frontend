import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import './CheckoutPage.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutErrors = {
  fullName?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
  deliveryAddress?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    rentalDates,
    fulfillmentType,
    deliveryAddress,
    clearQuote
  } = useQuote();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    eventType: '',
    guestCount: '',
    notes: ''
  });

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const hasItems = items.length > 0;

  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    if (name === 'fullName' || name === 'email') {
      setErrors((current) => ({
        ...current,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: CheckoutErrors = {};
    setSubmitError('');

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const emailValue = formData.email.trim();

    if (!emailValue) {
    nextErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(emailValue)) {
    nextErrors.email = 'Please enter a valid email address, like name@example.com.';
    }

    if (!rentalDates.start) {
      nextErrors.startDate = 'Please return to the quote page and choose a start date.';
    }

    if (!rentalDates.end) {
      nextErrors.endDate = 'Please return to the quote page and choose an end date.';
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      nextErrors.deliveryAddress =
        'Please return to the quote page and enter a delivery address.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields and details before submitting.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        eventType: formData.eventType,
        guestCount: formData.guestCount,
        notes: formData.notes
      },
      quote: {
        items,
        rentalDates: {
          start: rentalDates.start,
          end: rentalDates.end
        },
        fulfillmentType,
        deliveryAddress
      }
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      clearQuote();
      navigate('/checkout/success');
    } catch (error) {
      console.error(error);
      setSubmitError('There was a problem submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasItems) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <section className="checkout-empty-state">
            <h1>No rental items in your quote.</h1>
            <p>Add rental items before moving to checkout.</p>
            <Link to="/rentals" className="primary-button">
              Browse Rentals
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="checkout-page">
        <section className="checkout-header">
          <p className="checkout-eyebrow">Checkout</p>
          <h1>Submit your rental inquiry.</h1>
          <p>
            Enter your contact information and event details. Final pricing,
            availability, and contract details will be confirmed by email.
          </p>
        </section>

        <section className="checkout-layout">
          <form className="checkout-form-card" onSubmit={handleSubmit} noValidate>
            <h2>Contact details</h2>

            <div className="checkout-form-grid">
              <label>
                Full name
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'checkout-fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="checkout-fullName-error" className="checkout-field-error">
                    {errors.fullName}
                  </p>
                )}
              </label>

              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                />
                {errors.email && (
                  <p id="checkout-email-error" className="checkout-field-error">
                    {errors.email}
                  </p>
                )}
              </label>

              <label>
                Event type
                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  placeholder="Birthday party, wedding, graduation, etc."
                />
              </label>

              <label>
                Estimated guest count
                <input
                  type="number"
                  name="guestCount"
                  min="1"
                  value={formData.guestCount}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="checkout-notes-field">
              Notes
              <textarea
                name="notes"
                rows={5}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Share any setup notes, event timing, or extra details."
              />
            </label>

            {submitError ? (
              <p className="checkout-error-message" role="alert">
                {submitError}
              </p>
            ) : null}

            {(errors.startDate || errors.endDate || errors.deliveryAddress) && (
              <div className="checkout-error-message" role="alert">
                {errors.startDate && <p>{errors.startDate}</p>}
                {errors.endDate && <p>{errors.endDate}</p>}
                {errors.deliveryAddress && <p>{errors.deliveryAddress}</p>}
              </div>
            )}

            <div className="checkout-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>

              <Link to="/quote" className="secondary-button">
                Back to Quote
              </Link>
            </div>
          </form>

          <aside className="checkout-summary-card">
            <h2>Quote summary</h2>

            <div className="checkout-summary-block">
              <h3>Rental dates</h3>
              <p>
                {rentalDates.start || 'Not selected'} to{' '}
                {rentalDates.end || 'Not selected'}
              </p>
            </div>

            <div className="checkout-summary-block">
              <h3>Fulfillment</h3>
              <p>{fulfillmentType === 'delivery' ? 'Quote for delivery' : 'Pickup'}</p>
            </div>

            <div className="checkout-summary-block">
              <h3>Totals</h3>
              <p>
                {items.length} rental item{items.length === 1 ? '' : 's'} · Total quantity: {totalQuantity}
              </p>
            </div>

            {fulfillmentType === 'delivery' && (
              <div className="checkout-summary-block">
                <h3>Delivery address</h3>
                <p>{deliveryAddress || 'Not provided'}</p>
              </div>
            )}

            <div className="checkout-summary-block">
              <h3>Selected rentals</h3>
              <ul className="checkout-item-list">
                {items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="checkout-note">
              After submission, you can review the request, send pricing, and
              complete the contract by email.
            </p>
          </aside>
        </section>
      </main>
    </>
  );
}