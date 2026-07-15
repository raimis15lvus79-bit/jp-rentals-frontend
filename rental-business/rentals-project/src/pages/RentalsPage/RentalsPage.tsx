import { useMemo, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { sampleProducts } from '../../data/sampleProducts';
import './RentalsPage.css';

export function RentalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'tables', 'chairs', 'yard-games', 'event-items'];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return sampleProducts;
    }

    return sampleProducts.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <Header />
      <main className="rentals-page">
        <section className="rentals-header">
          <p className="rentals-eyebrow">Rental inventory</p>
          <h1>Browse rentals</h1>
          <p>
            Choose the items you need, then build your quote online.
          </p>
        </section>

        <section className="rentals-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'filter-button active' : 'filter-button'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="rentals-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </>
  );
}