import { useMemo, useState, type ChangeEvent } from 'react';
import { Footer } from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './QuotePage.css';

type QuoteErrors = {
  start?: string;
  end?: string;
  deliveryAddress?: string;
};

export function QuotePage() {
  const navigate = useNavigate();
  const {
    items,
    rentalDates,
    fulfillmentType,
    deliveryAddress,
    removeItem,
    updateQuantity,
    setRentalDates,
    setFulfillmentType,
    setDeliveryAddress
  } = useQuote();

  const [errors, setErrors] = useState<QuoteErrors>({});

  const hasItems = items.length > 0;

  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setRentalDates({
      ...rentalDates,
      [name]: value
    });

    setErrors((current) => ({
      ...current,
      [name]: undefined
    }));
  }

  function handleFulfillmentChange(event: ChangeEvent<HTMLInputElement>) {
    setFulfillmentType(event.target.value as 'pickup' | 'delivery');

    if (event.target.value === 'pickup') {
      setErrors((current) => ({
        ...current,
        deliveryAddress: undefined
      }));
    }
  }

  function handleDeliveryAddressChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDeliveryAddress(event.target.value);

    setErrors((current) => ({
      ...current,
      deliveryAddress: undefined
    }));
  }

  function handleContinue() {
    if (!hasItems) return;

    const nextErrors: QuoteErrors = {};

    if (!rentalDates.start) {
      nextErrors.start = 'Please select a start date.';
    }

    if (!rentalDates.end) {
      nextErrors.end = 'Please select an end date.';
    }

    if (
      rentalDates.start &&
      rentalDates.end &&
      rentalDates.end < rentalDates.start
    ) {
      nextErrors.end = 'End date must be the same as or after the start date.';
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      nextErrors.deliveryAddress =
        'Please enter the full delivery address for your quote.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    navigate('/checkout');
  }

  return (
    <>
      <Header />

      <main className="quote-page">
        <section className="quote-header">
          <p className="quote-eyebrow">Your quote</p>
          <h1>Review your rentals and event details.</h1>
          <p>
            Confirm your items, choose pickup or delivery, and continue to submit your request.
          </p>
        </section>

        {!hasItems ? (
          <section className="quote-empty-state">
            <h2>Your quote is empty.</h2>
            <p>
              Browse rentals and add items to your quote before continuing.
            </p>
            <Link to="/rentals" className="primary-button">
              Browse Rentals
            </Link>
          </section>
        ) : (
          <section className="quote-layout">
            <div className="quote-main">
              <div className="quote-card">
                <h2>Rental items</h2>

                <div className="quote-items">
                  {items.map((item) => (
                    <article key={item.id} className="quote-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="quote-item__image"
                      />

                      <div className="quote-item__content">
                        <h3>{item.name}</h3>
                        <p>
                          {item.pricingLabel === 'Request pricing'
                            ? 'Request pricing'
                            : `${item.pricingLabel} ${formatMoney(item.priceCents)}`}
                        </p>

                        <div className="quote-item__controls">
                          <label>
                            Quantity
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) =>
                                updateQuantity(item.id, event.target.value)
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="text-button"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="quote-card">
                <h2>Event details</h2>

                <div className="quote-form-grid">
                  <label>
                    Start date
                    <input
                      type="date"
                      name="start"
                      value={rentalDates.start}
                      onChange={handleDateChange}
                      className={errors.start ? 'quote-input-error' : ''}
                      aria-invalid={Boolean(errors.start)}
                      aria-describedby={errors.start ? 'quote-start-error' : undefined}
                    />
                    {errors.start && (
                      <p id="quote-start-error" className="quote-field-error">
                        {errors.start}
                      </p>
                    )}
                  </label>

                  <label>
                    End date
                    <input
                      type="date"
                      name="end"
                      value={rentalDates.end}
                      onChange={handleDateChange}
                      className={errors.end ? 'quote-input-error' : ''}
                      aria-invalid={Boolean(errors.end)}
                      aria-describedby={errors.end ? 'quote-end-error' : undefined}
                    />
                    {errors.end && (
                      <p id="quote-end-error" className="quote-field-error">
                        {errors.end}
                      </p>
                    )}
                  </label>
                </div>

                <fieldset className="quote-fulfillment">
                  <legend>Pickup or delivery</legend>

                  <label className="quote-radio">
                    <input
                      type="radio"
                      name="fulfillmentType"
                      value="pickup"
                      checked={fulfillmentType === 'pickup'}
                      onChange={handleFulfillmentChange}
                    />
                    Pickup
                  </label>

                  <label className="quote-radio">
                    <input
                      type="radio"
                      name="fulfillmentType"
                      value="delivery"
                      checked={fulfillmentType === 'delivery'}
                      onChange={handleFulfillmentChange}
                    />
                    Quote for delivery
                  </label>
                </fieldset>

                {fulfillmentType === 'delivery' && (
                  <label className="quote-address-field">
                    Delivery address
                    <textarea
                      rows={4}
                      value={deliveryAddress}
                      onChange={handleDeliveryAddressChange}
                      className={errors.deliveryAddress ? 'quote-input-error' : ''}
                      aria-invalid={Boolean(errors.deliveryAddress)}
                      aria-describedby={
                        errors.deliveryAddress ? 'quote-delivery-error' : undefined
                      }
                      placeholder="Enter the full delivery address for your quote."
                    />
                    {errors.deliveryAddress && (
                      <p id="quote-delivery-error" className="quote-field-error">
                        {errors.deliveryAddress}
                      </p>
                    )}
                    <p className="quote-note">
                      A physical address is required for delivery quotes because delivery pricing is based on mileage.
                    </p>
                  </label>
                )}
              </div>
            </div>

            <aside className="quote-sidebar">
              <div className="quote-card">
                <h2>Quote summary</h2>

                <ul className="quote-summary-list">
                  <li>
                    {items.length} rental item{items.length === 1 ? '' : 's'} selected
                  </li>
                  <li>
                    Total quantity: {totalQuantity}
                  </li>
                  <li>
                    Dates:{' '}
                    {rentalDates.start && rentalDates.end
                      ? `${rentalDates.start} to ${rentalDates.end}`
                      : 'Not selected yet'}
                  </li>
                  <li>
                    Fulfillment:{' '}
                    {fulfillmentType === 'delivery' ? 'Delivery quote' : 'Pickup'}
                  </li>
                </ul>

                <p>
                  Final pricing and availability will be confirmed after your inquiry is reviewed.
                </p>

                <button
                  type="button"
                  className="primary-button quote-continue-button"
                  onClick={handleContinue}
                >
                  Continue to Checkout
                </button>

                <Link to="/rentals" className="secondary-button quote-back-link">
                  Add More Rentals
                </Link>
              </div>
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}