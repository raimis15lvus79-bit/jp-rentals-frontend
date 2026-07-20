import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export type FulfillmentType = 'pickup' | 'delivery';

export type QuoteItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  image: string;
};

export type RentalDates = {
  startDate: string;
  endDate: string;
};

export type QuoteContextValue = {
  items: QuoteItem[];
  rentalDates: RentalDates;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string;
  addItem: (item: Omit<QuoteItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearQuote: () => void;
  setRentalDates: (dates: RentalDates) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setDeliveryAddress: (address: string) => void;
};

export type QuoteProviderProps = {
  children: ReactNode;
};

export const QuoteContext = createContext<QuoteContextValue | undefined>(undefined);

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }

  return context;
}