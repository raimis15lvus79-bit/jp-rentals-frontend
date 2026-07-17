import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <h2>JP Rentals and Events</h2>
          <p>
            Chairs, tables, games, concessions, and party rentals for Kaukauna,
            the Fox Valley, and Green Bay.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Footer navigation">
          <Link to="/rentals">Browse Rentals</Link>
          <Link to="/quote">Request Pricing</Link>
        </nav>

        <div className="site-footer__contact">
          <p>Serving Northeast Wisconsin</p>
          <a href="mailto:Jacobpaske08@gmail.com">Jacobpaske08@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}