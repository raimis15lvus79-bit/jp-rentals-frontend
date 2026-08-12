import { useMemo, useState, type ChangeEvent } from 'react';
import { Footer } from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import { AddressAutocomplete } from '../../components/AddressAutocomplete/AddressAutocomplete';
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
    deliveryAddressDetails,
    removeItem,
    updateQuantity,
    setRentalDates,
    setFulfillmentType,
    setDeliveryAddress,
    setDeliveryAddressDetails,
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
      [name]: value,
    });

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }

  function handleFulfillmentChange(event: ChangeEvent<HTMLInputElement>) {
    const nextType = event.target.value as 'pickup' | 'delivery';

    setFulfillmentType(nextType);

    if (nextType === 'pickup') {
      setErrors((current) => ({
        ...current,
        deliveryAddress: undefined,
      }));
    }
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

    if (fulfillmentType === 'delivery') {
      if (!deliveryAddress.trim()) {
        nextErrors.deliveryAddress = 'Please enter a delivery address.';
      } else if (!deliveryAddressDetails?.placeId) {
        nextErrors.deliveryAddress =
          'Please choose a valid delivery address from the Google suggestions.';
      }
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
          <p className="quote-eyebrow">Request pricing</p>
          <h1>Review your rentals and rental details.</h1>
          <p>
            Confirm your rental items, choose pickup or delivery, and continue to
            submit your request. We'll review availability and follow up with pricing
            and next steps.
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

                <div className="quote-mobile-bar">
                  <div className="quote-mobile-bar__summary">
                    <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
                    <span>{totalQuantity} total</span>
                  </div>

                  <button
                    type="button"
                    className="primary-button quote-mobile-bar__button"
                    aria-label="Continue to checkout from mobile summary"
                    onClick={handleContinue}
                    disabled={!hasItems}
                    aria-disabled={!hasItems}
                  >
                    Continue
                  </button>
                </div>

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
                          <label className="quote-quantity-field">
                            Quantity
                            <div className="quote-quantity-stepper">
                              <button
                                type="button"
                                className="quote-quantity-button"
                                aria-label={`Decrease quantity for ${item.name}`}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(event) => {
                                  const nextQuantity = event.target.valueAsNumber;

                                  if (Number.isNaN(nextQuantity)) {
                                    return;
                                  }

                                  updateQuantity(item.id, nextQuantity);
                                }}
                              />

                              <button
                                type="button"
                                className="quote-quantity-button"
                                aria-label={`Increase quantity for ${item.name}`}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
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
                <h2>Rental details</h2>

                <div className="quote-form-grid">
                  <label className="quote-field quote-field--half">
                    Start date
                    <input
                      type="date"
                      name="start"
                      value={rentalDates.start}
                      onChange={handleDateChange}
                      className={errors.start ? 'quote-input-error' : ''}
                      aria-invalid={Boolean(errors.start)}
                      aria-describedby={
                        errors.start
                          ? 'quote-start-help quote-start-error'
                          : 'quote-start-help'
                      }
                    />
                    <p id="quote-start-help" className="quote-help-text">
                      Choose the first day you need the rentals.
                    </p>
                    {errors.start && (
                      <p id="quote-start-error" className="quote-field-error">
                        {errors.start}
                      </p>
                    )}
                  </label>

                  <label className="quote-field quote-field--half">
                    End date
                    <input
                      type="date"
                      name="end"
                      value={rentalDates.end}
                      min={rentalDates.start || undefined}
                      onChange={handleDateChange}
                      className={errors.end ? 'quote-input-error' : ''}
                      aria-invalid={Boolean(errors.end)}
                      aria-describedby={
                        errors.end
                          ? 'quote-end-help quote-end-error'
                          : 'quote-end-help'
                      }
                    />
                    <p id="quote-end-help" className="quote-help-text">
                      Choose the last day you need the rentals.
                    </p>
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
                    <AddressAutocomplete
                      value={deliveryAddress}
                      onChange={(value) => {
                        setDeliveryAddress(value);
                        setDeliveryAddressDetails(null);
                        setErrors((current) => ({
                          ...current,
                          deliveryAddress: undefined,
                        }));
                      }}
                      onSelectAddress={(selection) => {
                        if (selection) {
                          setDeliveryAddress(selection.formattedAddress);
                          setDeliveryAddressDetails({
                            formattedAddress: selection.formattedAddress,
                            placeId: selection.placeId,
                            lat: selection.lat,
                            lng: selection.lng,
                          });
                          setErrors((current) => ({
                            ...current,
                            deliveryAddress: undefined,
                          }));
                        } else {
                          setDeliveryAddressDetails(null);
                        }
                      }}
                      error={errors.deliveryAddress}
                      helpText="Start typing and choose the full delivery address from the suggestions."
                      placeholder="Enter the full delivery address for your quote"
                    />
                  </label>
                )}
              </div>

              <div className="quote-card quote-process-card">
                <h2>What happens next?</h2>
                <ul className="quote-process-list">
                  <li>We review your rental items and rental details.</li>
                  <li>We confirm availability for your requested dates.</li>
                  <li>We follow up with pricing and pickup or delivery details.</li>
                </ul>
              </div>
            </div>

            <aside className="quote-sidebar">
              <div className="quote-card">
                <h2>Quote summary</h2>

                <ul className="quote-summary-list">
                  <li>
                    {items.length} rental item{items.length === 1 ? '' : 's'} selected
                  </li>
                  <li>Total quantity: {totalQuantity}</li>
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
                  Final pricing and availability will be confirmed after your request is reviewed.
                </p>

                {Object.keys(errors).length > 0 && (
                  <div className="quote-error-summary" role="alert">
                    Please fix the highlighted fields before continuing.
                  </div>
                )}

                <button
                  type="button"
                  className="primary-button quote-continue-button"
                  aria-label="Continue to Checkout from quote summary"
                  onClick={handleContinue}
                  disabled={!hasItems}
                  aria-disabled={!hasItems}
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