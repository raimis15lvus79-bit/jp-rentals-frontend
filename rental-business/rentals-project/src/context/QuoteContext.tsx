import { createContext, useContext } from 'react';

export type QuoteItem = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  pricingLabel: string;
  quantity: number;
};

export type RentalDates = {
  start: string;
  end: string;
};

export type FulfillmentType = 'pickup' | 'delivery';

export type DeliveryAddressDetails = {
  formattedAddress: string;
  placeId: string;
  lat: number | null;
  lng: number | null;
};

type QuoteContextValue = {
  items: QuoteItem[];
  rentalDates: RentalDates;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string;
  deliveryAddressDetails: DeliveryAddressDetails | null;
  addItem: (item: Omit<QuoteItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setRentalDates: (dates: RentalDates) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryAddressDetails: (details: DeliveryAddressDetails | null) => void;
  clearQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined);

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }

  return context;
}

export { QuoteContext };