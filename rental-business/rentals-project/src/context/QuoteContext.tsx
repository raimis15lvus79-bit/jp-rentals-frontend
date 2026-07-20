import { useCallback, useMemo, useState } from 'react';
import {
  QuoteContext,
  type FulfillmentType,
  type QuoteItem,
  type QuoteProviderProps,
  type QuoteContextValue,
  type RentalDates,
} from './QuoteContext';

const defaultRentalDates: RentalDates = {
  startDate: '',
  endDate: '',
};

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [rentalDates, setRentalDates] = useState<RentalDates>(defaultRentalDates);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const addItem = useCallback((item: Omit<QuoteItem, 'quantity'>) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((currentItem) => currentItem.id === item.id);

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearQuote = useCallback(() => {
    setItems([]);
    setRentalDates(defaultRentalDates);
    setFulfillmentType('pickup');
    setDeliveryAddress('');
  }, []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      addItem,
      removeItem,
      updateQuantity,
      clearQuote,
      setRentalDates,
      setFulfillmentType,
      setDeliveryAddress,
    }),
    [
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      addItem,
      removeItem,
      updateQuantity,
      clearQuote,
    ]
  );

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}