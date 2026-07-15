import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          JP Rentals and Events
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rentals">Rentals</NavLink>
          <NavLink to="/quote">Request Pricing</NavLink>
        </nav>
      </div>
    </header>
  );
}