import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          JP Rentals and Events
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/rentals">Rentals</Link>
          <Link to="/quote">Request Pricing</Link>
        </nav>
      </div>
    </header>
  );
}