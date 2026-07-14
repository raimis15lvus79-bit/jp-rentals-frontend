import { Link } from 'react-router-dom';
import './header.css';

type HeaderProps = {
  cart: { 
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
  };

export function Header({cart}:  HeaderProps) {
  let totalQuantity = 0;

cart.forEach((cartItem) => {
  totalQuantity += cartItem.quantity;
});

  return (
    <div className="header">
        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo"
              src="images/logo-white.png" alt="JP Rentals and Events" />
            <img className="mobile-logo"
              src="images/mobile-logo-white.png" alt="JP Rentals and Events" />
          </Link>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" />

          <button className="search-button">
            <img className="search-icon" src="images/icons/search-icon.png" alt="Search" />
          </button>
        </div>

        <div className="right-section">
          <Link className="orders-link header-link" to="/orders">

            <span className="orders-text">Orders</span>
          </Link>

          <Link className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src="images/icons/cart-icon.png" alt="Cart" />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
      </div>

  );
}