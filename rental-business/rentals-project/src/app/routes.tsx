import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage/HomePage';
import { RentalsPage } from '../pages/RentalsPage/RentalsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage/ProductDetailsPage';
import { QuotePage } from '../pages/QuotePage/QuotePage';
import { CheckoutPage } from '../pages/CheckoutPage/CheckoutPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/rentals" element={<RentalsPage />} />
      <Route path="/rentals/:id" element={<ProductDetailsPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/checkout/success" element={<CheckoutPage />} />
    </Routes>
  );
}