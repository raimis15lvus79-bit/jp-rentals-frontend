import { formatMoney } from '../../utils/money';
import dayjs from 'dayjs';
import axios from 'axios';

export function DeliveryOptions({cartItem, deliveryOptions, loadCart}) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">
          Choose a delivery option:
        </div>
          
    {deliveryOptions.map((deliveryOption) => {
      let priceString = 'FREE Shipping';
          
      if (deliveryOption.priceCents > 0) {
      priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

      const updateDeliveryOption = async () => {
        await axios.put(`/api/cart-items/${cartItem.productId}`, {
          deliveryOptionId: deliveryOption.id
        });
        await loadCart();
      };
           
      return (
        <div key={deliveryOption.id} className="delivery-option"
        onClick={updateDeliveryOption}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateDeliveryOption(); } }}
        role="radio"
        aria-checked={deliveryOption.id === cartItem.deliveryOptionId}
        tabIndex={0}>
          <input
          type="radio"
          checked={deliveryOption.id === cartItem.deliveryOptionId}
          onChange={updateDeliveryOption}
          className="delivery-option-input"
          name={`delivery-option-${cartItem.productId}`}
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
);
}