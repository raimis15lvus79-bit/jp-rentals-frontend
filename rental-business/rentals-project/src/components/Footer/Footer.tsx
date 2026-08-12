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
          <p className="site-footer__service-area">Serving Northeast Wisconsin</p>
        </div>

        <div className="site-footer__cta">
          <Link to="/rentals" className="footer-btn">
            Browse Rentals
          </Link>
          <Link to="/quote" className="footer-btn footer-btn--primary">
            Request Pricing
          </Link>
          <a href="mailto:jacobfoxvalley@gmail.com" className="footer-btn">
            jacobfoxvalley@gmail.com
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 JP Rentals and Events. All rights reserved.</p>
      </div>
    </footer>
  );
}