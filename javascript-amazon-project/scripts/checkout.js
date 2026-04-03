import { cart } from '../data/cart.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';

export function updateCheckoutItemsLink() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.return-to-home-link').textContent =
    `${cartQuantity} item${cartQuantity === 1 ? '' : 's'}`;
}

async function loadPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
  
  updateCheckoutItemsLink();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();