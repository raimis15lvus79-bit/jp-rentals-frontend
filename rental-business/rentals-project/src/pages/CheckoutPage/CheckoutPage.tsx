import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Header } from '../../components/Header/Header';
import { AddressAutocomplete } from '../../components/AddressAutocomplete/AddressAutocomplete';
import { useQuote } from '../../context/QuoteContext';
import './CheckoutPage.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  guestCount?: string;
  notes?: string;
  deliveryAddress?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
  items,
  rentalDates,
  setRentalDates,
  fulfillmentType,
  deliveryAddress,
  deliveryAddressDetails,
  setDeliveryAddress,
  setDeliveryAddressDetails,
  clearQuote,
} = useQuote();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    startDate: rentalDates.start || '',
    endDate: rentalDates.end || '',
    guestCount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const hasItems = items.length > 0;

  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const validateField = (name: string, value: string, nextFormData = formData) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Please enter your full name.';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
        return '';

      case 'email': {
        const emailValue = value.trim();
        if (!emailValue) return 'Please enter your email address.';
        if (!EMAIL_REGEX.test(emailValue)) return 'Please enter a valid email address.';
        return '';
      }

      case 'phone': {
        if (!value.trim()) return 'Phone number is required.';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Enter a valid phone number.';
        return '';
      }

      case 'eventType':
        if (!value) return 'Please select an event type.';
        return '';

      case 'startDate':
        if (!value) return 'Please choose a rental start date.';
        return '';

      case 'endDate':
        if (!value) return 'Please choose a rental end date.';
        if (nextFormData.startDate && value < nextFormData.startDate) {
          return 'End date must be on or after the start date.';
        }
        return '';

      case 'guestCount':
        if (!value.trim()) return '';
        if (!/^\d+$/.test(value.trim())) return 'Guest count must be a whole number.';
        if (Number(value.trim()) < 1) return 'Guest count must be at least 1.';
        return '';

      case 'notes':
        if (value.length > 1000) return 'Notes must be 1000 characters or less.';
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));

    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value) || undefined,
    }));

    if (name === 'startDate' && touched.endDate) {
      setErrors((current) => ({
        ...current,
        startDate: validateField('startDate', value) || undefined,
        endDate: validateField('endDate', formData.endDate, {
          ...formData,
          startDate: value,
        }) || undefined,
      }));
    }
  };

  const handleChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = event.target;

  const nextFormData = {
    ...formData,
    [name]: value,
  };

  setFormData(nextFormData);

  if (name === 'startDate' || name === 'endDate') {
    setRentalDates({
      ...rentalDates,
      [name === 'startDate' ? 'start' : 'end']: value,
    });
  }

  if (touched[name]) {
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value, nextFormData) || undefined,
    }));
  }

  if (name === 'startDate' && touched.endDate) {
    setErrors((current) => ({
      ...current,
      endDate: validateField('endDate', nextFormData.endDate, nextFormData) || undefined,
    }));
  }

  if (name === 'endDate' && touched.startDate) {
    setErrors((current) => ({
      ...current,
      endDate: validateField('endDate', value, nextFormData) || undefined,
    }));
  }

  if (submitError) {
    setSubmitError('');
  }
};

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: CheckoutErrors = {};
    setSubmitError('');

    const fullNameError = validateField('fullName', formData.fullName);
    if (fullNameError) nextErrors.fullName = fullNameError;

    const emailError = validateField('email', formData.email);
    if (emailError) nextErrors.email = emailError;

    const phoneError = validateField('phone', formData.phone);
    if (phoneError) nextErrors.phone = phoneError;

    const eventTypeError = validateField('eventType', formData.eventType);
    if (eventTypeError) nextErrors.eventType = eventTypeError;

    const startDateError = validateField('startDate', formData.startDate, formData);
    if (startDateError) nextErrors.startDate = startDateError;

    const endDateError = validateField('endDate', formData.endDate, formData);
    if (endDateError) nextErrors.endDate = endDateError;

    const guestCountError = validateField('guestCount', formData.guestCount);
    if (guestCountError) nextErrors.guestCount = guestCountError;

    const notesError = validateField('notes', formData.notes);
    if (notesError) nextErrors.notes = notesError;

    if (fulfillmentType === 'delivery') {
      if (!deliveryAddress.trim()) {
        nextErrors.deliveryAddress = 'Please enter a delivery address.';
      } else if (!deliveryAddressDetails?.placeId) {
        nextErrors.deliveryAddress = 'Please select a valid address from the suggestions.';
      }
    }

    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      eventType: true,
      startDate: true,
      endDate: true,
      guestCount: true,
      notes: true,
      deliveryAddress: fulfillmentType === 'delivery',
    });

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        eventType: formData.eventType,
        guestCount: formData.guestCount.trim(),
        notes: formData.notes.trim(),
      },
      quote: {
        items,
        rentalDates: {
          start: formData.startDate,
          end: formData.endDate,
        },
        fulfillmentType,
        deliveryAddress: deliveryAddress.trim(),
        deliveryAddressDetails,
      },
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
              <div className="checkout-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  minLength={2}
                  className={errors.fullName ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'checkout-fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="checkout-fullName-error" className="checkout-field-error" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={errors.email ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                />
                {errors.email && (
                  <p id="checkout-email-error" className="checkout-field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="checkout-field checkout-field-full">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={errors.phone ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                  placeholder="(920) 555-1234"
                />
                {errors.phone && (
                  <p id="checkout-phone-error" className="checkout-field-error" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <h2>Event details</h2>

            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label htmlFor="eventType">Event type</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={errors.eventType ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.eventType)}
                  aria-describedby={
                    errors.eventType
                      ? 'checkout-eventType-help checkout-eventType-error'
                      : 'checkout-eventType-help'
                  }
                >
                  <option value="">Select event type</option>
                  <option value="birthday-party">Birthday party</option>
                  <option value="graduation-party">Graduation party</option>
                  <option value="rummage-sale">Rummage sale</option>
                  <option value="family-gathering">Family gathering</option>
                  <option value="school-event">School event</option>
                  <option value="community-event">Community event</option>
                  <option value="other">Other</option>
                </select>
                <p id="checkout-eventType-help" className="checkout-field-help">
                  Choose the option that best matches the event for this rental.
                </p>
                {errors.eventType && (
                  <p id="checkout-eventType-error" className="checkout-field-error" role="alert">
                    {errors.eventType}
                  </p>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="guestCount">
                  Estimated guest count <span>(optional)</span>
                </label>
                <input
                  id="guestCount"
                  type="number"
                  name="guestCount"
                  min="1"
                  inputMode="numeric"
                  value={formData.guestCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.guestCount)}
                  aria-describedby={
                    errors.guestCount
                      ? 'checkout-guestCount-help checkout-guestCount-error'
                      : 'checkout-guestCount-help'
                  }
                />
                <p
                  id="checkout-guestCount-help"
                  className="checkout-field-help checkout-field-help-placeholder"
                >
                  &nbsp;
                </p>
                {errors.guestCount && (
                  <p id="checkout-guestCount-error" className="checkout-field-error" role="alert">
                    {errors.guestCount}
                  </p>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={errors.startDate ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.startDate)}
                  aria-describedby={errors.startDate ? 'checkout-startDate-error' : undefined}
                />
                {errors.startDate && (
                  <p id="checkout-startDate-error" className="checkout-field-error" role="alert">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="endDate">End date</label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min={formData.startDate || undefined}
                  className={errors.endDate ? 'checkout-input-error' : ''}
                  aria-invalid={Boolean(errors.endDate)}
                  aria-describedby={errors.endDate ? 'checkout-endDate-error' : undefined}
                />
                {errors.endDate && (
                  <p id="checkout-endDate-error" className="checkout-field-error" role="alert">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {fulfillmentType === 'delivery' && (
              <div className="checkout-field">
                <label htmlFor="deliveryAddress">Delivery address</label>
                <AddressAutocomplete
                  value={deliveryAddress}
                  onChange={(value) => {
                    setDeliveryAddress(value);

                    if (submitError) {
                      setSubmitError('');
                    }

                    if (errors.deliveryAddress) {
                      setErrors((current) => ({
                        ...current,
                        deliveryAddress: value.trim()
                          ? 'Please select a valid address from the suggestions.'
                          : 'Please enter a delivery address.',
                      }));
                    }
                  }}
                  onSelectAddress={(details) => {
                    setDeliveryAddressDetails(details);
                    setTouched((current) => ({
                      ...current,
                      deliveryAddress: true,
                    }));
                    setErrors((current) => ({
                      ...current,
                      deliveryAddress: undefined,
                    }));
                  }}
                  error={errors.deliveryAddress}
                  helpText="Enter the delivery location, then choose a suggested address if available."
                  placeholder="Enter delivery address"
                />
              </div>
            )}

            <label className="checkout-notes-field" htmlFor="notes">
              Notes <span>(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              value={formData.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={1000}
              className={errors.notes ? 'checkout-input-error' : ''}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={
                errors.notes
                  ? 'checkout-notes-help checkout-notes-error'
                  : 'checkout-notes-help'
              }
              placeholder="Share any location notes, event timing, or extra details."
            />
            <p id="checkout-notes-help" className="checkout-field-help">
              {formData.notes.length}/1000 characters
            </p>
            {errors.notes && (
              <p id="checkout-notes-error" className="checkout-field-error" role="alert">
                {errors.notes}
              </p>
            )}

            {submitError ? (
              <div className="checkout-error-message" role="alert">
                <p>{submitError}</p>
              </div>
            ) : null}

            {errors.deliveryAddress ? (
              <div className="checkout-error-message" role="alert">
                <p>{errors.deliveryAddress}</p>
              </div>
            ) : null}

            <div className="checkout-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Submitting inquiry...' : 'Submit Inquiry'}
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
                {formData.startDate || 'Not selected'} to {formData.endDate || 'Not selected'}
              </p>
            </div>

            <div className="checkout-summary-block">
              <h3>Fulfillment</h3>
              <p>{fulfillmentType === 'delivery' ? 'Delivery quote requested' : 'Customer pickup'}</p>
            </div>

            <div className="checkout-summary-block">
              <h3>Items</h3>
              <p>
                {items.length} item{items.length === 1 ? '' : 's'} selected · {totalQuantity} total
                piece{totalQuantity === 1 ? '' : 's'}
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
              After you submit, pricing, availability, and contract details will be confirmed by email.
            </p>
          </aside>
        </section>
      </main>
    </>
  );
}