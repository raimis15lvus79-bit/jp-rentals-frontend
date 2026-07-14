import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import { CheckoutHeader } from './CheckoutHeader';
import './CheckoutPage.css';

export function CheckoutPage({ cart = [], loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [deliveryRes, paymentRes] = await Promise.all([
          axios.get('/api/delivery-options?expand=estimatedDeliveryTime'),
          axios.get('/api/payment-summary')
        ]);
        setDeliveryOptions(deliveryRes.data);
        setPaymentSummary(paymentRes.data);
      } catch (error) {
        console.error('Failed to fetch checkout data:', error);
        setFetchError('Something went wrong loading your checkout. Please try again later.');
      }
    };

    fetchCheckoutData();
  }, [cart]);

  return (
    <>
      <CheckoutHeader cart={cart} />

      {fetchError && (
        <div className="checkout-error-banner">
          {fetchError}
        </div>
      )}

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />
          
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}
