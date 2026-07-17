import { Footer } from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { sampleProducts } from '../../data/sampleProducts';
import './RentalsPage.css';

const categories = [
  { label: 'All Rentals', value: 'all' },
  { label: 'Chairs', value: 'chairs' },
  { label: 'Tables', value: 'tables' },
  { label: 'Games', value: 'games' },
  { label: 'Yard Games', value: 'yard-games' },
  { label: 'Concessions', value: 'concessions' }
];

export function RentalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    const products =
      selectedCategory === 'all'
        ? sampleProducts
        : sampleProducts.filter((product) => product.category === selectedCategory);

    return [...products].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [selectedCategory]);

  const visibleProducts = filteredProducts.filter((product) => product.available);

  return (
    <>
      <Header />

      <main className="rentals-page">
        <section className="rentals-hero">
          <p className="rentals-eyebrow">Browse rentals</p>
          <h1>Chairs, Tables, Games, Concessions, and Event Rentals.</h1>
          <p>
  Browse available rentals, add items to your quote, and submit your inquiry
  when you're ready. Start with chairs and tables, then add games,
  concessions, and extras.
</p>
        </section>

        <section className="rentals-filters" aria-label="Rental categories">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={`filter-button ${
                selectedCategory === category.value ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </section>

        <p className="rentals-results-count">
  {visibleProducts.length} item{visibleProducts.length === 1 ? '' : 's'} available
</p>

        <section className="rentals-grid">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="rentals-empty-state">
              <h2>No rentals available in this category right now.</h2>
              <p>
                Try another category or continue to your quote to review the items
                you already selected.
              </p>
              <Link to="/quote" className="primary-button">
                View Quote
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}