import { Link, useParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useQuote } from '../../context/QuoteContext';
import { sampleProducts } from '../../data/sampleProducts';
import { formatMoney } from '../../utils/money';
import './ProductDetailsPage.css';

function formatCategoryLabel(category: string) {
  if (category === 'yard-games') {
    return 'Yard Games';
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useQuote();

  const foundProduct = sampleProducts.find((item) => item.id === id);

  if (!foundProduct) {
    return (
      <>
        <Header />
        <main className="product-details-page">
          <section className="product-details-empty">
            <p className="product-details-eyebrow">Rental not found</p>
            <h1>We couldn’t find that rental item.</h1>
            <p>Try going back to the rentals page to browse available items.</p>
            <Link to="/rentals" className="primary-button">
              Back to Rentals
            </Link>
          </section>
        </main>
      </>
    );
  }

  const product = foundProduct;
  const isUnavailable = product.inventory <= 0;

  function renderPricingText() {
    if (product.pricingLabel === 'Request pricing') {
      return 'Request pricing';
    }

    return `${product.pricingLabel} ${formatMoney(product.priceCents)}`;
  }

  function handleAddToQuote() {
    if (isUnavailable) {
      return;
    }

    addItem(product);
  }

  return (
    <>
      <Header />
      <main className="product-details-page">
        <section className="product-details-layout">
          <div className="product-details-image-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />
          </div>

          <div className="product-details-content">
            <p className="product-details-category">
              {formatCategoryLabel(product.category)}
            </p>

            <h1>{product.name}</h1>

            <p className="product-details-inventory">
              Inventory: {product.inventory}
            </p>

            <p className="product-details-price">{renderPricingText()}</p>

            <p className="product-details-description">{product.description}</p>

            <div className="product-details-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleAddToQuote}
                disabled={isUnavailable}
              >
                {isUnavailable ? 'Not Available' : 'Add to Quote'}
              </button>

              <Link to="/quote" className="secondary-button">
                View Quote
              </Link>
            </div>

            <div className="product-details-note">
              <p>
                Final pricing and availability are confirmed after your inquiry is reviewed.
              </p>
              <p>
                Pickup and delivery quote options are available during the quote process.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}