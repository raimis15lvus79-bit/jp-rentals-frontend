import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <>
      <Header />

      <main className="not-found-page">
        <section className="not-found-card">
          <p className="not-found-eyebrow">404 error</p>
          <h1>We can’t find that page.</h1>
          <p className="not-found-lead">
            The page may have moved, the link may be broken, or the URL may be incorrect.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="primary-button">
              Back to Home
            </Link>

            <Link to="/rentals" className="secondary-button">
              Browse Rentals
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}