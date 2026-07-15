import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./app/routes";
import { QuoteProvider } from './context/QuoteContext';

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <AppRoutes />
      </QuoteProvider>
    </BrowserRouter>
  );
}