import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { formatMoney } from '../utils/money';
import './checkout-header.css';
import './CheckoutPage.css';

export function CheckoutPage({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    document.title = 'Checkout';

    axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
      .then((response) => {
        setDeliveryOptions(response.data);
      });

    axios.get('/api/payment-summary')
      .then((response) => {
        setPaymentSummary(response.data);
      });
  }, []);

  return (
    <>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" alt="Logo" />
              <img className="mobile-logo" src="images/mobile-logo.png" alt="Mobile logo" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {cart.length} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" alt="Checkout lock" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 && cart.map((cartItem) => {
              const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
                return deliveryOption.id === cartItem.selectedDeliveryOptionId;
              });

              return (
                <div key={cartItem.productId} className="cart-item-container">
                  <div className="delivery-date">
                    Delivery date:{' '}
                    {selectedDeliveryOption
                      ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')
                      : 'Loading...'}
                  </div>

                  <div className="cart-item-details-grid">
                    <img
                      className="product-image"
                      src={cartItem.product.image}
                      alt={cartItem.product.name}
                    />

                    <div className="cart-item-details">
                      <div className="product-name">
                        {cartItem.product.name}
                      </div>

                      <div className="product-price">
                        {formatMoney(cartItem.product.priceCents)}
                      </div>

                      <div className="product-quantity">
                        <span>
                          Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                        </span>
                        <span className="update-quantity-link link-primary">
                          Update
                        </span>
                        <span className="delete-quantity-link link-primary">
                          Delete
                        </span>
                      </div>
                    </div>

                    <div className="delivery-options">
                      <div className="delivery-options-title">
                        Choose a delivery option:
                      </div>

                      {deliveryOptions.map((deliveryOption) => {
                        let priceString = 'FREE Shipping';

                        if (deliveryOption.priceCents > 0) {
                          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
                        }

                        return (
                          <div key={deliveryOption.id} className="delivery-option">
                            <input
                              type="radio"
                              checked={deliveryOption.id === cartItem.selectedDeliveryOptionId}
                              className="delivery-option-input"
                              name={`delivery-option-${cartItem.productId}`}
                              onChange={() => {}}
                            />

                            <div>
                              <div className="delivery-option-date">
                                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                              </div>

                              <div className="delivery-option-price">
                                {priceString}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="payment-summary">
  <div className="payment-summary-title">Payment Summary</div>

  {paymentSummary && (
    <> 
      <div className="payment-summary-row">
        <div>Items ({paymentSummary?.totalItems || 0}):</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.productCostCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.shippingCostCents)}
        </div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax ({paymentSummary?.taxRatePercent || 0}%):</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.taxCents)}
        </div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.totalCostCents)}
        </div>
      </div>

      <button className="place-order-button button-primary">
        Place your order
      </button>
    </>
  )}
</div>