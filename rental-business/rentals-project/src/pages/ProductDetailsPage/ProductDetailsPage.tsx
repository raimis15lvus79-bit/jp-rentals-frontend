import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { sampleProducts } from '../../data/sampleProducts';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './ProductDetailsPage.css';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useQuote();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(
    () => sampleProducts.find((item) => item.id === id),
    [id]
  );

  if (!product) {
    return (
      <>
        <Header />
        <main className="product-details-page">
          <h1>Rental not found</h1>
          <p>We could not find that rental item.</p>
          <Link to="/rentals">Back to rentals</Link>
        </main>
      </>
    );
  }

  function handleAddToQuote() {
    addItem(product, quantity);
  }

  return (
    <>
      <Header />
      <main className="product-details-page">
        <section className="product-details-card">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{formatMoney(product.priceCents)}</p>

            <ul className="product-notes">
              <li>Request pricing and availability for your event date.</li>
              <li>Pickup and delivery quote options available.</li>
              <li>Final contract is completed after inquiry review.</li>
            </ul>

            <label className="quantity-field">
              Quantity
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>

            <div className="product-actions">
              <button type="button" className="primary-button" onClick={handleAddToQuote}>
                Add to quote
              </button>
              <Link to="/quote" className="secondary-button">
                View quote
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}