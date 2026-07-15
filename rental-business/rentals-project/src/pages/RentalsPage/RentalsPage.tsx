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
    if (selectedCategory === 'all') {
      return sampleProducts;
    }

    return sampleProducts.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <Header />

      <main className="rentals-page">
        <section className="rentals-hero">
          <p className="rentals-eyebrow">Browse rentals</p>
          <h1>Chairs, tables, games, concessions, and event rentals.</h1>
          <p>
            Explore available rentals and add items to your quote before sending your inquiry.
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

        <section className="rentals-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </>
  );
}