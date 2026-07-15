import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './QuotePage.css';

export function QuotePage() {
  const {
    items,
    rentalDates,
    fulfillmentType,
    deliveryAddress,
    setRentalDates,
    setFulfillmentType,
    setDeliveryAddress,
    updateQuantity,
    removeItem
  } = useQuote();

  const subtotalCents = items.reduce((sum, item) => {
    return sum + item.priceCents * item.quantity;
  }, 0);

  return (
    <>
      <Header />
      <main className="quote-page">
        <section className="quote-header">
          <p className="quote-eyebrow">Your rental request</p>
          <h1>Build your quote</h1>
          <p>
            Review your rental items, select dates, and choose pickup or request a delivery quote.
          </p>
        </section>

        <div className="quote-layout">
          <section className="quote-main">
            <div className="quote-card">
              <h2>Rental details</h2>

              <div className="quote-fields">
                <label>
                  Start date
                  <input
                    type="date"
                    value={rentalDates.start}
                    onChange={(event) =>
                      setRentalDates((current) => ({
                        ...current,
                        start: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  End date
                  <input
                    type="date"
                    value={rentalDates.end}
                    onChange={(event) =>
                      setRentalDates((current) => ({
                        ...current,
                        end: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  Pickup or delivery
                  <select
                    value={fulfillmentType}
                    onChange={(event) => setFulfillmentType(event.target.value)}
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Quote for delivery</option>
                  </select>
                </label>

                {fulfillmentType === 'delivery' && (
                  <label className="full-width">
                    Delivery address
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(event) => setDeliveryAddress(event.target.value)}
                      placeholder="Enter full address for delivery quote"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="quote-card">
              <div className="quote-card-header">
                <h2>Selected items</h2>
                <Link to="/rentals" className="secondary-button">
                  Add more rentals
                </Link>
              </div>

              {items.length === 0 ? (
                <div className="empty-quote">
                  <p>No rental items added yet.</p>
                  <Link to="/rentals" className="primary-button">
                    Browse Rentals
                  </Link>
                </div>
              ) : (
                <div className="quote-items">
                  {items.map((item) => (
                    <article key={item.id} className="quote-item">
                      <div className="quote-item__image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="quote-item__info">
                        <h3>{item.name}</h3>
                        <p>{formatMoney(item.priceCents)} each</p>
                      </div>

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

                        <p className="quote-item__line-total">
                          {formatMoney(item.priceCents * item.quantity)}
                        </p>

                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="quote-sidebar">
            <div className="quote-card">
              <h2>Quote summary</h2>

              <div className="summary-row">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="summary-row">
                <span>Fulfillment</span>
                <span>{fulfillmentType === 'delivery' ? 'Delivery quote' : 'Pickup'}</span>
              </div>

              <div className="summary-row total-row">
                <span>Estimated subtotal</span>
                <strong>{formatMoney(subtotalCents)}</strong>
              </div>

              <p className="summary-note">
                Final pricing and availability will be confirmed after your inquiry is reviewed.
              </p>

              <Link
                to="/checkout"
                className={`primary-button ${items.length === 0 ? 'disabled-link' : ''}`}
                onClick={(event) => {
                  if (items.length === 0) {
                    event.preventDefault();
                  }
                }}
              >
                Continue to checkout
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}