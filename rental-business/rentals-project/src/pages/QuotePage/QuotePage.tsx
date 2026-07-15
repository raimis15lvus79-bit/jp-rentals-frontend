import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './QuotePage.css';

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

  const hasItems = items.length > 0;

  function handleDateChange(event) {
    const { name, value } = event.target;

    setRentalDates((currentDates) => ({
      ...currentDates,
      [name]: value
    }));
  }

  function handleContinue() {
    if (!hasItems) {
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
          <h1>Review your rental items and event details.</h1>
          <p>
            Select your rental dates, choose pickup or delivery, and confirm your items before submitting your request.
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
                        <p>{item.pricingLabel === 'Request pricing'
                          ? 'Request pricing'
                          : `${item.pricingLabel} ${formatMoney(item.priceCents)}`}</p>

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
                    />
                  </label>

                  <label>
                    End date
                    <input
                      type="date"
                      name="end"
                      value={rentalDates.end}
                      onChange={handleDateChange}
                    />
                  </label>
                </div>

                <div className="quote-fulfillment">
                  <p>Fulfillment</p>

                  <label className="quote-radio">
                    <input
                      type="radio"
                      name="fulfillmentType"
                      value="pickup"
                      checked={fulfillmentType === 'pickup'}
                      onChange={(event) => setFulfillmentType(event.target.value)}
                    />
                    Pickup
                  </label>

                  <label className="quote-radio">
                    <input
                      type="radio"
                      name="fulfillmentType"
                      value="delivery"
                      checked={fulfillmentType === 'delivery'}
                      onChange={(event) => setFulfillmentType(event.target.value)}
                    />
                    Quote for delivery
                  </label>
                </div>

                {fulfillmentType === 'delivery' && (
                  <label className="quote-address-field">
                    Delivery address
                    <textarea
                      rows="4"
                      value={deliveryAddress}
                      onChange={(event) => setDeliveryAddress(event.target.value)}
                      placeholder="Enter the full delivery address for your quote."
                    />
                  </label>
                )}

                <p className="quote-note">
                  Delivery quotes require a physical address because pricing is based on mileage.
                </p>
              </div>
            </div>

            <aside className="quote-sidebar">
              <div className="quote-card">
                <h2>Quote summary</h2>
                <p>{items.length} rental item{items.length === 1 ? '' : 's'} selected</p>
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
    </>
  );
}