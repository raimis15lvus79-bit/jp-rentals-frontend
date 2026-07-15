import { Link } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addItem } = useQuote();

  function handleAddToQuote() {
    addItem(product, 1);
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">{formatMoney(product.priceCents)}</p>

        <div className="product-card__actions">
          <Link to={`/rentals/${product.id}`} className="secondary-button">
            View details
          </Link>

          <button type="button" className="primary-button" onClick={handleAddToQuote}>
            Add to quote
          </button>
        </div>
      </div>
    </article>
  );
}