import { Link } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { formatMoney } from '../../utils/money';
import './ProductCard.css';

type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  pricingLabel: string;
  priceCents: number;
  available: boolean;
};

type ProductCardProps = {
  product: Product;
};

function formatCategoryLabel(category: string) {
  if (category === 'yard-games') {
    return 'Yard Games';
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useQuote();

  const isUnavailable = !product.available;

  function handleAddToQuote() {
    if (isUnavailable) {
      return;
    }

    addItem(product);
  }

  function renderPricingText() {
    if (product.pricingLabel === 'Request pricing') {
      return 'Request pricing';
    }

    return `${product.pricingLabel} ${formatMoney(product.priceCents)}`;
  }

  return (
    <article className={`product-card ${isUnavailable ? 'is-unavailable' : ''}`}>
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        <span
          className={`product-card__badge ${
            isUnavailable ? 'unavailable' : 'available'
          }`}
        >
          {isUnavailable ? 'Unavailable' : 'Available'}
        </span>
      </div>

      <div className="product-card__content">
        <p className="product-card__category">
          {formatCategoryLabel(product.category)}
        </p>

        <h2 className="product-card__title">{product.name}</h2>

        <p className="product-card__description">{product.shortDescription}</p>

        <div className="product-card__footer">
          <p className="product-card__price">{renderPricingText()}</p>

          <div className="product-card__actions">
            <Link to={`/rentals/${product.id}`} className="secondary-button">
              View Details
            </Link>

            <button
              type="button"
              className="primary-button"
              onClick={handleAddToQuote}
              disabled={isUnavailable}
            >
              {isUnavailable ? 'Not Available' : 'Add to Quote'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}