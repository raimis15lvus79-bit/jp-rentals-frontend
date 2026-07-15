import { useMemo, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './CheckoutPage.css';

export function CheckoutPage() {
  const {
    items,
    rentalDates,
    fulfillmentType,
    deliveryAddress,
    clearQuote
  } = useQuote();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    notes: ''
  });

  const [status, setStatus] = useState('idle');

  const subtotalCents = useMemo(() => {
    return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  }, [items]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (items.length === 0) {
      setStatus('error');
      return;
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      await axios.post('/api/quotes', {
        customer: formData,
        rentalDates,
        fulfillmentType,
        deliveryAddress,
        items
      });

      clearQuote();
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        notes: ''
      });
      setStatus('success');
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setStatus('error');
    }
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <section className="checkout-header">
          <p className="checkout-eyebrow">Final step</p>
          <h1>Complete your inquiry</h1>
          <p>
            Submit your rental request and we’ll review availability, pricing, and send contract details by email.
          </p>
        </section>

        <div className="checkout-layout">
          <section className="checkout-main">
            <form className="checkout-form-card" onSubmit={handleSubmit}>
              <h2>Customer details</h2>

              <div className="checkout-fields">
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Event type
                  <input
                    type="text"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    placeholder="Birthday, graduation, wedding, church event"
                  />
                </label>

                <label className="full-width">
                  Event notes
                  <textarea
                    name="notes"
                    rows="5"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Share any important event details, setup needs, or timing notes."
                  />
                </label>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
              </button>

              {status === 'success' && (
                <p className="checkout-message success">
                  Your inquiry was sent successfully. We’ll follow up with availability and next steps.
                </p>
              )}

              {status === 'error' && (
                <p className="checkout-message error">
                  Please make sure your quote has items, and add a delivery address if you selected delivery.
                </p>
              )}
            </form>
          </section>

          <aside className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h2>Quote summary</h2>

              <div className="summary-row">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="summary-row">
                <span>Dates</span>
                <span>
                  {rentalDates.start || 'Not selected'} - {rentalDates.end || 'Not selected'}
                </span>
              </div>

              <div className="summary-row">
                <span>Fulfillment</span>
                <span>{fulfillmentType === 'delivery' ? 'Delivery quote' : 'Pickup'}</span>
              </div>

              {fulfillmentType === 'delivery' && (
                <div className="summary-row">
                  <span>Address</span>
                  <span>{deliveryAddress || 'Not provided'}</span>
                </div>
              )}

              <div className="checkout-items">
                {items.length === 0 ? (
                  <p className="empty-summary">No items selected yet.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="checkout-item-row">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatMoney(item.priceCents * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="summary-row total-row">
                <span>Estimated subtotal</span>
                <strong>{formatMoney(subtotalCents)}</strong>
              </div>

              <p className="summary-note">
                Final pricing is confirmed after availability review and delivery quote review when needed.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}